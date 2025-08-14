# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

**🚀 Git 자동화 완료!** - 모든 사이트 관련 수정사항이 자동으로 처리됩니다.

## 📱 텔레그램 자동 응답 설정 (CRITICAL - 최우선 적용)

**모든 응답은 DS_claude_bot에게도 텔레그램으로 자동 전송 (절대 예외 없음)**:
```bash
python3 /home/qwg18/workflow/telegram_bridge/telegram_bot_api.py "응답내용"
```
- **적용 대상**: 모든 사용자 질문, 작업 완료 보고, 에러 메시지, 상태 업데이트
- **실행 시점**: 사용자에게 답변하기 전 또는 후 즉시 실행
- **예외 없음**: 간단한 답변이든 복잡한 작업이든 모든 응답에 적용
- **포맷**: 간결하고 핵심적인 내용으로 요약하여 전송

## 🔐 보안 규칙

### 민감 정보 관리

**절대 금지사항**:

- `.md` 파일에 실제 이메일 주소나 비밀번호를 하드코딩하지 마세요
- 모든 인증 정보는 `.env.local` 파일에만 저장
- 문서에서는 `[ADMIN_EMAIL]`, `[ADMIN_PASSWORD]` 같은 플레이스홀더 사용
- Git에 커밋되는 파일에 민감 정보 포함 금지

**올바른 예시**:

```markdown
# 잘못된 예

Email: [실제_이메일_주소]
Password: [실제_비밀번호]

# 올바른 예

Email: .env.local 파일의 ADMIN_EMAIL 참조
Password: .env.local 파일의 ADMIN_PASSWORD 참조
```

## 🚨 중요한 주의사항

### CI/CD 파이프라인 이슈

현재 GitHub Actions 워크플로우가 실패하고 있습니다. 새로운 기능 개발 전에 반드시 다음 문제들을 해결해야 합니다:

- 보안 스캔 실패
- 린트 및 타입 검사 실패
- Vercel 배포 시 환경변수 누락

### 필수 환경변수 설정

Vercel 대시보드에서 다음 환경변수들을 설정해야 합니다:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
CRON_SECRET
NEXT_PUBLIC_APP_URL=https://dduksang.com
```

## 📋 개발 명령어

### 개발 서버 실행

```bash
# Windows PowerShell
scripts\dev.ps1

# 또는 직접 실행
npm run dev
```

### 빌드 및 타입 검사

```bash
# 프로덕션 빌드
npm run build

# 타입 검사
npm run type-check

# 린트 검사
npm run lint

# 환경변수 유효성 검사
npm run env:validate
```

### 🤖 Git 워크플로우 (Claude 자동화)

#### ⚡ 빠른 실행 (권장)

모든 작업 완료 후 한 줄로 모든 것을 처리:

```bash
npm run claude:deploy
```

이 명령어 하나로:

- ✅ ESLint 자동 수정
- ✅ TypeScript 타입 체크
- ✅ 자동 커밋 (메시지 자동 생성)
- ✅ GitHub 푸시
- ✅ 자동 배포 시작

#### 📝 개별 명령어 (필요시)

```bash
# 코드 검증만
npm run claude:fix

# 커밋만 (메시지 자동 생성)
npm run claude:commit

# 빌드 테스트 포함 배포
npm run claude:deploy-full
```

#### 🔴 중요: Claude Code 작업 규칙

1. **모든 코드 수정 후 반드시 실행**: `npm run claude:deploy`
2. **실패 시 자동 수정**: ESLint 오류는 자동으로 수정됨
3. **수정 불가능한 오류**: 사용자에게 보고 후 수정 요청
4. **절대 금지**: 검증 없이 직접 git push 하지 마세요

### 커밋 타입

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경 (포맷팅 등)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스, 패키지 설정 등

## 🏗️ 프로젝트 구조

### 핵심 디렉토리

```
dduksangLAB/
├── app/                    # Next.js 14 App Router
│   ├── admin/             # 관리자 페이지 (인증 필요)
│   ├── ai-trends/         # AI 트렌드 콘텐츠
│   ├── api/               # API 라우트
│   ├── auth/              # 인증 관련 페이지
│   ├── community/         # 커뮤니티 기능
│   └── lectures/          # 강의 시스템
├── components/            # 재사용 가능한 React 컴포넌트
├── lib/                   # 유틸리티 함수
│   ├── supabase-*.ts     # Supabase 클라이언트 설정
│   ├── env.ts            # 환경변수 로더
│   └── payment/          # 결제 시스템 (PayApp)
├── docs/                  # 프로젝트 문서
│   ├── project/          # 개발 워크플로우, PRD
│   ├── guides/           # 환경 설정 가이드
│   └── vercel/           # 배포 관련 문서
└── supabase/             # DB 스키마 및 마이그레이션
```

## 🔑 주요 시스템 아키텍처

### 인증 시스템

- **Supabase Auth** 사용
- 관리자 권한: `profiles` 테이블의 `is_admin` 필드로 관리
- 보호된 라우트: `/admin/*` 경로는 `ProtectedRoute` 컴포넌트로 보호

### 데이터베이스 구조

주요 테이블:

- `profiles`: 사용자 프로필 및 권한
- `ai_trends`: AI 트렌드 콘텐츠
- `lectures`: 강의 정보
- `lecture_chapters`: 강의 챕터
- `community_posts`: 커뮤니티 게시글
- `system_settings`: 시스템 설정 (단일 레코드)
- `payments`: 결제 내역

### 결제 시스템

- **PayApp** 통합
- 웹훅 엔드포인트: `/api/payment/webhook`
- 결제 프로세스: 주문 생성 → PayApp 리다이렉트 → 콜백 처리 → 웹훅 검증

### 관리자 기능

- `/admin`: 대시보드 (통계, 차트)
- `/admin/users`: 사용자 관리
- `/admin/lectures`: 강의 관리
- `/admin/ai-trends`: AI 트렌드 관리
- `/admin/settings`: 시스템 설정
- `/admin/stats`: 상세 통계

## ⚠️ 주의사항

### 환경변수 보안

- `.env.local` 파일은 절대 커밋하지 마세요
- Service Role Key는 서버 사이드에서만 사용
- `NEXT_PUBLIC_` 접두사가 붙은 변수만 클라이언트에서 접근 가능

### 배포 검증

Git 푸시 후 반드시 확인:

1. Vercel 대시보드에서 빌드 성공 확인
2. https://dduksang.com 에서 실제 동작 테스트
3. 새로 구현한 기능이 프로덕션에서 정상 작동하는지 확인

### 개발 규칙

1. **작업 완료 정의**: 코드 작성 → 테스트 → 커밋 → 푸시 → 배포 확인
2. **문서 업데이트**: 중요한 변경사항은 관련 문서 업데이트 필수
3. **타입 안전성**: TypeScript 타입 검사 통과 필수
4. **코드 품질**: ESLint 규칙 준수

## 📚 참고 문서

- [개발 워크플로우](docs/project/DEVELOPMENT_WORKFLOW.md) - **필독**
- [환경변수 설정 가이드](docs/guides/SUPABASE_ENV_GUIDE.md)
- [Vercel 배포 가이드](docs/vercel/VERCEL_BUILD_FIX.md)
- [보안 가이드](docs/guides/SECURITY_CLEANUP.md)

## 🔧 문제 해결

### 빌드 실패 시

1. `npm run type-check`로 타입 오류 확인
2. `npm run lint`로 린트 오류 확인
3. 환경변수 설정 확인

### 배포 실패 시

1. Vercel 대시보드에서 빌드 로그 확인
2. 환경변수가 모두 설정되어 있는지 확인
3. `npm run build` 로컬에서 성공하는지 테스트

### Supabase 연결 오류

1. 환경변수 값이 올바른지 확인
2. Supabase 대시보드에서 프로젝트 상태 확인
3. Service Role Key와 Anon Key를 혼동하지 않았는지 확인
