// Database Types
export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  bio?: string
  role: 'user' | 'admin' | 'moderator'
  avatar_url?: string
  created_at: string
  updated_at?: string
}

export interface AITrend {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  thumbnail_url?: string
  category: string
  tags: string[]
  source_url?: string
  source_name?: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  is_featured: boolean
  is_published: boolean
  published_at?: string
  created_by: string
  created_at: string
  updated_at?: string
}

export interface SystemSettings {
  id: string
  site_name: string
  site_description: string
  admin_email: string
  maintenance_mode: boolean
  allow_registration: boolean
  require_email_verification: boolean
  max_file_size: number
  allowed_file_types: string[]
  created_at: string
  updated_at: string
}

// API Response Types
export interface APIResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: PaginationInfo
}

// Auth Types
export interface SignUpMetadata {
  name?: string
  phone?: string
  selected_plan?: string
}

export interface AuthError {
  message: string
  status?: number
}

// Telegram Types
export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  username?: string
}

export interface TelegramChat {
  id: number
  type: string
}

export interface TelegramMessage {
  message_id: number
  from: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

// Environment Types
export interface ClientEnvVars {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NEXT_PUBLIC_TOSS_CLIENT_KEY?: string
  NEXT_PUBLIC_APP_URL: string
}

export interface ServerEnvVars {
  SUPABASE_SERVICE_ROLE_KEY: string
  TOSS_SECRET_KEY?: string
  PAYAPP_SECRET_KEY?: string
  PAYAPP_VALUE?: string
  PAYAPP_USER_CODE?: string
  PAYAPP_STORE_ID?: string
  OPENAI_API_KEY?: string
  GEMINI_API_KEY?: string
  JWT_SECRET?: string
  ENCRYPTION_KEY?: string
  CRON_SECRET?: string
  TELEGRAM_WEBHOOK_SECRET: string
  TELEGRAM_ALLOWED_USER_ID: string
  N8N_WEBHOOK_URL: string
  DATABASE_URL?: string
}