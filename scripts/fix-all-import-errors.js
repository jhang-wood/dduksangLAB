#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files with import syntax errors based on TypeScript output
const fixes = {
  'app/admin/settings/page.tsx': [
    { line: 11, after: 'Shield' },
    { line: 12, after: 'Globe' }
  ],
  'app/admin/users/page.tsx': [
    { line: 10, after: 'Ban' }
  ],
  'app/ai-trends/[slug]/page-client.tsx': [
    { line: 6, after: 'User', position: 19 }
  ],
  'app/lectures/[id]/page.tsx': [
    { line: 16, after: 'PlayCircle' }
  ],
  'app/lectures/page.tsx': [
    { line: 9, after: 'BarChart3' },
    { line: 11, after: 'Heart' },
    { line: 15, after: 'Brain' }
  ],
  'app/mypage/page.tsx': [
    { line: 8, after: 'User', position: 8 },
    { line: 9, after: 'Activity', position: 16 }
  ],
  'app/page.tsx': [
    { line: 8, after: 'Briefcase' },
    { line: 9, after: 'Brain' },
    { line: 10, after: 'Globe' }
  ],
  'app/sites/page.tsx': [
    { line: 7, after: 'ExternalLink' },
    { line: 15, after: 'Eye' }
  ]
};

// Process each file
Object.entries(fixes).forEach(([filePath, errors]) => {
  const fullPath = path.join('/home/qwg18/projects/dduksangLAB', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let lines = content.split('\n');
  
  // Sort errors by line number in reverse order to avoid index shifting
  errors.sort((a, b) => b.line - a.line);
  
  errors.forEach(error => {
    const lineIndex = error.line - 1;
    if (lineIndex >= 0 && lineIndex < lines.length) {
      let line = lines[lineIndex];
      
      // Check if line doesn't end with comma (excluding lines with { or })
      if (!line.trim().endsWith(',') && 
          !line.trim().endsWith('{') && 
          !line.trim().endsWith('}') &&
          line.trim().length > 0) {
        // Add comma
        lines[lineIndex] = line.trimEnd() + ',';
        console.log(`Fixed line ${error.line} in ${filePath}: added comma`);
      }
    }
  });
  
  content = lines.join('\n');
  fs.writeFileSync(fullPath, content);
  console.log(`Processed: ${filePath}`);
});

console.log('Done!');