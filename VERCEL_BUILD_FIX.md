# Vercel 빌드 오류 해결 가이드

## 문제 상황
- Vercel이 이전 커밋(e1f6944)을 계속 빌드하고 있음
- 최신 커밋(87d2a17)이 반영되지 않음
- `@supabase/auth-helpers-nextjs` 패키지 찾지 못함 오류

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