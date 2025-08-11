import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
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

// Server component client (respects RLS) - Always create new instance for cookies
export const createServerClient = () => {
  return createServerComponentClient({ cookies })
}

// Server action client (respects RLS) - Always create new instance for cookies  
export const createActionClient = () => {
  return createServerActionClient({ cookies })
}