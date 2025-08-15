const { chromium } = require('playwright');

async function testStickyCards() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('1. 페이지 로딩...');
    await page.goto('http://localhost:3002/lectures');
    
    // 페이지가 완전히 로드될 때까지 기다림
    await page.waitForTimeout(5000);
    
    // 로딩 스피너가 사라질 때까지 기다림
    try {
      await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 10000 });
      console.log('   - 로딩 완료');
    } catch (e) {
      console.log('   - 로딩 스피너 대기 타임아웃, 계속 진행');
    }
    
    // 초기 상태 스크린샷
    console.log('2. 초기 상태 캡처');
    await page.screenshot({ path: '/tmp/lectures_initial.png', fullPage: false });
    
    // StickyPriceCard 요소 확인
    const stickyCardExists = await page.$('.sticky-price-card');
    console.log('3. StickyPriceCard 요소 존재:', !!stickyCardExists);
    
    if (stickyCardExists) {
      // 스크롤 테스트 시작
      console.log('4. 스크롤 테스트 시작');
      
      // 각 스크롤 단계별 테스트
      const scrollPoints = [100, 200, 300, 500, 1000, 1500];
      
      for (let i = 0; i < scrollPoints.length; i++) {
        const scrollY = scrollPoints[i];
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(800); // 애니메이션 대기
        
        // 스크롤 후 스크린샷
        await page.screenshot({ 
          path: `/tmp/lectures_scroll_${scrollY}.png`, 
          fullPage: false 
        });
        
        // sticky 상태 확인
        const cardStyle = await page.evaluate(() => {
          const card = document.querySelector('.sticky-price-card');
          if (card) {
            const computed = window.getComputedStyle(card);
            return {
              position: computed.position,
              top: computed.top,
              zIndex: computed.zIndex,
              transform: computed.transform
            };
          }
          return null;
        });
        
        console.log(`   - ${scrollY}px 스크롤: position=${cardStyle?.position}, top=${cardStyle?.top}`);
      }
      
      // 페이지 끝까지 스크롤
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '/tmp/lectures_scroll_end.png', fullPage: false });
      console.log('   - 페이지 끝까지 스크롤 완료');
      
    } else {
      console.log('4. StickyPriceCard 요소를 찾을 수 없음');
    }
    
    // 모든 fixed position 요소 확인
    const fixedElements = await page.$$eval('*', elements => 
      Array.from(elements)
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.position === 'fixed' || style.position === 'sticky';
        })
        .map(el => ({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          position: window.getComputedStyle(el).position
        }))
    );
    console.log('5. Fixed/Sticky position 요소들:', fixedElements);
    
    // 최종 스크롤 위치 확인
    const finalScrollPosition = await page.evaluate(() => window.pageYOffset);
    console.log('6. 최종 스크롤 위치:', finalScrollPosition);
    
    console.log('7. 테스트 완료!');
    
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

testStickyCards();