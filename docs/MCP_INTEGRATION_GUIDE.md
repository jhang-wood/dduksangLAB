# MCP 통합 시스템 가이드

dduksangLAB에 PlaywrightMCP와 SupabaseMCP가 성공적으로 통합되었습니다.

## 📋 구현된 컴포넌트

### 🎯 MCP 서버 연결 관리자

- **PlaywrightController** (`lib/mcp/playwright-controller.ts`)
  - 브라우저 자동화 및 웹 상호작용
  - 관리자 로그인 자동화
  - 콘텐츠 자동 게시
  - 스크린샷 캡처 및 성능 메트릭 수집

- **SupabaseController** (`lib/mcp/supabase-controller.ts`)
  - 데이터베이스 상태 관리
  - 자동화 로그 기록
  - 성능 메트릭 저장
  - 헬스체크 결과 관리

### 🎭 자동화 오케스트레이터

- **AutomationOrchestrator** (`lib/mcp/orchestrator.ts`)
  - PlaywrightMCP와 SupabaseMCP 조율
  - 복합 워크플로우 실행
  - 로그인 → 게시 → 검증 파이프라인

- **ErrorHandler** (`lib/mcp/error-handler.ts`)
  - 에러 처리 및 복구 시스템
  - 재시도 메커니즘
  - 자동 복구 액션

### 🤖 자동화 서비스

- **BlogPublisher** (`lib/automation/blog-publisher.ts`)
  - 블로그 콘텐츠 자동 게시
  - 콘텐츠 검증
  - 예약 게시 관리

- **ContentManager** (`lib/automation/content-manager.ts`)
  - AI 콘텐츠 생성 및 관리
  - 중복 검사
  - 품질 평가

- **AutomationScheduler** (`lib/automation/scheduler.ts`)
  - 주기적 작업 스케줄링
  - Cron 작업 관리
  - 작업 상태 모니터링

### 📊 모니터링 시스템

- **HealthChecker** (`lib/monitoring/health-checker.ts`)
  - 시스템 헬스체크
  - 서비스 상태 모니터링
  - 알림 트리거

- **NotificationService** (`lib/monitoring/notification-service.ts`)
  - 다중 채널 알림 발송
  - 텔레그램, 슬랙, 이메일 지원
  - 템플릿 기반 알림

### 🌐 Next.js API 라우트

- `/api/automation/health` - 헬스체크
- `/api/automation/scheduler` - 스케줄러 제어
- `/api/automation/content` - 콘텐츠 관리
- `/api/automation/orchestrator` - 워크플로우 실행
- `/api/automation/notifications` - 알림 발송
- `/api/cron/automation` - Cron 작업 엔드포인트

## 🚀 설정 및 사용법

### 1. 환경변수 설정

```bash
# .env.local 파일 생성
cp .env.example .env.local
```

다음 환경변수를 설정하세요:

```env
# 기본 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# MCP 자동화 설정
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=your-admin-password
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
SLACK_WEBHOOK_URL=your-slack-webhook-url
CRON_SECRET=your-cron-secret
```

### 2. 필요한 데이터베이스 테이블 생성

```sql
-- 자동화 로그 테이블
CREATE TABLE automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- 콘텐츠 항목 테이블
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'
);

-- 성능 메트릭 테이블
CREATE TABLE performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type VARCHAR(100) NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR(20) NOT NULL,
  page_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- 헬스체크 결과 테이블
CREATE TABLE health_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  response_time INTEGER,
  error_message TEXT,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);
```

### 3. 개발 서버 시작

```bash
npm run dev
```

### 4. 시스템 테스트

```bash
# MCP 통합 테스트 실행
node scripts/test-mcp-integration.js

# 헬스체크 API 테스트
curl http://localhost:3000/api/automation/health

# 스케줄러 상태 확인
curl http://localhost:3000/api/automation/scheduler
```

## 🎮 사용 예시

### 자동 로그인 및 콘텐츠 게시

```typescript
import { getOrchestrator } from '@/lib/mcp/orchestrator';

const orchestrator = getOrchestrator();

// 로그인 워크플로우
const loginResult = await orchestrator.executeLoginWorkflow({
  email: 'admin@example.com',
  password: 'password',
});

// 콘텐츠 게시 워크플로우
const publishResult = await orchestrator.executePublishWorkflow({
  title: '새로운 블로그 포스트',
  content: '<p>콘텐츠 내용...</p>',
  category: 'AI/ML',
  tags: ['AI', '자동화'],
});
```

### AI 콘텐츠 자동 생성

```typescript
import { getContentManager } from '@/lib/automation/content-manager';

const contentManager = getContentManager();

const result = await contentManager.generateAndManageContent({
  strategy: 'daily-trends',
  count: 5,
  publishMode: 'scheduled',
  scheduleTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간 후
});
```

### 시스템 헬스체크

```typescript
import { getHealthChecker } from '@/lib/monitoring/health-checker';

const healthChecker = getHealthChecker();
const healthResult = await healthChecker.performHealthCheck();

console.log(`시스템 상태: ${healthResult.overall}`);
```

### 알림 발송

```typescript
import { sendQuickNotification } from '@/lib/monitoring/notification-service';

await sendQuickNotification('시스템 알림', '자동화 작업이 완료되었습니다.', 'success');
```

## 🕐 스케줄 작업 설정

기본적으로 다음 스케줄 작업이 설정됩니다:

- **예약된 콘텐츠 게시**: 매시간 정각
- **AI 콘텐츠 생성**: 매일 오전 9시 (기본 비활성화)
- **시스템 헬스체크**: 매 30분
- **데이터베이스 정리**: 매일 새벽 2시
- **주간 리포트 생성**: 매주 월요일 오전 8시 (기본 비활성화)

## 🎯 Vercel Cron Jobs 설정

`vercel.json`에 다음 설정을 추가하세요:

```json
{
  "crons": [
    {
      "path": "/api/cron/automation",
      "schedule": "0 * * * *"
    }
  ]
}
```

## 🔧 문제 해결

### 일반적인 문제들

1. **브라우저 초기화 실패**
   - Playwright가 올바르게 설치되었는지 확인
   - `npx playwright install` 실행

2. **Supabase 연결 오류**
   - 환경변수가 올바르게 설정되었는지 확인
   - 서비스 역할 키 권한 확인

3. **알림 발송 실패**
   - 텔레그램 봇 토큰과 채팅 ID 확인
   - 슬랙 웹훅 URL 유효성 확인

### 로그 확인

```bash
# 개발 서버 로그에서 MCP 관련 로그 확인
grep -i "mcp\|automation\|playwright\|supabase" logs/development.log
```

## 📈 성능 최적화

1. **브라우저 인스턴스 재사용**: 동일한 브라우저 인스턴스를 여러 작업에서 공유
2. **데이터베이스 연결 풀링**: Supabase 클라이언트 인스턴스 재사용
3. **캐싱 전략**: 성능 메트릭과 헬스체크 결과 캐싱
4. **배치 처리**: 여러 콘텐츠를 한 번에 처리

## 🔐 보안 고려사항

1. **환경변수 보안**: 모든 민감한 정보는 환경변수로 관리
2. **API 인증**: cron 엔드포인트에 비밀키 인증 적용
3. **권한 관리**: 관리자 권한 확인 후 작업 실행
4. **로그 보안**: 민감한 정보가 로그에 기록되지 않도록 주의

## 🚀 확장 가능성

1. **새로운 MCP 서버 통합**: 추가적인 MCP 서버 연결 지원
2. **워크플로우 확장**: 더 복잡한 자동화 워크플로우 구현
3. **모니터링 강화**: 더 세밀한 성능 모니터링 및 알림
4. **UI 대시보드**: 관리자용 웹 대시보드 구현

---

🎉 **축하합니다!** dduksangLAB에 강력한 MCP 통합 자동화 시스템이 성공적으로 구축되었습니다.
