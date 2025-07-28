#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Map of unused imports from TypeScript errors
const unusedImports = {
  'app/admin/ai-trends/[id]/edit/page.tsx': ['motion'],
  'app/admin/ai-trends/new/page.tsx': ['motion'],
  'app/admin/ai-trends/page.tsx': ['user'],
  'app/admin/lectures/page.tsx': ['Upload', 'Video'],
  'app/admin/settings/page.tsx': ['motion', 'Settings', 'Mail', 'Palette', 'Bell', 'Key'],
  'app/admin/stats/page.tsx': ['PieChart'],
  'app/admin/users/page.tsx': ['Edit', 'MoreVertical'],
  'app/ai-trends/[slug]/page-client.tsx': ['Clock', 'router'],
  'app/ai-trends/page.tsx': ['TrendingUp'],
  'app/api/ai-trends/[id]/route.ts': ['request'],
  'app/api/ai-trends/slug/[slug]/route.ts': ['request'],
  'app/community/[category]/[id]/page.tsx': ['Edit2'],
  'app/lectures/[id]/page.tsx': ['Lock', 'supabase', 'enrollment', 'volume', 'setVolume'],
  'app/lectures/[id]/preview/page.tsx': ['isEnrolled', 'setIsEnrolled'],
  'app/lectures/page.tsx': ['Link', 'Clock', 'Star', 'Users', 'BookOpen', 'Sparkles', 'Code2', 'Trophy', 'Crown'],
  'app/mypage/page.tsx': ['Mail', 'Phone', 'Settings', 'Check', 'X'],
  'app/page.tsx': ['Code2', 'Globe', 'Zap', 'CheckCircle2', 'Star', 'Users', 'Timer'],
  'app/sites/page.tsx': ['TrendingUp', 'Star', 'Users', 'Calendar', 'Tag', 'Filter', 'MessageSquare', 'ImageIcon', 'Image'],
  'components/Footer.tsx': ['ExternalLink'],
  'lib/auth-context.tsx': ['getUserProfile']
};

// Process each file
Object.entries(unusedImports).forEach(([filePath, imports]) => {
  const fullPath = path.join('/home/qwg18/projects/dduksangLAB', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  imports.forEach(importName => {
    // Handle various import patterns
    // Pattern 1: import { A, B, C } from 'module'
    content = content.replace(
      new RegExp(`(import\\s*{[^}]*?)\\s*,?\\s*${importName}\\s*,?([^}]*}\\s*from)`, 'g'),
      (match, before, after) => {
        // Clean up extra commas
        let result = before + after;
        result = result.replace(/,\s*,/g, ',');
        result = result.replace(/{\s*,/g, '{');
        result = result.replace(/,\s*}/g, '}');
        return result;
      }
    );
    
    // Pattern 2: import A from 'module'
    content = content.replace(
      new RegExp(`^import\\s+${importName}\\s+from\\s+['"][^'"]+['"].*$`, 'gm'),
      ''
    );
    
    // Pattern 3: const [var1, var2] = ...
    if (importName.includes(',')) {
      const vars = importName.split(',').map(v => v.trim());
      vars.forEach(varName => {
        content = content.replace(
          new RegExp(`\\b${varName}\\b(?!:)`, 'g'),
          `_${varName}`
        );
      });
    } else {
      // For destructured variables in hooks
      if (['volume', 'setVolume', 'isEnrolled', 'setIsEnrolled', 'enrollment', 'user', 'router'].includes(importName)) {
        content = content.replace(
          new RegExp(`const\\s+\\[[^\\]]*${importName}[^\\]]*\\]`, 'g'),
          (match) => match.replace(importName, `_${importName}`)
        );
      }
    }
  });
  
  // Clean up empty lines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed: ${filePath}`);
});

console.log('Done!');