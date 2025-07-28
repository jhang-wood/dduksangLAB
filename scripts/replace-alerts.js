#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files with alert usage (based on ESLint output)
const filesToProcess = [
  'app/admin/ai-trends/[id]/edit/page.tsx',
  'app/admin/ai-trends/new/page.tsx', 
  'app/admin/ai-trends/page.tsx',
  'app/admin/lectures/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/users/page.tsx',
  'app/community/[category]/[id]/page.tsx',
  'app/community/write/page.tsx',
  'app/lectures/[id]/page.tsx',
  'app/mypage/page.tsx',
  'app/sites/page.tsx',
  'components/AdminDebug.tsx',
  'components/PaymentButton.tsx'
];

function processFile(filePath) {
  const fullPath = path.join('/home/qwg18/projects/dduksangLAB', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if userNotification is already imported
  const hasUserNotificationImport = content.includes("userNotification") || content.includes("from '@/lib/logger'");
  
  if (!hasUserNotificationImport) {
    // Check if logger is already imported and update the import
    if (content.includes("import { logger } from '@/lib/logger'")) {
      content = content.replace(
        "import { logger } from '@/lib/logger'",
        "import { logger, userNotification } from '@/lib/logger'"
      );
    } else {
      // Add new import
      const importRegex = /^((?:import.*from.*['"];?\n)*)/m;
      const match = content.match(importRegex);
      
      if (match) {
        const existingImports = match[1];
        const newImport = "import { userNotification } from '@/lib/logger'\n";
        content = content.replace(existingImports, existingImports + newImport);
      }
    }
  }
  
  // Replace alert() with userNotification.alert()
  content = content.replace(/\balert\(/g, 'userNotification.alert(');
  
  // Replace confirm() with userNotification.confirm()
  content = content.replace(/\bconfirm\(/g, 'userNotification.confirm(');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Processed: ${filePath}`);
}

// Process each file
filesToProcess.forEach(processFile);

console.log('Alert replacement completed!');