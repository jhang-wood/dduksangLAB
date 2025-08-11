# Vercel 환경변수 설정 가이드

## 📋 필수 환경변수 설정

Vercel 대시보드 (https://vercel.com) 에서 다음 환경변수들을 설정해야 합니다:

### 1. Vercel 대시보드 접속
1. https://vercel.com 로그인
2. `dduksangLAB` 프로젝트 선택
3. Settings → Environment Variables 이동

### 2. 필수 환경변수 추가

다음 환경변수들을 **Production**, **Preview**, **Development** 모든 환경에 추가:

```bash
# Supabase 필수 설정
NEXT_PUBLIC_SUPABASE_URL=https://wpzvocfgfwvsxmpckdnu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0ODczNDQsImV4cCI6MjA0OTA2MzM0NH0.aEvk3fQSNSwOvQhU0yaxE_0UdJGqChhGyQtQPzSZlqU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzQ4NzM0NCwiZXhwIjoyMDQ5MDYzMzQ0fQ.jyQQCpS-lAHvOpqZwBmQzOPwMv-nEtJlT7bsBA7TNVE

# 앱 설정
NEXT_PUBLIC_APP_URL=https://dduksang.com
NEXT_PUBLIC_SITE_URL=https://dduksang.com

# 관리자 계정 (선택사항)
ADMIN_EMAIL=admin@dduksang.com
ADMIN_PASSWORD=dduksang2025!@#

# 보안 키 (선택사항 - 추천)
JWT_SECRET=dduksang-jwt-secret-2025-secure-token-min-32chars
ENCRYPTION_KEY=dduksang-encryption-key-2025-secure-64-characters-long-for-aes256
CRON_SECRET=dduksang-cron-secret-2025-secure
```

### 3. 환경변수 저장 및 재배포

1. 모든 환경변수 입력 후 **Save** 클릭
2. Deployments 탭에서 최신 배포 선택
3. **Redeploy** 클릭 → **Redeploy** 확인

### 4. 배포 확인

1. 배포 완료 후 https://dduksang.com 접속
2. 로그인 페이지에서 테스트
   - 이메일: admin@dduksang.com
   - 비밀번호: dduksang2025!@#

## ⚠️ 주의사항

- 환경변수 키와 값 사이에 공백이 없도록 주의
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서 접근 가능
- Service Role Key는 절대 클라이언트에 노출되지 않도록 주의
- 변경 후 반드시 재배포 필요

## 🔧 문제 해결

### 로그인이 안 될 경우
1. Vercel 대시보드 → Functions 탭에서 에러 로그 확인
2. 환경변수가 모두 올바르게 설정되었는지 확인
3. 재배포 후 5분 정도 대기

### CSP 에러가 발생할 경우
- `NEXT_PUBLIC_SUPABASE_URL`이 올바른지 확인
- https로 시작하는지 확인 (http 아님)

## 📝 현재 상태

- ✅ 로컬 환경: 정상 작동
- ✅ 코드 수정: 완료
- ✅ GitHub 푸시: 완료
- ⏳ Vercel 배포: 환경변수 설정 필요

## 🚀 다음 단계

1. 위 가이드대로 Vercel 환경변수 설정
2. 재배포 실행
3. https://dduksang.com 에서 로그인 테스트
4. 정상 작동 확인