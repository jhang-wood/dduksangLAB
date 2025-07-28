#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files with import syntax errors
const files = [
  'app/admin/lectures/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/users/page.tsx',
  'app/ai-trends/[slug]/page-client.tsx',
  'app/lectures/[id]/page.tsx',
  'app/lectures/page.tsx',
  'app/mypage/page.tsx',
  'app/page.tsx',
  'app/sites/page.tsx'
];

files.forEach(filePath => {
  const fullPath = path.join('/home/qwg18/projects/dduksangLAB', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix import syntax - add missing commas
  content = content.replace(/EyeOff\n\s*Save/g, 'EyeOff,\n  Save');
  content = content.replace(/X\n\s*ChevronDown/g, 'X,\n  ChevronDown');
  content = content.replace(/Shield\n\s*Database/g, 'Shield,\n  Database');
  content = content.replace(/Lock\n\s*Bell/g, 'Lock,\n  Bell');
  content = content.replace(/Ban\n\s*Shield/g, 'Ban,\n  Shield');
  content = content.replace(/User\n\s*Calendar/g, 'User,\n  Calendar');
  content = content.replace(/PlayCircle\n\s*Users/g, 'PlayCircle,\n  Users');
  content = content.replace(/BarChart3\n\s*Filter/g, 'BarChart3,\n  Filter');
  content = content.replace(/Briefcase\n\s*Rocket/g, 'Briefcase,\n  Rocket');
  content = content.replace(/Brain\n\s*Briefcase/g, 'Brain,\n  Briefcase');
  content = content.replace(/ExternalLink\n\s*BarChart3/g, 'ExternalLink,\n  BarChart3');
  content = content.replace(/Heart\n\s*Activity/g, 'Heart,\n  Activity');
  
  // Fix general pattern: missing comma after icon name
  content = content.replace(/([a-zA-Z0-9]+)\n(\s+)([A-Z][a-zA-Z0-9]+)/g, (match, p1, p2, p3) => {
    // Check if it's within an import statement
    const lines = content.split('\n');
    let inImport = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        // Check previous lines for import {
        for (let j = i; j >= 0 && j > i - 10; j--) {
          if (lines[j].includes('import {') || lines[j].includes('import{')) {
            inImport = true;
            break;
          }
          if (lines[j].includes('}') && lines[j].includes('from')) {
            break;
          }
        }
        break;
      }
    }
    
    if (inImport && !p1.endsWith(',')) {
      return `${p1},\n${p2}${p3}`;
    }
    return match;
  });
  
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed: ${filePath}`);
});

console.log('Done!');