# Vercel 프로젝트 설정 가이드

## Vercel 프로젝트 새로 만들기 (프로젝트 삭제한 경우)

### 1. Vercel에서 새 프로젝트 생성

1. https://vercel.com 로그인
2. "Add New..." → "Project" 클릭
3. "Import Git Repository" 선택
4. GitHub 계정 연결 (이미 연결되어 있다면 스킵)
5. "jhang-wood/dduksangLAB" 저장소 선택
6. "Import" 클릭

### 2. 프로젝트 설정

프로젝트 설정 화면에서:

- **Project Name**: dduksangLAB (또는 원하는 이름)
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: ./ (기본값 유지)
- **Build and Output Settings**: 기본값 유지
- **Environment Variables**: 아래 섹션 참조

### 3. 환경 변수 설정 (중요!)

"Environment Variables" 섹션에서 다음 변수들을 추가:

#### Supabase 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=https://wpzvocfgfwvsxmpckdnu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SUPABASE_SERVICE_ROLE_KEY]
```

#### PayApp 환경 변수

```
PAYAPP_SECRET_KEY=[YOUR_PAYAPP_SECRET_KEY]
NEXT_PUBLIC_PAYAPP_API_KEY=페이앱에서 발급받은 API 키
```

#### 사이트 URL

```
NEXT_PUBLIC_SITE_URL=https://dduksang.com
```

### 4. 배포

모든 환경 변수를 추가한 후 "Deploy" 버튼 클릭

## Supabase 환경 변수 찾는 방법

### 1. Supabase 대시보드에서 찾기

1. https://supabase.com/dashboard 로그인
2. 프로젝트 선택 (wpzvocfgfwvsxmpckdnu)
3. 왼쪽 메뉴에서 "Settings" (설정) 클릭
4. "API" 섹션 클릭

### 2. 필요한 값들

- **Project URL** (NEXT_PUBLIC_SUPABASE_URL):
  - API Settings 페이지 상단의 "URL" 섹션
  - 형식: `https://[프로젝트ID].supabase.co`
  - 예: `https://wpzvocfgfwvsxmpckdnu.supabase.co`

- **Anon/Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY):
  - "Project API keys" 섹션의 "anon public" 키
  - 긴 JWT 토큰 형식
  - 공개되어도 안전한 키

- **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY):
  - "Project API keys" 섹션의 "service_role secret" 키
  - ⚠️ 비밀 키이므로 절대 공개하면 안됨
  - 서버 사이드에서만 사용

## 기존 문제 상황 (참고)

## 즉시 해결 방법

### 1. Vercel 캐시 완전 삭제 및 재배포

1. https://vercel.com 로그인
2. dduksangLAB 프로젝트 선택
3. **Settings** 탭 클릭
4. 아래로 스크롤하여 **"Delete Project"** 섹션 찾기
5. **"Clear Build Cache"** 버튼 클릭 (프로젝트는 삭제하지 않음!)
6. 프로젝트 대시보드로 돌아가기
7. **"Redeploy"** 버튼 클릭
8. **"Use existing Build Cache"** 체크박스 해제
9. **"Redeploy"** 확인

### 2. 환경 변수 확인

Vercel 대시보드에서 다음 환경 변수들이 설정되어 있는지 확인:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (필요한 경우)

### 3. Build & Development Settings 확인

Settings → General에서:

- Framework Preset: Next.js
- Build Command: `npm run build` 또는 비워두기 (자동 감지)
- Install Command: `npm install` 또는 비워두기

### 4. Node.js 버전 확인

Settings → General → Node.js Version:

- 18.x 또는 20.x 권장

### 2. Git 연결 확인 (선택사항)

만약 위 방법이 작동하지 않으면:

1. Settings → Git → Disconnect from Git
2. 다시 Connect Git
3. GitHub 저장소 선택: jhang-wood/dduksangLAB
4. 자동 배포 활성화

## 로컬에서 완료한 작업

1. ✅ package-lock.json 재생성 및 커밋
2. ✅ Edge Runtime을 Node.js Runtime으로 변경 (webhook/route.ts)
3. ✅ crypto 모듈 import 문제 수정 (payapp.ts)
4. ✅ vercel.json에 Node.js 런타임 명시
5. ✅ 로컬 빌드 테스트 성공
6. ✅ Git에 모든 변경사항 푸시 (커밋: 87d2a17)

## 문제가 지속될 경우

1. Vercel Support에 문의하여 빌드 캐시 문제 보고
2. 프로젝트를 완전히 삭제하고 다시 생성 (최후의 수단)

## 추가 권장사항

- `@supabase/auth-helpers-nextjs`는 deprecated이므로 추후 `@supabase/ssr`로 마이그레이션 권장
- 정기적으로 Vercel 빌드 캐시 정리 권장
