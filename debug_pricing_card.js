const { chromium } = require('playwright');

async function debugPricingCard() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
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
    
    console.log('2. 페이지 로드 완료, 가격 카드 찾는 중...');
    
    // 가격 카드 요소 찾기
    const pricingCard = await page.locator('[data-testid="pricing-card"], .pricing-card, .sticky').first();
    
    if (await pricingCard.count() === 0) {
      console.log('가격 카드를 찾을 수 없습니다. DOM 구조 확인 중...');
      
      // 가능한 가격 카드 선택자들 확인
      const possibleSelectors = [
        '.bg-gradient-to-br.from-deepBlack-600',
        '.sticky',
        '[class*="sticky"]',
        '[style*="position"]',
        '.lg\\:sticky',
        '[class*="price"]',
        '[class*="card"]'
      ];
      
      for (const selector of possibleSelectors) {
        const count = await page.locator(selector).count();
        if (count > 0) {
          console.log(`찾은 요소: ${selector} (${count}개)`);
        }
      }
      
      // 전체 DOM에서 sticky나 price 관련 요소 찾기
      const allElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const stickyElements = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          const className = el.className || '';
          
          if (style.position === 'sticky' || 
              (typeof className === 'string' && (className.includes('sticky') || 
               className.includes('price') ||
               className.includes('card')))) {
            stickyElements.push({
              tagName: el.tagName,
              className: el.className,
              position: style.position,
              top: style.top,
              id: el.id
            });
          }
        });
        
        return stickyElements;
      });
      
      console.log('Sticky/Price 관련 요소들:', allElements);
    }
    
    console.log('3. 스크린샷 촬영 - 초기 상태');
    await page.screenshot({ 
      path: '/tmp/lectures_initial.png',
      fullPage: true 
    });
    
    // 오른쪽 사이드바 영역 확인
    console.log('4. 오른쪽 사이드바 영역 확인');
    const sidebar = await page.locator('.lg\\:w-80, .lg\\:w-96, .w-80, .w-96').first();
    
    if (await sidebar.count() > 0) {
      console.log('사이드바 찾음');
      
      // 사이드바 내의 모든 요소 스타일 확인
      const sidebarStyles = await sidebar.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          position: style.position,
          top: style.top,
          height: style.height,
          className: el.className
        };
      });
      
      console.log('사이드바 스타일:', sidebarStyles);
      
      // 사이드바 내 자식 요소들의 position 확인
      const childStyles = await page.evaluate(() => {
        const sidebar = document.querySelector('.lg\\:w-80 , .lg\\:w-96, .w-80, .w-96');
        if (!sidebar) return [];
        
        const children = sidebar.querySelectorAll('*');
        const styles = [];
        
        children.forEach(child => {
          const style = window.getComputedStyle(child);
          if (style.position !== 'static') {
            styles.push({
              tagName: child.tagName,
              className: child.className,
              position: style.position,
              top: style.top,
              textContent: child.textContent.substring(0, 50)
            });
          }
        });
        
        return styles;
      });
      
      console.log('자식 요소 중 position이 static이 아닌 것들:', childStyles);
    }
    
    console.log('5. 스크롤 테스트 시작');
    
    // 페이지 높이 확인
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`페이지 높이: ${pageHeight}px`);
    
    // 스크롤 전 스크린샷
    await page.screenshot({ 
      path: '/tmp/lectures_before_scroll.png' 
    });
    
    // 천천히 스크롤하면서 테스트
    for (let i = 0; i <= 5; i++) {
      const scrollY = (pageHeight / 5) * i;
      console.log(`스크롤 위치: ${scrollY}px`);
      
      await page.evaluate((y) => {
        window.scrollTo(0, y);
      }, scrollY);
      
      await page.waitForTimeout(1000);
      
      // 각 스크롤 위치에서 스크린샷
      await page.screenshot({ 
        path: `/tmp/lectures_scroll_${i}.png` 
      });
      
      // 가격 카드의 현재 위치 확인
      const cardPosition = await page.evaluate(() => {
        const possibleCards = document.querySelectorAll('[class*="sticky"], .lg\\:sticky , [class*="price"], [class*="card"]');
        const positions = [];
        
        possibleCards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const style = window.getComputedStyle(card);
          
          positions.push({
            index,
            className: card.className,
            position: style.position,
            top: style.top,
            rectTop: rect.top,
            rectLeft: rect.left,
            textContent: card.textContent.substring(0, 30)
          });
        });
        
        return positions;
      });
      
      console.log(`스크롤 ${i} - 카드 위치:`, cardPosition);
    }
    
    console.log('6. 강제로 sticky 스타일 적용 시도');
    
    // 가격 카드로 보이는 요소에 강제로 sticky 적용
    await page.evaluate(() => {
      // 가능한 가격 카드 요소들을 찾아서 sticky 적용
      const potentialCards = document.querySelectorAll('[class*="bg-gradient-to-br"], .lg\\:w-80  > div, .w-80 > div');
      
      potentialCards.forEach((card, index) => {
        // 가격이나 결제 관련 텍스트가 포함된 요소 찾기
        const text = card.textContent.toLowerCase();
        if (text.includes('가격') || text.includes('원') || text.includes('결제') || text.includes('구매') || text.includes('신청')) {
          console.log(`가격 카드로 추정되는 요소 ${index} 발견:`, card.className);
          
          // 강제로 sticky 스타일 적용
          card.style.position = 'sticky';
          card.style.top = '100px';
          card.style.zIndex = '50';
          card.style.backgroundColor = 'rgb(20, 20, 20)';
          card.style.border = '2px solid gold';
          
          console.log(`요소 ${index}에 sticky 스타일 적용 완료`);
        }
      });
    });
    
    console.log('7. 스타일 적용 후 다시 스크롤 테스트');
    
    // 스타일 적용 후 다시 스크롤 테스트
    for (let i = 0; i <= 3; i++) {
      const scrollY = (pageHeight / 3) * i;
      
      await page.evaluate((y) => {
        window.scrollTo(0, y);
      }, scrollY);
      
      await page.waitForTimeout(1500);
      
      await page.screenshot({ 
        path: `/tmp/lectures_fixed_scroll_${i}.png` 
      });
    }
    
    console.log('8. 최종 DOM 구조 분석');
    
    const finalAnalysis = await page.evaluate(() => {
      const analysis = {
        stickyElements: [],
        sidebarElements: [],
        possiblePricingCards: []
      };
      
      // 모든 sticky 요소
      document.querySelectorAll('[style*="position: sticky"], [class*="sticky"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        analysis.stickyElements.push({
          className: el.className,
          position: window.getComputedStyle(el).position,
          top: window.getComputedStyle(el).top,
          rectTop: rect.top,
          textContent: el.textContent.substring(0, 50)
        });
      });
      
      // 사이드바 요소들
      document.querySelectorAll('.lg\\:w-80 , .w-80, .lg\\:w-96 , .w-96').forEach(el => {
        analysis.sidebarElements.push({
          className: el.className,
          childrenCount: el.children.length,
          textContent: el.textContent.substring(0, 100)
        });
      });
      
      // 가능한 가격 카드들
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent.toLowerCase();
        if ((text.includes('가격') || text.includes('원') || text.includes('결제')) && el.children.length < 10) {
          analysis.possiblePricingCards.push({
            tagName: el.tagName,
            className: el.className,
            position: window.getComputedStyle(el).position,
            textContent: el.textContent.substring(0, 100)
          });
        }
      });
      
      return analysis;
    });
    
    console.log('최종 분석 결과:', JSON.stringify(finalAnalysis, null, 2));
    
    // 5초 동안 브라우저를 열어둠 (수동 확인용)
    console.log('9. 5초 동안 브라우저 열어두기 (수동 확인)');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('오류 발생:', error);
    await page.screenshot({ path: '/tmp/error_screenshot.png' });
  } finally {
    await browser.close();
  }
}

debugPricingCard().catch(console.error);