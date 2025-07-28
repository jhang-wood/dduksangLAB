#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 처리할 파일 목록
const files = [
  'app/admin/lectures/page.tsx',
  'app/admin/settings/page.tsx', 
  'app/admin/users/page.tsx',
  'app/community/[category]/[id]/page.tsx',
  'app/community/write/page.tsx'
];

function processFile(relativePath) {
  const fullPath = path.join(__dirname, '..', relativePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if it has the pattern: import ... from '@/lib/logger'\n'use client'
  const pattern = /^(import [^']* from '@\/lib\/logger')\n'use client'/m;
  
  if (pattern.test(content)) {
    // Replace the pattern: move 'use client' to the top
    content = content.replace(pattern, (match, importLine) => {
      return `'use client'\n\n${importLine}`;
    });
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed 'use client' position in: ${relativePath}`);
  } else {
    console.log(`No pattern found in: ${relativePath}`);
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