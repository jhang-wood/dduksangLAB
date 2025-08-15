const { chromium } = require('playwright');

async function testStickyCard() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('📍 Navigating to localhost:3002/lectures...');
    await page.goto('http://localhost:3002/lectures');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ path: '/tmp/lectures_initial.png', fullPage: true });
    
    // Check if the sticky card with the specified gradient background exists
    console.log('🔍 Checking for StickyPriceCard with gradient background...');
    const stickyCard = await page.locator('.bg-gradient-to-b.from-deepBlack-300\\/60.to-deepBlack-400\\/60').first();
    const cardExists = await stickyCard.count() > 0;
    
    if (cardExists) {
      console.log('✅ StickyPriceCard found with specified gradient background');
      
      // Get initial position
      const initialBox = await stickyCard.boundingBox();
      console.log(`📏 Initial card position: top=${initialBox?.y}, left=${initialBox?.x}`);
      
      // Test scrolling behavior
      console.log('📜 Testing scroll behavior...');
      
      // Scroll down 25% of page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.25));
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/lectures_scroll_25.png' });
      
      const box25 = await stickyCard.boundingBox();
      console.log(`📏 Position at 25% scroll: top=${box25?.y}, left=${box25?.x}`);
      
      // Scroll down 50% of page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/lectures_scroll_50.png' });
      
      const box50 = await stickyCard.boundingBox();
      console.log(`📏 Position at 50% scroll: top=${box50?.y}, left=${box50?.x}`);
      
      // Scroll down 75% of page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/lectures_scroll_75.png' });
      
      const box75 = await stickyCard.boundingBox();
      console.log(`📏 Position at 75% scroll: top=${box75?.y}, left=${box75?.x}`);
      
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/lectures_scroll_bottom.png' });
      
      const boxBottom = await stickyCard.boundingBox();
      console.log(`📏 Position at bottom: top=${boxBottom?.y}, left=${boxBottom?.x}`);
      
      // Analyze sticky behavior
      console.log('\n🔍 Sticky Behavior Analysis:');
      
      if (initialBox && box25 && box50 && box75 && boxBottom) {
        const topPositions = [initialBox.y, box25.y, box50.y, box75.y, boxBottom.y];
        console.log(`Top positions during scroll: ${topPositions.join(', ')}`);
        
        // Check if card follows naturally (not stuck at very top)
        const isStuckAtTop = topPositions.every(pos => pos === topPositions[0] && pos < 100);
        const followsNaturally = topPositions.some(pos => pos !== topPositions[0]);
        
        if (isStuckAtTop) {
          console.log('❌ Card appears to be stuck at the very top (not natural sticky behavior)');
        } else if (followsNaturally) {
          console.log('✅ Card follows naturally during scroll (good sticky behavior)');
        } else {
          console.log('⚠️  Unclear sticky behavior - needs manual inspection');
        }
      }
      
    } else {
      console.log('❌ StickyPriceCard with specified gradient background not found');
      
      // Check for any elements with similar class patterns
      const alternativeCards = await page.locator('[class*="bg-gradient"]').count();
      console.log(`🔍 Found ${alternativeCards} elements with gradient backgrounds`);
    }
    
  } catch (error) {
    console.error('❌ Error testing sticky card:', error.message);
  } finally {
    await browser.close();
  }
}

testStickyCard();