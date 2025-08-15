const { chromium } = require('playwright');

async function finalStickyTest() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 최종 Sticky 가격 카드 테스트 시작');
    
    await page.goto('http://localhost:3000/lectures', { 
      waitUntil: 'networkidle' 
    });
    
    console.log('1. 초기 상태 확인');
    
    // sticky 카드 찾기
    const stickyCard = await page.locator('[style*="position: sticky"]').first();
    
    if (await stickyCard.count() > 0) {
      const initialState = await stickyCard.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: rect.top >= 0 && rect.top < window.innerHeight,
          position: style.position,
          styleTop: style.top,
          zIndex: style.zIndex
        };
      });
      
      console.log('가격 카드 초기 상태:', initialState);
      
      if (initialState.visible) {
        console.log('✅ 카드가 초기에 보입니다!');
      } else {
        console.log('❌ 카드가 초기에 보이지 않습니다');
      }
      
      // 초기 스크린샷
      await page.screenshot({ 
        path: '/tmp/final_test_initial.png'
      });
      
      console.log('2. 스크롤 테스트 - sticky 동작 확인');
      
      let stickyWorking = false;
      
      // 천천히 스크롤하면서 테스트
      for (let i = 1; i <= 10; i++) {
        const scrollY = i * 300;
        
        await page.evaluate((y) => {
          window.scrollTo({ top: y, behavior: 'instant' });
        }, scrollY);
        
        await page.waitForTimeout(500);
        
        const scrollState = await stickyCard.evaluate(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return {
            scrollY: window.scrollY,
            top: rect.top,
            visible: rect.top >= 0 && rect.top < window.innerHeight,
            isAtStickyPosition: Math.abs(rect.top - 96) < 50, // 96px(6rem) 근처
            position: style.position
          };
        });
        
        console.log(`스크롤 ${scrollY}px: top=${scrollState.top}px, visible=${scrollState.visible}, sticky=${scrollState.isAtStickyPosition}`);
        
        if (scrollState.isAtStickyPosition && scrollState.visible) {
          console.log('🎉 STICKY 동작 확인! 카드가 고정 위치에 있습니다!');
          stickyWorking = true;
          
          await page.screenshot({ 
            path: `/tmp/sticky_working_${i}.png`
          });
          
          // 추가로 더 스크롤해서 계속 고정되는지 확인
          for (let j = 1; j <= 5; j++) {
            await page.evaluate((y) => {
              window.scrollTo({ top: y, behavior: 'instant' });
            }, scrollY + j * 500);
            
            await page.waitForTimeout(300);
            
            const continueState = await stickyCard.evaluate(el => {
              const rect = el.getBoundingClientRect();
              return {
                top: rect.top,
                stillSticky: Math.abs(rect.top - 96) < 50
              };
            });
            
            console.log(`  추가 스크롤 +${j*500}: top=${continueState.top}px, sticky=${continueState.stillSticky}`);
            
            if (continueState.stillSticky) {
              console.log('  ✅ 계속 sticky 상태 유지');
            }
          }
          
          break;
        }
      }
      
      if (!stickyWorking) {
        console.log('❌ Sticky 동작이 확인되지 않았습니다.');
        
        // 더 자세한 디버깅 정보
        const debugInfo = await page.evaluate(() => {
          const stickyEl = document.querySelector('[style*="position: sticky"]');
          if (!stickyEl) return { error: 'sticky 요소를 찾을 수 없음' };
          
          const rect = stickyEl.getBoundingClientRect();
          const style = window.getComputedStyle(stickyEl);
          const parent = stickyEl.parentElement;
          const parentRect = parent ? parent.getBoundingClientRect() : null;
          
          return {
            element: {
              position: style.position,
              top: style.top,
              zIndex: style.zIndex,
              rectTop: rect.top,
              rectHeight: rect.height
            },
            parent: parentRect ? {
              top: parentRect.top,
              height: parentRect.height
            } : null,
            viewport: {
              scrollY: window.scrollY,
              innerHeight: window.innerHeight
            }
          };
        });
        
        console.log('디버깅 정보:', debugInfo);
      }
      
    } else {
      console.log('❌ sticky 카드를 찾을 수 없습니다');
      
      // 모든 가능한 카드 요소 찾기
      const allCards = await page.evaluate(() => {
        const cards = document.querySelectorAll('[class*="StickyPriceCard"], [class*="sticky"], [class*="price"]');
        return Array.from(cards).map(card => ({
          tagName: card.tagName,
          className: card.className,
          position: window.getComputedStyle(card).position,
          textContent: card.textContent.substring(0, 100)
        }));
      });
      
      console.log('발견된 카드들:', allCards);
    }
    
    console.log('3. 최종 상태 확인');
    
    // 페이지 상단으로 돌아가기
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: '/tmp/final_test_complete.png'
    });
    
    console.log('✅ 테스트 완료! 5초 동안 브라우저 확인...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    await page.screenshot({ path: '/tmp/error_final_test.png' });
  } finally {
    await browser.close();
  }
}

finalStickyTest().catch(console.error);