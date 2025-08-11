import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

// Initialize Supabase client with validated environment variables
// 직접 process.env에서 읽기 (Next.js는 빌드 시점에 이를 처리)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpzvocfgfwvsxmpckdnu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0ODczNDQsImV4cCI6MjA0OTA2MzM0NH0.aEvk3fQSNSwOvQhU0yaxE_0UdJGqChhGyQtQPzSZlqU'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ 환경변수가 설정되지 않아 기본값을 사용합니다.')
  }
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