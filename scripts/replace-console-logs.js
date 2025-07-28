#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
// const glob = require('glob');

// Files to process (based on ESLint output)
const filesToProcess = [
  'app/mypage/page.tsx',
  'lib/auth-context.tsx',
  'components/AdminDebug.tsx'
];

// Add logger import and replace console.log
function processFile(filePath) {
  const fullPath = path.join('/home/qwg18/projects/dduksangLAB', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if logger is already imported
  const hasLoggerImport = content.includes("import { logger }") || content.includes("from '@/lib/logger'");
  
  if (!hasLoggerImport) {
    // Add logger import after existing imports
    const importRegex = /^((?:import.*from.*['"];?\n)*)/m;
    const match = content.match(importRegex);
    
    if (match) {
      const existingImports = match[1];
      const newImport = "import { logger } from '@/lib/logger'\n";
      content = content.replace(existingImports, existingImports + newImport);
    }
  }
  
  // Replace console.log with logger.log
  content = content.replace(/console\.log\(/g, 'logger.log(');
  
  // Replace console.error with logger.error  
  content = content.replace(/console\.error\(/g, 'logger.error(');
  
  // Replace console.warn with logger.warn
  content = content.replace(/console\.warn\(/g, 'logger.warn(');
  
  // Replace console.info with logger.info
  content = content.replace(/console\.info\(/g, 'logger.info(');
  
  // Replace console.debug with logger.debug
  content = content.replace(/console\.debug\(/g, 'logger.debug(');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Processed: ${filePath}`);
}

// Process each file
filesToProcess.forEach(processFile);

console.log('Console.log replacement completed!');