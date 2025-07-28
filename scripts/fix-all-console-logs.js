#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 처리할 파일 목록 (Grep 결과에서 추출)
const files = [
  'app/payment/success/page.tsx',
  'app/community/[category]/[id]/page.tsx', 
  'app/community/write/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/lectures/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/ai-trends/new/page.tsx',
  'app/ai-trends/page.tsx',
  'lib/payapp.ts',
  'lib/payment/payapp.ts',
  'app/admin/ai-trends/[id]/edit/page.tsx',
  'app/admin/ai-trends/page.tsx',
  'app/ai-trends/[slug]/page-client.tsx',
  'lib/supabase.ts',
  'app/ai-trends/[slug]/page.tsx',
  'app/api/payment/route.ts',
  'app/lectures/[id]/page.tsx',
  'app/api/payment/webhook/route.ts',
  'app/lectures/[id]/preview/page.tsx',
  'app/api/payment/callback/route.ts',
  'app/api/cron/collect-ai-trends/route.ts',
  'app/api/ai-trends/route.ts',
  'app/api/ai-trends/collect/route.ts',
  'app/api/ai-trends/slug/[slug]/route.ts',
  'app/api/ai-trends/[id]/route.ts',
  'app/admin/stats/page.tsx'
];

function processFile(relativePath) {
  const fullPath = path.join(__dirname, '..', relativePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if logger is already imported
  const hasLoggerImport = content.includes("from '@/lib/logger'");
  const hasConsoleUsage = content.match(/console\.(log|error|warn)/);
  
  if (!hasConsoleUsage) {
    return; // Skip if no console usage
  }
  
  // Add logger import if not present
  if (!hasLoggerImport) {
    // Find import section and add logger import
    const importLines = content.match(/^import.*$/gm) || [];
    if (importLines.length > 0) {
      const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
      const afterLastImport = lastImportIndex + importLines[importLines.length - 1].length;
      
      content = content.slice(0, afterLastImport) + "\nimport { logger } from '@/lib/logger'" + content.slice(afterLastImport);
    } else {
      // No imports found, add at the beginning
      content = "import { logger } from '@/lib/logger'\n" + content;
    }
  }
  
  // Replace console.log/error/warn with logger equivalents
  content = content.replace(/console\.log\(/g, 'logger.log(');
  content = content.replace(/console\.error\(/g, 'logger.error(');
  content = content.replace(/console\.warn\(/g, 'logger.warn(');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Processed: ${relativePath}`);
}

// Process all files
files.forEach(file => {
  try {
    processFile(file);
  } catch (error) {
    console.log(`Error processing ${file}:`, error.message);
  }
});

console.log('All console.log replacements completed!');