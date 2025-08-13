# 🔐 보안 블로그 자동화 시스템

dduksangLAB 관리자 계정 자동 로그인 및 블로그 자동 게시 시스템

## 📋 시스템 개요

이 시스템은 다음 기능을 제공합니다:

- **안전한 관리자 자동 로그인**: 암호화된 자격증명으로 관리자 세션 자동 생성
- **보안 블로그 자동 게시**: PlaywrightMCP를 통한 브라우저 자동화로 블로그 포스트 게시
- **접근 제어 및 모니터링**: IP 화이트리스트, 접근 로그, 보안 이벤트 추적
- **감사 로그**: 모든 자동화 작업의 상세한 로깅 및 모니터링

## 🏗️ 시스템 아키텍처

### 보안 계층

1. **자격증명 관리** (`lib/security/credential-manager.ts`)
   - AES-256-GCM 암호화
   - 환경변수 기반 안전한 저장
   - 자동 자격증명 회전 알림

2. **접근 제어** (`lib/security/access-control.ts`)
   - IP 화이트리스트 및 차단 시스템
   - 로그인 시도 제한 (5회 시도 후 15분 차단)
   - 보안 이벤트 실시간 로깅

3. **인증 자동화** (`lib/security/admin-auth-automation.ts`)
   - 안전한 자동 로그인 프로세스
   - 세션 관리 및 만료 처리
   - 재시도 로직 및 오류 복구

### 자동화 계층

4. **블로그 게시 자동화** (`lib/security/secure-blog-automation.ts`)
   - 통합 보안 검증
   - 관리자 로그인 + 블로그 게시 워크플로우
   - 성능 모니터링 및 오류 처리

5. **API 인터페이스** (`app/api/automation/secure-blog/route.ts`)
   - REST API 엔드포인트
   - 인증 및 권한 검증
   - CRON Job 지원

## 🛠️ 설치 및 설정

### 1. 환경변수 설정

`.env.local` 파일에 다음 필수 변수들을 설정하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# 관리자 자격증명 (보안 중요\!)
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-secure-admin-password

# 암호화 및 보안
ENCRYPTION_KEY=your-32-character-or-longer-encryption-key
CRON_SECRET=your-cron-secret-for-api-access

# 선택사항: 알림 시스템
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your-webhook
```

### 2. 보안 검증

시스템 테스트 스크립트를 실행하세요:

```bash
chmod +x scripts/security/test-security-system.sh
./scripts/security/test-security-system.sh
```

### 3. 개발 서버 시작

```bash
npm run dev
```

## 🔧 사용 방법

### API를 통한 자동 게시

```bash
# 단일 포스트 게시
curl -X POST http://localhost:3000/api/automation/secure-blog \
  -H "Content-Type: application/json" \
  -H "X-Cron-Secret: your-cron-secret" \
  -d '{
    "posts": [{
      "title": "AI 트렌드 분석: 2024년 전망",
      "content": "2024년 AI 기술 동향을 분석한 포스트입니다...",
      "category": "AI",
      "tags": ["AI", "트렌드", "2024"],
      "featured": true
    }],
    "options": {
      "validateContent": true,
      "notifyOnComplete": true
    }
  }'

# 시스템 상태 확인
curl -X GET http://localhost:3000/api/automation/secure-blog \
  -H "Authorization: Bearer your-auth-token"
```

### 프로그래밍 방식 사용

```typescript
import { executeSecureBlogAutomation } from '@/lib/security/secure-blog-automation';

const posts = [
  {
    title: '새로운 블로그 포스트',
    content: '포스트 내용...',
    category: '기술',
    tags: ['자동화', '블로그'],
  },
];

const result = await executeSecureBlogAutomation(posts, req);

if (result.success) {
  console.log('게시 성공:', result.publishResults);
} else {
  console.error('게시 실패:', result.error);
}
```

## 🔒 보안 기능

### 1. 다층 보안 검증

- **IP 기반 접근 제어**: 신뢰할 수 있는 IP만 허용
- **로그인 시도 제한**: 5회 실패 시 15분간 IP 차단
- **세션 만료 관리**: 24시간 후 자동 세션 만료

### 2. 암호화 및 데이터 보호

- **AES-256-GCM**: 관리자 자격증명 암호화
- **환경변수 분리**: 민감한 정보의 안전한 저장
- **메모리 보안**: 런타임 중 자격증명 보호

### 3. 감사 및 모니터링

- **보안 이벤트 로깅**: 모든 보안 관련 활동 기록
- **성능 모니터링**: 자동화 작업 성능 추적
- **실시간 알림**: 심각한 보안 이벤트 즉시 알림

## 📊 모니터링 및 로깅

### 보안 이벤트 유형

- `login_success`: 성공적인 로그인
- `login_failure`: 로그인 실패
- `access_denied`: 접근 거부
- `suspicious_activity`: 의심스러운 활동
- `credential_rotation`: 자격증명 회전 필요

### 로그 위치

- **보안 로그**: `logs/security/access-control.log`
- **자동화 로그**: `logs/automation/blog-publisher.log`
- **Supabase 로그**: 데이터베이스 automation_logs 테이블

## ⚠️ 보안 주의사항

### 필수 보안 조치

1. **HTTPS 사용**: 프로덕션에서 반드시 HTTPS 사용
2. **정기적 비밀번호 변경**: 30일마다 관리자 비밀번호 변경
3. **IP 화이트리스트**: 신뢰할 수 있는 IP만 허용 목록에 추가
4. **로그 모니터링**: 보안 로그를 정기적으로 검토

### 권장 보안 설정

```bash
# 강력한 암호화 키 생성
ENCRYPTION_KEY=$(openssl rand -hex 32)

# 강력한 CRON 시크릿 생성
CRON_SECRET=$(openssl rand -hex 16)

# IP 화이트리스트 설정 (필요시)
ADMIN_ALLOWED_IPS=127.0.0.1,your-server-ip
```

## 🚀 고급 사용법

### CRON Job 설정

```bash
# 매일 오전 9시에 예약된 포스트 자동 게시
0 9 * * * curl -X POST https://your-domain.com/api/automation/secure-blog \
  -H "X-Cron-Secret: your-cron-secret" \
  -d '{"action": "executeScheduled"}'
```

### 대량 포스트 게시

```typescript
const posts = await generateAIContent(10); // AI로 10개 포스트 생성
const result = await executeSecureBlogAutomation(posts, {
  sourceIP: '127.0.0.1',
  validateContent: true,
  notifyOnComplete: true,
  retryCount: 3,
});
```

## 🐛 문제 해결

### 일반적인 오류

1. **로그인 실패**
   - 환경변수 `ADMIN_EMAIL`, `ADMIN_PASSWORD` 확인
   - Supabase 관리자 계정 존재 여부 확인

2. **IP 차단**
   - `ADMIN_ALLOWED_IPS` 환경변수 설정
   - 또는 코드에서 IP 화이트리스트 업데이트

3. **암호화 오류**
   - `ENCRYPTION_KEY`가 32자 이상인지 확인
   - 키 변경 시 기존 암호화 데이터 재암호화 필요

### 디버깅 팁

```bash
# 상세 로그 활성화
DEBUG=automation:* npm run dev

# 보안 테스트 실행
./scripts/security/test-security-system.sh

# API 응답 확인
curl -v http://localhost:3000/api/automation/secure-blog/status
```

## 📈 성능 최적화

### 권장 설정

- **동시 게시**: 최대 1개 포스트 (안정성 우선)
- **재시도**: 3회 시도, 5초 간격
- **세션 재사용**: 기존 세션 있으면 재로그인 생략

### 모니터링 메트릭

- 평균 로그인 시간: ~3-5초
- 평균 게시 시간: ~10-15초/포스트
- 메모리 사용량: ~100MB 추가

---

## 📞 지원

문제가 발생하거나 개선사항이 있으시면 GitHub Issues를 통해 알려주세요.

**보안 관련 문제는 비공개 채널을 통해 신고해주세요.**
DOC_EOF < /dev/null
