/**
 * Jest 환경 변수 설정
 * 테스트 실행 시 필요한 환경 변수들을 설정
 */

// 테스트 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Supabase 테스트 모드 설정
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

// API 모킹 설정
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.GOOGLE_AI_API_KEY = 'test-google-key';

// Redis 모킹 설정
process.env.REDIS_URL = 'redis://localhost:6379';

// 기타 테스트 설정
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.ENCRYPTION_KEY = 'test-encryption-key';

// Playwright 브라우저 모드 비활성화 (Jest 테스트에서는 필요 없음)
process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1';

console.log('🧪 Jest 테스트 환경 변수 설정 완료');