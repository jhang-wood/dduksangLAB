// Database Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface AITrend {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail_url?: string;
  category: string;
  tags: string[];
  source_url?: string;
  source_name?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  is_featured: boolean;
  is_published: boolean;
  published_at?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface SystemSettings {
  id: string;
  site_name: string;
  site_description: string;
  admin_email: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
  require_email_verification: boolean;
  max_file_size: number;
  allowed_file_types: string[];
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: PaginationInfo;
}

// Auth Types
export interface SignUpMetadata {
  name?: string;
  phone?: string;
  selected_plan?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Telegram Types
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

// Environment Types
export interface ClientEnvVars {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_TOSS_CLIENT_KEY?: string;
  NEXT_PUBLIC_APP_URL: string;
}

export interface ServerEnvVars {
  SUPABASE_SERVICE_ROLE_KEY: string;
  TOSS_SECRET_KEY?: string;
  PAYAPP_SECRET_KEY?: string;
  PAYAPP_VALUE?: string;
  PAYAPP_USER_CODE?: string;
  PAYAPP_STORE_ID?: string;
  OPENAI_API_KEY?: string;
  GEMINI_API_KEY?: string;
  JWT_SECRET?: string;
  ENCRYPTION_KEY?: string;
  CRON_SECRET?: string;
  TELEGRAM_WEBHOOK_SECRET: string;
  TELEGRAM_ALLOWED_USER_ID: string;
  N8N_WEBHOOK_URL: string;
  DATABASE_URL?: string;

  // MCP Automation
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TELEGRAM_BUSINESS_TOKEN?: string;
}

// MCP Automation Types
export interface AutomationLog {
  id?: string;
  type: 'login' | 'publish' | 'error' | 'performance' | 'health_check';
  status: 'success' | 'failure' | 'warning' | 'info';
  message: string;
  metadata?: Record<string, any>;
  created_at?: string;
  user_id?: string;
}

export interface ContentItem {
  id?: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  author_id?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetric {
  id?: string;
  metric_type: string;
  value: number;
  unit: string;
  page_url?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HealthCheckResult {
  id?: string;
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  response_time?: number;
  error_message?: string;
  checked_at: string;
  metadata?: Record<string, any>;
}

export interface NotificationMessage {
  id?: string;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error' | 'critical';
  channels: NotificationChannel[];
  metadata?: Record<string, any>;
  retryCount?: number;
  scheduledAt?: Date;
}

export interface NotificationChannel {
  type: 'email' | 'telegram' | 'telegram_business' | 'webhook' | 'sms';
  config: {
    recipient?: string;
    webhook_url?: string;
    chat_id?: string;
    phone_number?: string;
    [key: string]: any;
  };
  enabled: boolean;
}

export interface BlogPostData {
  id?: string;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  featured?: boolean;
  publishDate?: Date;
  authorId?: string;
  status?: 'draft' | 'scheduled' | 'published';
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: ServiceHealth[];
  alerts: HealthAlert[];
  recommendations: string[];
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface HealthAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  service: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}
