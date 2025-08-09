# 🔴 최우선 순위 규칙

## 🚨 절대 건너뛰지 않기 규칙
**절대 금지**: CI/CD 파이프라인 오류나 테스트 실패를 건너뛰고 다른 작업을 진행하지 말 것!

### ⚠️ 현재 해결 필요한 Critical 이슈들
1. **CI/CD 파이프라인 실패** - GitHub Actions에서 다음 항목들이 실패:
   - 보안 스캔 실패
   - 린트 및 타입 검사 실패  
   - 보안 점검 실패
   - **모든 작업이 건너뛰어짐**

2. **Vercel 배포 오류** - 환경변수 관련 배포 실패

### 📝 사용자가 해야 할 작업들
1. **GitHub 저장소에서 Actions 탭 확인**
   - https://github.com/jhang-wood/dduksangLAB/actions
   - 실패한 워크플로우 로그 확인
   - 구체적인 오류 메시지 파악

2. **Vercel 대시보드에서 배포 로그 확인**
   - https://vercel.com/dashboard
   - dduksangLAB 프로젝트의 배포 오류 로그 확인
   - 누락된 환경변수 식별

3. **환경변수 설정**
   - Vercel 프로젝트 설정에서 다음 환경변수들 추가 필요:
   ```
   NEXT_PUBLIC_SUPABASE_URL=실제_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=실제_anon_key
   SUPABASE_SERVICE_ROLE_KEY=실제_service_key
   CRON_SECRET=secure_random_string
   NEXT_PUBLIC_APP_URL=https://dduksang.com
   ```

## 🔴 작업 우선순위
1. CI/CD 파이프라인 오류 해결 (최우선)
2. Vercel 배포 오류 해결 
3. 모든 테스트 통과 확인
4. 그 후에만 새로운 기능 개발 진행

## 🚫 절대 하지 말 것
- 오류가 있는 상태에서 새로운 기능 개발 진행
- 실패한 테스트나 빌드를 무시하고 다음 작업 진행
- "나중에 수정하겠다"는 마인드로 문제 방치

---

# Claude 자동 배포 설정

## dduksangLAB 배포 프로세스

### 1. Git 푸시
```bash
git add -A
git commit -m "deploy: Update dates and fix 404 pages"
git push origin main
```

### 2. Vercel 자동 배포
- Git 푸시 시 Vercel이 자동으로 배포 시작
- 배포 완료까지 약 2-3분 대기

### 3. 배포 확인
```bash
# Vercel 배포 상태 확인
vercel --prod
```

### 4. PlaywrightMCP로 변경사항 확인
```javascript
// 배포 후 실제 사이트 검증
const { chromium } = require('playwright');

async function verifyDeployment() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // dduksang.com 확인
  await page.goto('https://dduksang.com');
  
  // 날짜 변경 확인
  const dateText = await page.textContent('text=8월 5일');
  console.log('날짜 변경 확인:', dateText ? '✅ 성공' : '❌ 실패');
  
  // 404 페이지 확인
  await page.goto('https://dduksang.com/dashboard');
  const is404 = await page.title().then(title => title.includes('404'));
  console.log('대시보드 페이지:', is404 ? '❌ 404' : '✅ 정상');
  
  await browser.close();
}
```

## 자동 실행 명령어
```bash
# 전체 프로세스 자동 실행
./deploy-and-verify.sh
```

---

# 🤖 자동화 시스템 안내

## 📖 개요
dduksangLAB 프로젝트는 완전한 자동화 시스템을 구축했습니다. 코드 변경부터 배포, 품질 관리까지 모든 과정이 자동으로 처리됩니다.

## 🚀 GitHub Actions 워크플로우

### 1. 자동 배포 워크플로우 (.github/workflows/deploy.yml)
- **트리거**: main 브랜치에 푸시할 때 자동 실행
- **기능**: 
  - 코드 품질 검사 (ESLint, TypeScript)
  - 보안 스캔 (npm audit, CodeQL)
  - Vercel 자동 배포
  - 텔레그램 알림 발송

### 2. Renovate Bot (.github/renovate.json)
- **기능**: 의존성 자동 업데이트
- **스케줄**: 매주 월요일 새벽 2시
- **특징**: 
  - 자동 PR 생성
  - 보안 업데이트 우선 처리
  - 호환성 검사 후 자동 머지

### 3. Semantic Release (.releaserc.json)
- **기능**: 버전 자동 관리 및 릴리즈 노트 생성
- **트리거**: main 브랜치 푸시 시
- **생성물**: 
  - 자동 버전 태깅
  - CHANGELOG.md 업데이트
  - GitHub 릴리즈 생성

## 📱 텔레그램 알림 시스템

### 알림 유형
1. **배포 성공/실패 알림**
   - 배포 상태와 URL 포함
   - 실패 시 상세 오류 정보 제공

2. **보안 이슈 알림**
   - 취약점 발견 시 즉시 알림
   - 심각도별 분류

3. **의존성 업데이트 알림**
   - Renovate Bot의 업데이트 결과
   - 중요 업데이트 하이라이트

### 텔레그램 설정
> ⚠️ **중요**: 모든 텔레그램 정보는 GitHub Secrets에만 저장하세요!

**필수 GitHub Secrets:**
- `TELEGRAM_BOT_TOKEN`: 봇 토큰
- `TELEGRAM_CHAT_ID`: 알림 받을 채팅 ID

## 🛠 개발 워크플로우

### 권장 개발 프로세스
1. **브랜치 생성**
   ```bash
   git checkout -b feature/새기능명
   ```

2. **개발 및 테스트**
   ```bash
   npm run dev        # 개발 서버 실행
   npm run lint       # 코드 품질 검사
   npm run type-check # 타입 검사
   ```

3. **커밋 (Semantic Commit)**
   ```bash
   git commit -m "feat: 새로운 기능 추가"
   git commit -m "fix: 버그 수정"
   git commit -m "docs: 문서 업데이트"
   ```

4. **Pull Request 생성**
   - GitHub에서 PR 생성
   - 자동 검사 통과 확인
   - 리뷰어 지정 (선택사항)

5. **자동 배포**
   - main 브랜치 머지 시 자동 배포
   - 텔레그램으로 결과 알림 수신

## 📊 품질 관리

### 코드 품질 기준
- **ESLint**: 코드 스타일 및 잠재적 오류 검사
- **TypeScript**: 타입 안전성 보장
- **Prettier**: 코드 포매팅 통일

### 보안 검사
- **npm audit**: 의존성 취약점 검사
- **CodeQL**: 정적 보안 분석
- **Renovate**: 보안 업데이트 자동 적용

### 배포 검증
- **빌드 테스트**: 프로덕션 빌드 성공 확인
- **타입 검사**: TypeScript 컴파일 오류 검사
- **린트 검사**: 코드 품질 기준 통과 확인

## 🚨 문제 해결

### 배포 실패 시
1. **GitHub Actions 로그 확인**
   - Repository → Actions 탭
   - 실패한 워크플로우 클릭
   - 오류 로그 확인

2. **일반적인 오류 유형**
   - 린트 오류: `npm run lint:fix` 실행
   - 타입 오류: TypeScript 오류 수정
   - 빌드 오류: 의존성 또는 구문 오류 확인

3. **Vercel 환경변수 확인**
   - Vercel Dashboard → Project Settings
   - Environment Variables 설정 확인

### 텔레그램 알림이 안 올 때
1. **GitHub Secrets 확인**
   - Repository Settings → Secrets and variables → Actions
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` 설정 확인

2. **봇 설정 확인**
   - 텔레그램에서 봇과 대화 시작
   - 봇이 그룹에 추가되어 있는지 확인

## 📚 추가 문서
- [자동화 시스템 사용 가이드](C:\dev\docs\git-automation\USER_GUIDE.md)
- [GitHub Secrets 설정 가이드](C:\dev\docs\git-automation\secrets-setup.md)
- [프로젝트 전체 기술 문서](C:\dev\docs\git-automation\PRD.md)