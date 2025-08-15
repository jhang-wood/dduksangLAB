const { chromium } = require('playwright');

async function checkCardPosition() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('1. 페이지 접속');
    await page.goto('http://localhost:3000/lectures', { 
      waitUntil: 'networkidle' 
    });
    
    console.log('2. 페이지 레이아웃 분석');
    
    // aside 요소 찾기
    const aside = await page.locator('aside.lg\\:w-80').first();
    
    if (await aside.count() > 0) {
      const asideInfo = await aside.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          visible: rect.top < window.innerHeight
        };
      });
      
      console.log('Aside 요소 위치:', asideInfo);
      
      // sticky 카드 찾기
      const stickyCard = await page.locator('[style*="position: sticky"]').first();
      
      if (await stickyCard.count() > 0) {
        const cardInfo = await stickyCard.evaluate(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            visible: rect.top < window.innerHeight,
            position: style.position,
            styleTop: style.top,
            zIndex: style.zIndex
          };
        });
        
        console.log('가격 카드 정보:', cardInfo);
        
        if (cardInfo.visible) {
          console.log('✅ 가격 카드가 초기에 보입니다!');
        } else {
          console.log('❌ 가격 카드가 초기에 보이지 않습니다. 스크롤 필요');
        }
      }
    }
    
    console.log('3. 스크롤 후 카드 동작 확인');
    
    // 천천히 스크롤하면서 카드가 언제 나타나는지 확인
    for (let i = 1; i <= 10; i++) {
      const scrollY = i * 500; // 500px씩 스크롤
      
      await page.evaluate((y) => {
        window.scrollTo(0, y);
      }, scrollY);
      
      await page.waitForTimeout(300);
      
      const stickyCard = await page.locator('[style*="position: sticky"]').first();
      
      if (await stickyCard.count() > 0) {
        const cardPos = await stickyCard.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top,
            visible: rect.top >= 0 && rect.top <= window.innerHeight,
            isSticky: rect.top <= 96 && rect.top >= 0 // top: 96px 근처에 고정되는지
          };
        });
        
        console.log(`스크롤 ${scrollY}px: 카드 top=${cardPos.top}px, visible=${cardPos.visible}, sticky=${cardPos.isSticky}`);
        
        if (cardPos.isSticky) {
          console.log('🎉 카드가 sticky 위치에 고정되었습니다!');
          
          // 스크린샷 촬영
          await page.screenshot({ 
            path: `/tmp/sticky_working_${i}.png`,
            fullPage: false
          });
          
          // 더 스크롤해서 sticky가 유지되는지 확인
          for (let j = 1; j <= 5; j++) {
            await page.evaluate((y) => {
              window.scrollTo(0, y);
            }, scrollY + j * 1000);
            
            await page.waitForTimeout(500);
            
            const stickyCheck = await stickyCard.evaluate(el => {
              const rect = el.getBoundingClientRect();
              return {
                top: rect.top,
                stillSticky: Math.abs(rect.top - 96) < 10 // 96px 근처에 있는지
              };
            });
            
            console.log(`  추가 스크롤 ${j}: top=${stickyCheck.top}px, sticky=${stickyCheck.stillSticky}`);
            
            if (stickyCheck.stillSticky) {
              console.log('  ✅ 여전히 sticky 상태 유지 중');
            }
          }
          
          break;
        }
      }
    }
    
    console.log('4. 최종 테스트 - 데스크톱 화면에서 동작 확인');
    
    // 페이지 중간으로 이동
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 3);
    });
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: '/tmp/final_sticky_test.png',
      fullPage: false
    });
    
    console.log('5초 동안 수동 확인...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('오류:', error);
  } finally {
    await browser.close();
  }
}

checkCardPosition().catch(console.error);