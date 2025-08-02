#!/bin/bash

echo "🚀 dduksangLAB 자동 배포 시작..."

# 1. Git 푸시
echo "📦 Git 푸시 중..."
git add -A
git commit -m "deploy: Update dates to August 5th and fix 404 pages - $(date +%Y%m%d-%H%M%S)"
git push origin main

# 2. 배포 대기
echo "⏳ Vercel 배포 대기 중 (3분)..."
sleep 180

# 3. PlaywrightMCP로 확인
echo "🔍 배포 확인 중..."
cd /home/qwg18/Tmux-Orchestrator/playwright-mcp-test

cat > verify-dduksang-deployment.js << 'EOF'
const { chromium } = require('playwright');

async function verifyDeployment() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== dduksang.com 배포 확인 ===\n');
  
  try {
    // 메인 페이지 확인
    await page.goto('https://dduksang.com', { waitUntil: 'networkidle' });
    
    // 날짜 변경 확인
    const dateElements = await page.$$eval('*', elements => 
      elements.map(el => el.textContent)
        .filter(text => text && (text.includes('8월 5일') || text.includes('7월 21일')))
    );
    
    console.log('✅ 날짜 변경:', dateElements.some(text => text.includes('8월 5일')) ? '성공' : '실패');
    
    // 대시보드 페이지 확인
    const dashResponse = await page.goto('https://dduksang.com/dashboard');
    console.log('✅ 대시보드 페이지:', dashResponse.status() === 404 ? '404 오류' : '정상');
    
    // 로그인 리디렉션 확인
    const loginResponse = await page.goto('https://dduksang.com/login');
    console.log('✅ 로그인 리디렉션:', page.url().includes('/auth/login') ? '성공' : '실패');
    
    console.log('\n배포 완료! ✨');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
  
  await browser.close();
}

verifyDeployment();
EOF

node verify-dduksang-deployment.js

echo "✅ dduksangLAB 배포 및 확인 완료!"