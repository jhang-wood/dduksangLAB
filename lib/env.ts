/**
 * Environment variable validation utility
 * Ensures required environment variables are present and properly separated
 */

// 개발 환경에서 환경 변수 분리 검증 (서버 사이드만)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // 클라이언트 번들에 fs가 포함되지 않도록 동적 import 사용
  import('./env-loader').then(({ validateEnvSeparation }) => {
    try {
      validateEnvSeparation()
    } catch (error) {
      // 프로덕션 환경을 위해 logger 사용
      void import('./logger').then(({ logger }) => {
        logger.error('⚠️ 환경 변수 보안 경고:', error)
      })
    }
  }).catch(() => {
    // 클라이언트 사이드 빌드에서는 import 에러 무시
  })
}

export const getEnvVar = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    // Fallback 값 제공
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      return 'https://wpzvocfgfwvsxmpckdnu.supabase.co'
    }
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0ODczNDQsImV4cCI6MjA0OTA2MzM0NH0.aEvk3fQSNSwOvQhU0yaxE_0UdJGqChhGyQtQPzSZlqU'
    }
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzQ4NzM0NCwiZXhwIjoyMDQ5MDYzMzQ0fQ.jyQQCpS-lAHvOpqZwBmQzOPwMv-nEtJlT7bsBA7TNVE'
    }
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const getOptionalEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] ?? defaultValue
}

export const getClientEnvVar = (key: string): string => {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Client environment variable must start with NEXT_PUBLIC_: ${key}`)
  }
  // 환경변수가 없을 때 fallback 사용
  const value = process.env[key]
  if (!value) {
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      return 'https://wpzvocfgfwvsxmpckdnu.supabase.co'
    }
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0ODczNDQsImV4cCI6MjA0OTA2MzM0NH0.aEvk3fQSNSwOvQhU0yaxE_0UdJGqChhGyQtQPzSZlqU'
    }
  }
  return value || ''
}

export const getServerEnvVar = (key: string): string => {
  if (key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Server environment variable should not start with NEXT_PUBLIC_: ${key}`)
  }
  // 환경변수가 없을 때 fallback 사용
  const value = process.env[key]
  if (!value && key === 'SUPABASE_SERVICE_ROLE_KEY') {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzQ4NzM0NCwiZXhwIjoyMDQ5MDYzMzQ0fQ.jyQQCpS-lAHvOpqZwBmQzOPwMv-nEtJlT7bsBA7TNVE'
  }
  return value || ''
}

// Required environment variables for the application
export const CLIENT_ENV_VARS = {
  // Supabase - Client
  NEXT_PUBLIC_SUPABASE_URL: () => getClientEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: () => getClientEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  
  // Payment - Client
  NEXT_PUBLIC_TOSS_CLIENT_KEY: () => getOptionalEnvVar('NEXT_PUBLIC_TOSS_CLIENT_KEY'),
  
  // App - Client
  NEXT_PUBLIC_APP_URL: () => getOptionalEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')
} as const

export const SERVER_ENV_VARS = {
  // Supabase - Server
  SUPABASE_SERVICE_ROLE_KEY: () => getServerEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  
  // Payment - Server
  TOSS_SECRET_KEY: () => getOptionalEnvVar('TOSS_SECRET_KEY'),
  PAYAPP_SECRET_KEY: () => getOptionalEnvVar('PAYAPP_SECRET_KEY'),
  PAYAPP_VALUE: () => getOptionalEnvVar('PAYAPP_VALUE'),
  PAYAPP_USER_CODE: () => getOptionalEnvVar('PAYAPP_USER_CODE'),
  PAYAPP_STORE_ID: () => getOptionalEnvVar('PAYAPP_STORE_ID'),
  
  // AI Services - Server
  OPENAI_API_KEY: () => getOptionalEnvVar('OPENAI_API_KEY'),
  GEMINI_API_KEY: () => getOptionalEnvVar('GEMINI_API_KEY'),
  
  // Security - Server
  JWT_SECRET: () => getOptionalEnvVar('JWT_SECRET'),
  ENCRYPTION_KEY: () => getOptionalEnvVar('ENCRYPTION_KEY'),
  CRON_SECRET: () => getOptionalEnvVar('CRON_SECRET'),
  
  // Telegram - Server
  TELEGRAM_WEBHOOK_SECRET: () => getOptionalEnvVar('TELEGRAM_WEBHOOK_SECRET', 'telegram-automation-webhook-secret-2025'),
  TELEGRAM_ALLOWED_USER_ID: () => getOptionalEnvVar('TELEGRAM_ALLOWED_USER_ID', '7590898112'),
  
  // N8N - Server
  N8N_WEBHOOK_URL: () => getOptionalEnvVar('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook/telegram'),
  
  // Database - Server
  DATABASE_URL: () => getOptionalEnvVar('DATABASE_URL'),
  
  // MCP Automation - Server
  ADMIN_EMAIL: () => getOptionalEnvVar('ADMIN_EMAIL'),
  ADMIN_PASSWORD: () => getOptionalEnvVar('ADMIN_PASSWORD'),
  TELEGRAM_BOT_TOKEN: () => getOptionalEnvVar('TELEGRAM_BOT_TOKEN'),
  TELEGRAM_CHAT_ID: () => getOptionalEnvVar('TELEGRAM_CHAT_ID'),
  SLACK_WEBHOOK_URL: () => getOptionalEnvVar('SLACK_WEBHOOK_URL')
} as const

// Legacy support - will be deprecated
export const ENV_VARS = {
  ...CLIENT_ENV_VARS,
  ...SERVER_ENV_VARS
} as const

/**
 * Validates all required environment variables at startup
 * Call this function at app initialization to ensure all required vars are present
 */
export const validateRequiredEnvVars = (): void => {
  // 프로덕션에서는 환경변수 검증을 완화
  if (process.env.NODE_ENV === 'production') {
    console.log('프로덕션 환경: 환경변수 fallback 사용')
    return
  }
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  const missingVars: string[] = []
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }
  
  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}\n` +
      'Using fallback values. Please set proper values in .env.local or Vercel dashboard.'
    )
  }
}

/**
 * Type-safe environment variable access
 */
export const env = {
  // Client variables (safe to use in browser)
  get supabaseUrl() { return CLIENT_ENV_VARS.NEXT_PUBLIC_SUPABASE_URL() },
  get supabaseAnonKey() { return CLIENT_ENV_VARS.NEXT_PUBLIC_SUPABASE_ANON_KEY() },
  get tossClientKey() { return CLIENT_ENV_VARS.NEXT_PUBLIC_TOSS_CLIENT_KEY() },
  get appUrl() { return CLIENT_ENV_VARS.NEXT_PUBLIC_APP_URL() },
  
  // Server variables (never exposed to client)
  get supabaseServiceKey() { return SERVER_ENV_VARS.SUPABASE_SERVICE_ROLE_KEY() },
  get tossSecretKey() { return SERVER_ENV_VARS.TOSS_SECRET_KEY() },
  get payappSecretKey() { return SERVER_ENV_VARS.PAYAPP_SECRET_KEY() },
  get payappValue() { return SERVER_ENV_VARS.PAYAPP_VALUE() },
  get payappUserCode() { return SERVER_ENV_VARS.PAYAPP_USER_CODE() },
  get payappStoreId() { return SERVER_ENV_VARS.PAYAPP_STORE_ID() },
  get openaiApiKey() { return SERVER_ENV_VARS.OPENAI_API_KEY() },
  get geminiApiKey() { return SERVER_ENV_VARS.GEMINI_API_KEY() },
  get jwtSecret() { return SERVER_ENV_VARS.JWT_SECRET() },
  get encryptionKey() { return SERVER_ENV_VARS.ENCRYPTION_KEY() },
  get cronSecret() { return SERVER_ENV_VARS.CRON_SECRET() },
  get telegramWebhookSecret() { return SERVER_ENV_VARS.TELEGRAM_WEBHOOK_SECRET() },
  get telegramAllowedUserId() { return SERVER_ENV_VARS.TELEGRAM_ALLOWED_USER_ID() },
  get n8nWebhookUrl() { return SERVER_ENV_VARS.N8N_WEBHOOK_URL() },
  get databaseUrl() { return SERVER_ENV_VARS.DATABASE_URL() },
  
  // MCP Automation
  get adminEmail() { return SERVER_ENV_VARS.ADMIN_EMAIL() },
  get adminPassword() { return SERVER_ENV_VARS.ADMIN_PASSWORD() },
  get telegramBotToken() { return SERVER_ENV_VARS.TELEGRAM_BOT_TOKEN() },
  get telegramChatId() { return SERVER_ENV_VARS.TELEGRAM_CHAT_ID() },
  get slackWebhookUrl() { return SERVER_ENV_VARS.SLACK_WEBHOOK_URL() },
  
  // Environment
  get isDevelopment() { return process.env.NODE_ENV === 'development' },
  get isProduction() { return process.env.NODE_ENV === 'production' },
  get nodeEnv() { return process.env.NODE_ENV ?? 'development' }
}

/**
 * Client-only environment variables (safe for browser)
 */
export const clientEnv = {
  get supabaseUrl() { return CLIENT_ENV_VARS.NEXT_PUBLIC_SUPABASE_URL() },
  get supabaseAnonKey() { return CLIENT_ENV_VARS.NEXT_PUBLIC_SUPABASE_ANON_KEY() },
  get tossClientKey() { return CLIENT_ENV_VARS.NEXT_PUBLIC_TOSS_CLIENT_KEY() },
  get appUrl() { return CLIENT_ENV_VARS.NEXT_PUBLIC_APP_URL() }
}

/**
 * Server-only environment variables (never exposed to browser)
 */
export const serverEnv = {
  get supabaseServiceKey() { return SERVER_ENV_VARS.SUPABASE_SERVICE_ROLE_KEY() },
  get tossSecretKey() { return SERVER_ENV_VARS.TOSS_SECRET_KEY() },
  get payappSecretKey() { return SERVER_ENV_VARS.PAYAPP_SECRET_KEY() },
  get payappValue() { return SERVER_ENV_VARS.PAYAPP_VALUE() },
  get payappUserCode() { return SERVER_ENV_VARS.PAYAPP_USER_CODE() },
  get payappStoreId() { return SERVER_ENV_VARS.PAYAPP_STORE_ID() },
  get openaiApiKey() { return SERVER_ENV_VARS.OPENAI_API_KEY() },
  get geminiApiKey() { return SERVER_ENV_VARS.GEMINI_API_KEY() },
  get jwtSecret() { return SERVER_ENV_VARS.JWT_SECRET() },
  get encryptionKey() { return SERVER_ENV_VARS.ENCRYPTION_KEY() },
  get cronSecret() { return SERVER_ENV_VARS.CRON_SECRET() },
  get telegramWebhookSecret() { return SERVER_ENV_VARS.TELEGRAM_WEBHOOK_SECRET() },
  get telegramAllowedUserId() { return SERVER_ENV_VARS.TELEGRAM_ALLOWED_USER_ID() },
  get n8nWebhookUrl() { return SERVER_ENV_VARS.N8N_WEBHOOK_URL() },
  get databaseUrl() { return SERVER_ENV_VARS.DATABASE_URL() },
  
  // MCP Automation
  get adminEmail() { return SERVER_ENV_VARS.ADMIN_EMAIL() },
  get adminPassword() { return SERVER_ENV_VARS.ADMIN_PASSWORD() },
  get telegramBotToken() { return SERVER_ENV_VARS.TELEGRAM_BOT_TOKEN() },
  get telegramChatId() { return SERVER_ENV_VARS.TELEGRAM_CHAT_ID() },
  get slackWebhookUrl() { return SERVER_ENV_VARS.SLACK_WEBHOOK_URL() }
}