#!/usr/bin/env node

/**
 * TypeScript 오류 자동 수정 도구
 * 향후 유사한 문제 발생 시 자동으로 수정
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 TypeScript 자동 수정 도구 시작...\n');

// 수정 패턴 정의
const fixPatterns = [
  {
    name: 'Nullish Coalescing (??를 ||로 수정)',
    pattern: /(![\w.]+)\s*\?\?\s*(![\w.]+)/g,
    replacement: '$1 || $2',
    description: '!value ?? !other 패턴을 !value || !other로 수정'
  },
  {
    name: 'Boolean OR with ??',
    pattern: /(\w+\s*===\s*[^?]+)\s*\?\?\s*(\w+\s*===\s*[^?]+)/g,
    replacement: '$1 || $2',
    description: 'condition1 ?? condition2를 condition1 || condition2로 수정'
  },
  {
    name: 'Range Check with ??',
    pattern: /(\w+\s*[<>]=?\s*\w+)\s*\?\?\s*(\w+\s*[<>]=?\s*\w+)/g,
    replacement: '$1 || $2',
    description: '범위 체크에서 ??를 ||로 수정'
  },
  {
    name: 'Null Check with ??',
    pattern: /([\w.]+\s*[!=]=\s*null)\s*\?\?\s*/g,
    replacement: '$1 || ',
    description: 'null 체크 후 ??를 ||로 수정'
  }
];

// 수정 가능한 파일 찾기
function findTSFiles() {
  try {
    const result = execSync('find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | head -100', { encoding: 'utf8' });
    return result.trim().split('\n').filter(f => f);
  } catch (error) {
    console.log('⚠️  파일 검색 중 오류:', error.message);
    return [];
  }
}

// 파일별 수정 적용
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let totalFixes = 0;
  
  fixPatterns.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      content = content.replace(pattern.pattern, pattern.replacement);
      const fixCount = matches.length;
      totalFixes += fixCount;
      if (fixCount > 0) {
        console.log(`  ✓ ${pattern.name}: ${fixCount}개 수정`);
      }
    }
  });
  
  if (totalFixes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return totalFixes;
}

// 메인 실행
async function main() {
  const files = findTSFiles();
  let totalFiles = 0;
  let totalFixes = 0;
  
  console.log(`📁 ${files.length}개 파일을 검사합니다...\n`);
  
  for (const file of files) {
    const fixes = fixFile(file);
    if (fixes > 0) {
      console.log(`🔧 ${file} (${fixes}개 수정)`);
      totalFiles++;
      totalFixes += fixes;
    }
  }
  
  console.log(`\n📊 결과:`);
  console.log(`  - 수정된 파일: ${totalFiles}개`);
  console.log(`  - 총 수정 사항: ${totalFixes}개`);
  
  if (totalFixes > 0) {
    console.log('\n🔍 TypeScript 컴파일 검증...');
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ 모든 수정이 성공적으로 완료되었습니다!');
      
      console.log('\n📝 변경사항을 Git에 추가하시겠습니까?');
      console.log('다음 명령어를 실행하세요:');
      console.log('  git add -A');
      console.log('  git commit -m "🤖 자동 수정: TypeScript 오류 해결"');
    } catch (error) {
      console.log('❌ TypeScript 오류가 남아있습니다. 수동 확인이 필요합니다.');
      process.exit(1);
    }
  } else {
    console.log('✨ 수정할 내용이 없습니다. 모든 것이 정상입니다!');
  }
}

main().catch(console.error);