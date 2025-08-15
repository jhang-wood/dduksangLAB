import { chromium } from 'playwright';

async function testStickyCard() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log("1. 페이지 로딩...");
    await page.goto('http://localhost:3003/lectures', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    await page.waitForTimeout(2000);
    
    // 초기 상태 캡처
    console.log("2. 초기 상태 캡처");
    await page.screenshot({ path: '/tmp/initial_state.png' });
    
    // 페이지 내용이 로드되었는지 확인
    const hasContent = await page.evaluate(() => {
      return document.body.innerText.includes('Claude Code CLI');
    });
    console.log(`페이지 내용 로드됨: ${hasContent}`);
    
    // 200px 스크롤 테스트
    console.log("3. 200px 스크롤 - sticky 활성화 확인");
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/scroll_200.png' });
    
    const scrollY_200 = await page.evaluate(() => window.scrollY);
    console.log(`200px 스크롤 후 위치: ${scrollY_200}px`);
    
    // 500px 스크롤 테스트
    console.log("4. 500px 스크롤 - floating 효과 확인");
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/scroll_500.png' });
    
    // 1000px 스크롤 테스트
    console.log("5. 1000px 스크롤 - 지속적 따라오기 확인");
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/scroll_1000.png' });
    
    // 페이지 끝까지 스크롤
    console.log("6. 페이지 끝까지 스크롤");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/scroll_bottom.png' });
    
    // 카드 상태 검사
    const cardInfo = await page.evaluate(() => {
      const possibleSelectors = [
        '.sticky-price-card',
        '[class*="sticky-price-card"]',
        '[class*="StickyPriceCard"]',
        'div[class*="card"]'
      ];
      
      for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          const style = window.getComputedStyle(element);
          return {
            found: true,
            selector,
            position: style.position,
            top: style.top,
            right: style.right,
            zIndex: style.zIndex,
            width: style.width
          };
        }
      }
      return { found: false };
    });
    
    console.log("카드 정보:", JSON.stringify(cardInfo, null, 2));
    console.log("✅ 모든 테스트 완료!");
    
  } catch (error) {
    console.error("❌ 테스트 실패:", error.message);
  } finally {
    await browser.close();
  }
}

testStickyCard();
