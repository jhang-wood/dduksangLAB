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