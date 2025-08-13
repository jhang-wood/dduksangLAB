/**
 * Environment variable validation utility
 * Ensures required environment variables are present and properly separated
 */
import { z } from "zod";

// Zod schema for environment variables
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_USE_MOCK: z.enum(["1", "0"]).optional(),
});

// Parse and validate environment variables
const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK,
};

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success && process.env.NODE_ENV === "development") {
  console.warn("[env] Invalid environment variables:", parsedEnv.error.format());
}

const safeEnv = parsedEnv.success ? parsedEnv.data : {};

// Determine if we have real keys (not dummy values)
const isDummyKey = (key: string | undefined) => {
  if (!key) return true;
  const dummyPatterns = [
    "your-supabase-anon-key",
    "your-project.supabase.co",
    "example",
    "dummy",
    "test-key",
    "placeholder"
  ];
  return dummyPatterns.some(pattern => key.toLowerCase().includes(pattern));
};

export const HAS_REAL_KEYS = !!(
  safeEnv.NEXT_PUBLIC_SUPABASE_URL &&
  safeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !isDummyKey(safeEnv.NEXT_PUBLIC_SUPABASE_URL) &&
  !isDummyKey(safeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);

export const USE_MOCK_FLAG = safeEnv.NEXT_PUBLIC_USE_MOCK === "1";

// 개발 환경에서 환경 변수 분리 검증 (서버 사이드만)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  // 클라이언트 번들에 fs가 포함되지 않도록 동적 import 사용
  import('./env-loader')
    .then(({ validateEnvSeparation }) => {
      try {
        validateEnvSeparation();
      } catch (error) {
        // 프로덕션 환경을 위해 logger 사용
        void import('./logger').then(({ logger }) => {
          logger.error('⚠️ 환경 변수 보안 경고:', error);
        });
      }
    })
    .catch(() => {
      // 클라이언트 사이드 빌드에서는 import 에러 무시
    });
}

export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const getOptionalEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] ?? defaultValue;
};

export const getClientEnvVar = (key: string): string => {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Client environment variable must start with NEXT_PUBLIC_: ${key}`);
  }
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const getServerEnvVar = (key: string): string => {
  if (key.startsWith('NEXT_PUBLIC_')) {
    throw new Error(`Server environment variable should not start with NEXT_PUBLIC_: ${key}`);
  }
  const value = process.env[key];
  return value || '';
};

// Required environment variables for the application
export const CLIENT_ENV_VARS = {
  // Supabase - Client
  NEXT_PUBLIC_SUPABASE_URL: () => getClientEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: () => getClientEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),

  // Payment - Client
  NEXT_PUBLIC_TOSS_CLIENT_KEY: () => getOptionalEnvVar('NEXT_PUBLIC_TOSS_CLIENT_KEY'),

  // App - Client
  NEXT_PUBLIC_APP_URL: () => getOptionalEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
} as const;

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
  TELEGRAM_WEBHOOK_SECRET: () =>
    getOptionalEnvVar('TELEGRAM_WEBHOOK_SECRET', 'telegram-automation-webhook-secret-2025'),
  TELEGRAM_ALLOWED_USER_ID: () => getOptionalEnvVar('TELEGRAM_ALLOWED_USER_ID', '7590898112'),

  // N8N - Server
  N8N_WEBHOOK_URL: () =>
    getOptionalEnvVar('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook/telegram'),

  // Database - Server
  DATABASE_URL: () => getOptionalEnvVar('DATABASE_URL'),

  // MCP Automation - Server
  ADMIN_EMAIL: () => getOptionalEnvVar('ADMIN_EMAIL'),
  ADMIN_PASSWORD: () => getOptionalEnvVar('ADMIN_PASSWORD'),
  TELEGRAM_BOT_TOKEN: () => getOptionalEnvVar('TELEGRAM_BOT_TOKEN'),
  TELEGRAM_CHAT_ID: () => getOptionalEnvVar('TELEGRAM_CHAT_ID'),
  SLACK_WEBHOOK_URL: () => getOptionalEnvVar('SLACK_WEBHOOK_URL'),
} as const;

// Legacy support - will be deprecated
export const ENV_VARS = {
  ...CLIENT_ENV_VARS,
  ...SERVER_ENV_VARS,
} as const;

/**
 * Validates all required environment variables at startup
 * Call this function at app initialization to ensure all required vars are present
 */
export const validateRequiredEnvVars = (): void => {
  // 프로덕션에서는 환경변수 검증을 완화
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}\n` +
        'Using fallback values. Please set proper values in .env.local or Vercel dashboard.'
    );
  }
};

/**
 * Type-safe environment variable access
 * Combines client and server environment variables with helper utilities
 */
export const env = {
  // New safe environment variables
  SUPABASE_URL: safeEnv.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: safeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  HAS_REAL_KEYS,
  USE_MOCK: USE_MOCK_FLAG,

  // Client variables (safe to use in browser)
  ...Object.fromEntries(
    Object.entries(CLIENT_ENV_VARS).map(([key, fn]) => [
      key.replace('NEXT_PUBLIC_', '').toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      fn
    ])
  ),

  // Server variables (never exposed to client) 
  ...Object.fromEntries(
    Object.entries(SERVER_ENV_VARS).map(([key, fn]) => [
      key.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      fn
    ])
  ),

  // Environment helpers
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  get nodeEnv() {
    return process.env.NODE_ENV ?? 'development';
  },
} as const;

/**
 * Client-only environment variables (safe for browser)
 */
export const clientEnv = Object.fromEntries(
  Object.entries(CLIENT_ENV_VARS).map(([key, fn]) => [
    key.replace('NEXT_PUBLIC_', '').toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
    fn
  ])
);

/**
 * Server-only environment variables (never exposed to browser)
 */
export const serverEnv = Object.fromEntries(
  Object.entries(SERVER_ENV_VARS).map(([key, fn]) => [
    key.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
    fn
  ])
);
