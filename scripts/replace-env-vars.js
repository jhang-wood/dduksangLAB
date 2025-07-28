#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 처리할 파일 목록
const files = [
  'app/api/ai-trends/[id]/route.ts',
  'app/api/ai-trends/collect/route.ts', 
  'app/api/ai-trends/slug/[slug]/route.ts',
  'app/api/cron/collect-ai-trends/route.ts',
  'app/ai-trends/[slug]/page.tsx',
  'app/robots.ts',
  'app/sitemap.ts',
  'lib/payment/payapp.ts'
];

function processFile(relativePath) {
  const fullPath = path.join(__dirname, '..', relativePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if env import is already present
  const hasEnvImport = content.includes("from '@/lib/env'");
  
  // Check if file uses process.env
  const hasProcessEnv = content.match(/process\.env\./);
  
  if (!hasProcessEnv) {
    return; // Skip if no process.env usage
  }
  
  // Add env import if not present
  if (!hasEnvImport) {
    // Find import section and add env import
    const importLines = content.match(/^import.*$/gm) || [];
    if (importLines.length > 0) {
      const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
      const afterLastImport = lastImportIndex + importLines[importLines.length - 1].length;
      
      content = content.slice(0, afterLastImport) + "\nimport { env } from '@/lib/env'" + content.slice(afterLastImport);
    }
  }
  
  // Replace common environment variable patterns
  content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_URL!/g, 'env.supabaseUrl');
  content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_URL/g, 'env.supabaseUrl');
  content = content.replace(/process\.env\.SUPABASE_SERVICE_ROLE_KEY!/g, 'env.supabaseServiceKey');
  content = content.replace(/process\.env\.SUPABASE_SERVICE_ROLE_KEY/g, 'env.supabaseServiceKey');
  content = content.replace(/process\.env\.OPENAI_API_KEY/g, 'env.openaiApiKey');
  content = content.replace(/process\.env\.NODE_ENV === 'development'/g, 'env.isDevelopment');
  content = content.replace(/process\.env\.NODE_ENV === 'production'/g, 'env.isProduction');
  content = content.replace(/process\.env\.NODE_ENV !== 'production'/g, '!env.isProduction');
  
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

console.log('Environment variable replacement completed!');