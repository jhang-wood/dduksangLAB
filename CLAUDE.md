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