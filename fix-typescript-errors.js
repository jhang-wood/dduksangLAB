#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 TypeScript 오류 자동 수정 시작...\n');

// 수정할 파일 목록
const filesToFix = [
  'app/admin/lectures/page.tsx',
  'app/admin/page.tsx',
  'app/ai-trends/[slug]/page.tsx',
  'app/api/admin/settings/route.ts',
  'app/api/ai-trends/[id]/route.ts',
  'app/api/ai-trends/route.ts',
  'app/api/payment/route.ts',
  'app/api/payment/webhook/route.ts',
  'app/community/[category]/[id]/page.tsx',
  'app/community/write/page.tsx',
  'app/lectures/[id]/page.tsx',
  'app/payment/success/page.tsx',
  'app/sites/page.tsx',
  'components/CurriculumAccordion.tsx',
  'components/GamificationSystem.tsx',
  'components/InteractiveElements.tsx',
  'components/NeuralNetworkBackground.tsx',
  'components/ProtectedRoute.tsx',
  'components/TagSystem.tsx',
  'lib/ai-content-generator.ts',
  'lib/env-loader.ts',
  'lib/payment/payapp.ts',
  'middleware.ts',
  'utils/helpers.ts'
];

let totalFixed = 0;

// Nullish coalescing 패턴 수정
function fixNullishCoalescing(content) {
  let fixed = content;
  let count = 0;
  
  // Pattern 1: !variable ?? -> !variable ||
  fixed = fixed.replace(/!\w+(\.\w+)*\s*\?\?\s*!/g, (match) => {
    count++;
    return match.replace(/\?\?/g, '||');
  });
  
  // Pattern 2: Single ! before ??
  fixed = fixed.replace(/!\s*(\w+(\.\w+)*)\s*\?\?/g, (match, varName) => {
    count++;
    return `!${varName} ||`;
  });
  
  // Pattern 3: Wrong ?? usage in conditions
  fixed = fixed.replace(/\|\|\s*(\w+(\.\w+)*)\s*\?\?\s*/g, (match, varName) => {
    count++;
    return `|| ${varName} || `;
  });
  
  return { fixed, count };
}

// 각 파일 처리
filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  파일 없음: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const { fixed, count } = fixNullishCoalescing(content);
  
  if (count > 0) {
    fs.writeFileSync(fullPath, fixed, 'utf8');
    console.log(`✅ 수정 완료: ${filePath} (${count}개)`);
    totalFixed += count;
  } else {
    console.log(`⏭️  변경 없음: ${filePath}`);
  }
});

console.log(`\n🎉 총 ${totalFixed}개의 오류 수정 완료!`);