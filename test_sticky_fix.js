const { chromium } = require('playwright');

async function testStickyFix() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('1. 페이지 접속 중...');
    await page.goto('http://localhost:3000/lectures', { 
      waitUntil: 'networkidle' 
    });
    
    console.log('2. 초기 상태 스크린샷');
    await page.screenshot({ 
      path: '/tmp/sticky_fix_initial.png',
      fullPage: false
    });
    
    console.log('3. 가격 카드 요소 확인');
    const stickyCard = await page.locator('.sticky').first();
    
    if (await stickyCard.count() > 0) {
      console.log('✅ Sticky 카드 발견!');
      
      // 스타일 확인
      const styles = await stickyCard.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          position: style.position,
          top: style.top,
          zIndex: style.zIndex,
          className: el.className
        };
      });
      
      console.log('카드 스타일:', styles);
    } else {
      console.log('❌ Sticky 카드를 찾을 수 없습니다');
    }
    
    console.log('4. 스크롤 테스트 시작');
    
    // 페이지 높이 확인
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`페이지 높이: ${pageHeight}px`);
    
    // 스크롤 테스트
    for (let i = 0; i <= 4; i++) {
      const scrollY = (pageHeight / 4) * i;
      console.log(`스크롤 위치: ${scrollY}px`);
      
      await page.evaluate((y) => {
        window.scrollTo(0, y);
      }, scrollY);
      
      await page.waitForTimeout(1000);
      
      // 가격 카드의 현재 위치 확인
      if (await stickyCard.count() > 0) {
        const cardPosition = await stickyCard.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top,
            left: rect.left,
            visible: rect.top >= 0 && rect.top <= window.innerHeight
          };
        });
        
        console.log(`스크롤 ${i} - 카드 위치: top=${cardPosition.top}px, visible=${cardPosition.visible}`);
        
        // 각 스크롤 위치에서 스크린샷
        await page.screenshot({ 
          path: `/tmp/sticky_test_${i}.png`,
          fullPage: false
        });
      }
    }
    
    console.log('5. 최종 확인 - 카드가 상단에 고정되어 있는지 체크');
    
    // 페이지 중간으로 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    
    await page.waitForTimeout(1000);
    
    if (await stickyCard.count() > 0) {
      const finalPosition = await stickyCard.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          rectTop: rect.top,
          styleTop: style.top,
          position: style.position,
          isSticky: style.position === 'sticky',
          isVisible: rect.top >= 0 && rect.top <= window.innerHeight
        };
      });
      
      console.log('최종 카드 상태:', finalPosition);
      
      if (finalPosition.isSticky && finalPosition.isVisible) {
        console.log('✅ 성공! 가격 카드가 sticky로 제대로 동작합니다!');
      } else {
        console.log('❌ 실패: 가격 카드가 sticky 동작하지 않습니다.');
      }
    }
    
    // 최종 스크린샷
    await page.screenshot({ 
      path: '/tmp/sticky_fix_final.png',
      fullPage: false
    });
    
    // 3초 동안 브라우저 열어둠
    console.log('6. 3초 동안 결과 확인...');
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('오류 발생:', error);
    await page.screenshot({ path: '/tmp/sticky_test_error.png' });
  } finally {
    await browser.close();
  }
}

testStickyFix().catch(console.error);