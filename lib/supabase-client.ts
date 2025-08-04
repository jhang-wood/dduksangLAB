import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

// Initialize Supabase client with validated environment variables
let supabaseUrl: string
let supabaseAnonKey: string

try {
  supabaseUrl = env.supabaseUrl
  supabaseAnonKey = env.supabaseAnonKey
} catch (error) {
  logger.error('⚠️ Supabase 환경 변수가 설정되지 않았습니다. Vercel 대시보드에서 환경 변수를 설정해주세요.')
  logger.error(error)
  // Use dummy values for development
  supabaseUrl = 'http://localhost'
  supabaseAnonKey = 'dummy-key'
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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