#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 처리할 파일 목록
const files = [
  'app/admin/ai-trends/[id]/edit/page.tsx',
  'app/admin/ai-trends/new/page.tsx', 
  'app/admin/ai-trends/page.tsx'
];

function processFile(relativePath) {
  const fullPath = path.join(__dirname, '..', relativePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if it has 'use client' directive in wrong position
  const wrongUseClient = content.match(/^import.*\n.*'use client'/m);
  
  if (wrongUseClient) {
    // Remove the wrongly placed 'use client'
    content = content.replace(/^import[^\n]*\n[^\n]*'use client'/m, match => {
      return match.replace(/'use client'/, '');
    });
    
    // Add 'use client' at the top
    content = "'use client'\n\n" + content;
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed 'use client' position in: ${relativePath}`);
  }
}

// Process all files
files.forEach(file => {
  try {
    processFile(file);
  } catch (error) {
    console.log(`Error processing ${file}:`, error.message);
  }
});

console.log('Use client directive fix completed!');