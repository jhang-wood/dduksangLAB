import { createClient } from '@supabase/supabase-js'

// Environment variables with fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpzvocfgfwvsxmpckdnu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Njc4NTIsImV4cCI6MjA2ODI0Mzg1Mn0.LlO3iM55sbzXexcCExkDsSH448J2Z-NJUT1aZQCdck8'

// Log environment variable status for debugging
if (typeof window !== 'undefined') {
  console.log('🔧 Supabase Client Environment Check:', {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    urlPreview: `${supabaseUrl.substring(0, 30)  }...`,
    keyPreview: `${supabaseAnonKey.substring(0, 20)  }...`
  })
}

// Singleton Supabase client instance to prevent multiple GoTrueClient instances
let supabaseInstance: any = null

const createSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabaseInstance
}

// Client-side Supabase client (uses anon key)
export const supabase = createSupabaseClient()

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}