import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import { env, serverEnv } from '@/lib/env'

// Initialize Supabase URL
let supabaseUrl: string

try {
  supabaseUrl = env.supabaseUrl
} catch (error) {
  logger.error('⚠️ Supabase 환경 변수가 설정되지 않았습니다.')
  logger.error(error)
  supabaseUrl = 'http://localhost'
}

// Server-side admin client (uses service role key) - USE WITH CAUTION
export const createAdminClient = () => {
  try {
    const serviceKey = serverEnv.supabaseServiceKey
    return createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } catch (error) {
    logger.error('Failed to create admin Supabase client:', error)
    throw new Error('Admin client initialization failed')
  }
}

// Server component client (respects RLS)
export const createServerClient = () => {
  return createServerComponentClient({ cookies })
}

// Server action client (respects RLS)
export const createActionClient = () => {
  return createServerActionClient({ cookies })
}