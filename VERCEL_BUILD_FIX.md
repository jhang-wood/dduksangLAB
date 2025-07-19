# Vercel 빌드 오류 해결 가이드

## 문제 상황
Vercel이 `@supabase/auth-helpers-nextjs` 패키지를 찾지 못함

## 해결 방법

### 1. Vercel 대시보드에서 수동 재배포
1. https://vercel.com 로그인
2. dduksangLAB 프로젝트 선택
3. Settings → Functions → "Clear Cache and Redeploy" 클릭

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

## 로컬에서 완료한 작업
1. ✅ package-lock.json 재생성
2. ✅ Edge Runtime을 Node.js Runtime으로 변경
3. ✅ 로컬 빌드 테스트 성공
4. ✅ Git에 모든 변경사항 푸시

## 추가 권장사항
- `@supabase/auth-helpers-nextjs`는 deprecated이므로 추후 `@supabase/ssr`로 마이그레이션 권장