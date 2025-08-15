const { chromium } = require('playwright');

async function stickySuccessTest() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🎉 Sticky 가격 카드 성공 테스트');
    
    await page.goto('http://localhost:3000/lectures', { 
      waitUntil: 'networkidle' 
    });
    
    console.log('1. 올바른 선택자로 카드 찾기');
    
    // 올바른 선택자 사용
    const stickyCard = await page.locator('.sticky').first();
    
    if (await stickyCard.count() > 0) {
      console.log('✅ Sticky 카드 발견!');
      
      const cardInfo = await stickyCard.evaluate(el => {
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
          zIndex: style.zIndex,
          className: el.className
        };
      });
      
      console.log('카드 초기 상태:', cardInfo);
      
      if (cardInfo.visible) {
        console.log('✅ 카드가 화면에 보입니다!');
      } else {
        console.log('❌ 카드가 화면에 보이지 않음');
      }
      
      console.log('2. 스크롤 테스트 - sticky 동작 확인');
      
      // 초기 스크린샷
      await page.screenshot({ 
        path: '/tmp/sticky_initial.png',
        fullPage: false
      });
      
      let stickyActivated = false;
      
      // 스크롤하면서 sticky 동작 확인
      for (let i = 1; i <= 15; i++) {
        const scrollY = i * 200;
        
        await page.evaluate((y) => {
          window.scrollTo({ top: y, behavior: 'instant' });
        }, scrollY);
        
        await page.waitForTimeout(300);
        
        const scrollState = await stickyCard.evaluate(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return {
            scrollY: window.scrollY,
            rectTop: rect.top,
            styleTop: style.top,
            visible: rect.top >= 0 && rect.top < window.innerHeight,
            isNearStickyTop: Math.abs(rect.top - 96) < 20, // top-24 = 96px
            position: style.position
          };
        });
        
        console.log(`스크롤 ${scrollY}px: rectTop=${scrollState.rectTop.toFixed(1)}px, visible=${scrollState.visible}, nearSticky=${scrollState.isNearStickyTop}`);
        
        if (scrollState.isNearStickyTop && scrollState.visible && !stickyActivated) {
          console.log('🎉 STICKY 활성화! 카드가 상단에 고정되기 시작!');
          stickyActivated = true;
          
          await page.screenshot({ 
            path: `/tmp/sticky_activated_${i}.png`,
            fullPage: false
          });
          
          // 더 스크롤해서 계속 고정되는지 확인
          for (let j = 1; j <= 10; j++) {
            await page.evaluate((y) => {
              window.scrollTo({ top: y, behavior: 'instant' });
            }, scrollY + j * 300);
            
            await page.waitForTimeout(200);
            
            const continueState = await stickyCard.evaluate(el => {
              const rect = el.getBoundingClientRect();
              return {
                top: rect.top,
                isSticky: Math.abs(rect.top - 96) < 20,
                visible: rect.top >= 0 && rect.top < window.innerHeight
              };
            });
            
            console.log(`  계속 스크롤 +${j*300}: top=${continueState.top.toFixed(1)}px, sticky=${continueState.isSticky}, visible=${continueState.visible}`);
            
            if (continueState.isSticky && continueState.visible) {
              console.log('  ✅ 여전히 sticky 상태로 상단에 고정됨!');
            } else {
              console.log('  ❌ sticky 상태가 해제됨');
              break;
            }
          }
          
          break;
        }
      }
      
      if (!stickyActivated) {
        console.log('❌ Sticky가 활성화되지 않았습니다');
        
        // 더 많이 스크롤해서 카드가 화면에 나타나는지 확인
        console.log('더 많이 스크롤해서 카드 찾기...');
        
        for (let i = 1; i <= 20; i++) {
          await page.evaluate((y) => {
            window.scrollTo({ top: y, behavior: 'instant' });
          }, i * 500);
          
          await page.waitForTimeout(200);
          
          const state = await stickyCard.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return {
              top: rect.top,
              visible: rect.top >= 0 && rect.top < window.innerHeight
            };
          });
          
          if (state.visible) {
            console.log(`스크롤 ${i*500}px에서 카드 발견! top=${state.top.toFixed(1)}px`);
            await page.screenshot({ 
              path: `/tmp/card_found_${i}.png`,
              fullPage: false
            });
            break;
          }
        }
      } else {
        console.log('✅ Sticky 테스트 성공!');
      }
      
    } else {
      console.log('❌ Sticky 카드를 찾을 수 없습니다');
    }
    
    console.log('3. 최종 확인 - 페이지 상단으로 돌아가기');
    
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: '/tmp/final_result.png',
      fullPage: false
    });
    
    console.log('✅ 테스트 완료! 5초 후 브라우저 종료...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ 오류:', error);
    await page.screenshot({ path: '/tmp/test_error.png' });
  } finally {
    await browser.close();
  }
}

stickySuccessTest().catch(console.error);