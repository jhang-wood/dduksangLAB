import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Singleton instances to prevent multiple GoTrueClient instances
let adminClientInstance: any = null

// Server-side admin client (uses service role key) - USE WITH CAUTION
export const createAdminClient = () => {
  if (!adminClientInstance) {
    adminClientInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return adminClientInstance
}

// Custom server client for Next.js 14 App Router
export const createServerClient = () => {
  const cookieStore = cookies()

  // Get all cookies that start with 'sb-'
  const supabaseCookies = cookieStore.getAll()
    .filter(cookie => cookie.name.startsWith('sb-'))
    .reduce((acc, cookie) => {
      acc[cookie.name] = cookie.value
      return acc
    }, {} as Record<string, string>)

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storage: {
        getItem: (key: string) => {
          // Try different cookie name patterns
          const cookieNames = [
            key,
            `sb-${key}`,
            `sb-${supabaseUrl?.split('//')[1]?.split('.')[0]}-${key}`
          ]
          
          for (const cookieName of cookieNames) {
            const value = supabaseCookies[cookieName] || cookieStore.get(cookieName)?.value
            if (value) {
              logger.log(`[Server] Found cookie ${cookieName}:`, value?.substring(0, 50) + '...')
              return value
            }
          }
          return null
        },
        setItem: (key: string, value: string) => {
          // No-op for server side
        },
        removeItem: (key: string) => {
          // No-op for server side
        }
      }
    },
    global: {
      headers: {
        // Pass cookies as headers
        'Cookie': cookieStore.toString()
      }
    }
  })
}

// Server action client - same as server client for API routes
export const createActionClient = createServerClient