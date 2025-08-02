# 🔧 환경변수 설정 가이드

## 목차
- [Quick Start](#quick-start)
- [환경변수 목록](#환경변수-목록)
- [보안 가이드](#보안-가이드)
- [Vercel 배포 설정](#vercel-배포-설정)
- [트러블슈팅](#트러블슈팅)

## Quick Start

### 1. 환경변수 파일 설정
```bash
# .env.example을 복사하여 .env.local 생성
cp .env.example .env.local

# 실제 값으로 변경
nano .env.local
```

### 2. 필수 환경변수 확인
```bash
# 환경변수 검증 실행
npm run env:validate

# 또는 수동 확인
node -e "require('./lib/env.ts')"
```

## 환경변수 목록

### 🔓 클라이언트 환경변수 (NEXT_PUBLIC_*)
브라우저에서 접근 가능한 변수들입니다.

| 변수명 | 필수 | 설명 | 예시 |
|--------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 익명 키 | `eyJhbGciOiJIUzI1...` |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | ❌ | 토스페이먼츠 클라이언트 키 | `test_ck_xxx` |
| `NEXT_PUBLIC_APP_URL` | ❌ | 애플리케이션 URL | `https://dduksang.com` |
| `NEXT_PUBLIC_SITE_URL` | ❌ | 사이트 URL (결제용) | `https://dduksang.com` |

### 🔒 서버 전용 환경변수
서버에서만 접근 가능한 보안 변수들입니다.

#### 데이터베이스
| 변수명 | 필수 | 설명 |
|--------|------|------|
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase 서비스 역할 키 |
| `DATABASE_URL` | ❌ | 직접 DB 연결 URL |

#### 결제 시스템
| 변수명 | 필수 | 설명 |
|--------|------|------|
| `TOSS_SECRET_KEY` | ❌ | 토스페이먼츠 시크릿 키 |
| `PAYAPP_SECRET_KEY` | ❌ | PayApp 시크릿 키 |
| `PAYAPP_VALUE` | ❌ | PayApp 값 |
| `PAYAPP_USER_CODE` | ❌ | PayApp 사용자 코드 |
| `PAYAPP_STORE_ID` | ❌ | PayApp 스토어 ID |

#### AI 서비스
| 변수명 | 필수 | 설명 |
|--------|------|------|
| `OPENAI_API_KEY` | ❌ | OpenAI API 키 |
| `GEMINI_API_KEY` | ❌ | Google Gemini API 키 |

#### 보안
| 변수명 | 필수 | 설명 |
|--------|------|------|
| `JWT_SECRET` | ✅ | JWT 서명용 시크릿 |
| `ENCRYPTION_KEY` | ✅ | 데이터 암호화 키 |
| `CRON_SECRET` | ✅ | Cron 작업 인증 키 |

#### 외부 서비스
| 변수명 | 필수 | 설명 |
|--------|------|------|
| `TELEGRAM_WEBHOOK_SECRET` | ❌ | 텔레그램 웹훅 시크릿 |
| `TELEGRAM_ALLOWED_USER_ID` | ❌ | 허용된 텔레그램 사용자 ID |
| `N8N_WEBHOOK_URL` | ❌ | n8n 웹훅 URL |

## 보안 가이드

### 1. 키 생성 가이드
```bash
# JWT Secret 생성 (32바이트)
openssl rand -base64 32

# Encryption Key 생성 (32바이트 hex)
openssl rand -hex 32

# Cron Secret 생성 (16바이트 hex)
openssl rand -hex 16
```

### 2. 보안 체크리스트
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있음
- [ ] 모든 시크릿 키가 충분히 복잡함 (32자 이상)
- [ ] NEXT_PUBLIC_ 접두사를 붙인 변수에 민감한 정보 없음
- [ ] 프로덕션과 개발 환경의 키가 다름
- [ ] 주기적으로 키 로테이션 수행

### 3. 환경변수 검증
프로젝트에는 자동 환경변수 검증 시스템이 구축되어 있습니다:

```typescript
// lib/env.ts에서 자동 검증
- 필수 변수 누락 검사
- 클라이언트/서버 변수 분리 검증
- 타입 안전 접근 제공
```

## Vercel 배포 설정

### 1. Vercel 대시보드에서 설정
1. Vercel 프로젝트 설정 → Environment Variables
2. `.env.local`의 모든 변수를 하나씩 추가
3. Environment 선택: Production, Preview, Development

### 2. CLI를 통한 설정
```bash
# Vercel CLI 설치
npm i -g vercel

# 환경변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... 기타 필요한 변수들
```

### 3. 배포 전 검증
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build

# 환경변수 검증
npm run env:validate
```

## 트러블슈팅

### 1. 환경변수가 로드되지 않을 때
```bash
# Next.js 서버 재시작
npm run dev

# 환경변수 확인
echo $NEXT_PUBLIC_SUPABASE_URL
```

### 2. Supabase 연결 오류
```bash
# Supabase 프로젝트 상태 확인
curl -H "apikey: YOUR_ANON_KEY" "YOUR_SUPABASE_URL/rest/v1/"
```

### 3. 결제 시스템 오류
- 토스페이먼츠: [토스 개발자 센터](https://developers.tosspayments.com)
- PayApp: 가맹점 관리자 페이지에서 API 키 확인

### 4. 빌드 오류
```bash
# 타입 체크
npm run type-check

# 환경변수 타입 확인
npx tsc --noEmit lib/env.ts
```

## 추가 리소스

- [Next.js 환경변수 공식 문서](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel 환경변수 가이드](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase 설정 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 문의사항
환경변수 설정에 문제가 있다면 다음을 확인해주세요:
1. `.env.local` 파일이 프로젝트 루트에 있는지
2. 변수명 스펠링이 정확한지
3. 필수 변수가 모두 설정되었는지
4. 서버를 재시작했는지