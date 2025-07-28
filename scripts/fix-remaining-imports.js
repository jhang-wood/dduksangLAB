#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Remaining files with import syntax errors
const files = [
  'app/admin/users/page.tsx',
  'app/lectures/[id]/page.tsx', 
  'app/lectures/page.tsx',
  'app/sites/page.tsx'
];

files.forEach(filePath => {
  const fullPath = path.join('/home/qwg18/projects/dduksangLAB', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix common import patterns
  // Pattern: Missing comma after icon name in import statement
  content = content.replace(/(\w+)\s*\n\s*(\w+[,\s]*[})])/g, (match, p1, p2) => {
    // Check if we're in an import statement
    if (match.includes('}') && !p1.endsWith(',')) {
      return `${p1},\n  ${p2}`;
    }
    return match;
  });
  
  // Specific fixes
  if (filePath.includes('admin/users')) {
    content = content.replace(/Ban\s+Shield/g, 'Ban,\n  Shield');
  }
  
  if (filePath.includes('lectures/[id]')) {
    content = content.replace(/PlayCircle\s+Users/g, 'PlayCircle,\n  Users');
  }
  
  if (filePath.includes('lectures/page')) {
    content = content.replace(/BarChart3\s+Filter/g, 'BarChart3,\n  Filter');
    content = content.replace(/Heart\s+Activity/g, 'Heart,\n  Activity');
    content = content.replace(/Brain\s+Briefcase/g, 'Brain,\n  Briefcase');
  }
  
  if (filePath.includes('sites/page')) {
    content = content.replace(/ExternalLink\s+BarChart3/g, 'ExternalLink,\n  BarChart3');
    content = content.replace(/Eye\s+Heart/g, 'Eye,\n  Heart');
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed: ${filePath}`);
});

console.log('Done!');