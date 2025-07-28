#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 서버 전용 환경 변수들 (클라이언트에 노출되면 안 됨)
const SERVER_ONLY_VARS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'TOSS_SECRET_KEY',
  'PAYAPP_SECRET_KEY',
  'PAYAPP_VALUE',
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'CRON_SECRET',
  'DATABASE_URL',
  'SMTP_PASS',
  'AWS_SECRET_ACCESS_KEY',
  'PRIVATE_KEY'
];

// 파일에서 환경 변수 사용 검사
function checkFileForEnvUsage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // 클라이언트 사이드 파일인지 확인
    const isClientSide = content.includes("'use client'") || 
                        filePath.includes('/components/') ||
                        filePath.includes('/hooks/') ||
                        (filePath.includes('/app/') && !filePath.includes('/api/'));
    
    if (isClientSide) {
      // 클라이언트 사이드에서 서버 전용 변수 사용 확인
      for (const varName of SERVER_ONLY_VARS) {
        const patterns = [
          new RegExp(`process\\.env\\.${varName}`, 'g'),
          new RegExp(`getEnvVar\\(['"]${varName}['"]\\)`, 'g'),
          new RegExp(`env\\.${varName.toLowerCase().replace(/_/g, '')}`, 'g')
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            issues.push({
              file: filePath,
              issue: `Server-only variable ${varName} used in client-side code`,
              severity: 'HIGH'
            });
          }
        }
      }
    }
    
    // NEXT_PUBLIC_ 변수에 민감한 데이터가 있는지 확인
    const publicVarMatches = content.match(/NEXT_PUBLIC_[A-Z_]+/g);
    if (publicVarMatches) {
      for (const match of publicVarMatches) {
        for (const serverVar of SERVER_ONLY_VARS) {
          if (match.includes(serverVar.replace(/_/g, ''))) {
            issues.push({
              file: filePath,
              issue: `Potentially sensitive data in public variable: ${match}`,
              severity: 'MEDIUM'
            });
          }
        }
      }
    }
    
    return issues;
  } catch (error) {
    return [];
  }
}

// 디렉토리 재귀 스캔
function scanDirectory(dir, issues = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // node_modules, .git, .next 등 스킵
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(file)) {
        scanDirectory(fullPath, issues);
      }
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      const fileIssues = checkFileForEnvUsage(fullPath);
      issues.push(...fileIssues);
    }
  }
  
  return issues;
}

// 환경 변수 파일 검사
function checkEnvFiles() {
  const issues = [];
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      
      // NEXT_PUBLIC_로 시작하는 서버 전용 변수 확인
      for (const serverVar of SERVER_ONLY_VARS) {
        const publicVarPattern = new RegExp(`NEXT_PUBLIC_.*${serverVar}`, 'i');
        if (publicVarPattern.test(content)) {
          issues.push({
            file: envFile,
            issue: `Server-only variable exposed as public: NEXT_PUBLIC_*${serverVar}`,
            severity: 'CRITICAL'
          });
        }
      }
    }
  }
  
  return issues;
}

// 메인 실행
console.log('🔍 환경 변수 보안 검증을 시작합니다...\n');

const projectRoot = process.cwd();
const codeIssues = scanDirectory(projectRoot);
const envIssues = checkEnvFiles();
const allIssues = [...codeIssues, ...envIssues];

// 결과 출력
if (allIssues.length === 0) {
  console.log('✅ 환경 변수 보안 검증 완료: 문제가 발견되지 않았습니다!');
} else {
  console.log(`❌ ${allIssues.length}개의 보안 문제가 발견되었습니다:\n`);
  
  const critical = allIssues.filter(issue => issue.severity === 'CRITICAL');
  const high = allIssues.filter(issue => issue.severity === 'HIGH');
  const medium = allIssues.filter(issue => issue.severity === 'MEDIUM');
  
  if (critical.length > 0) {
    console.log('🚨 CRITICAL 문제:');
    critical.forEach(issue => {
      console.log(`  ${issue.file}: ${issue.issue}`);
    });
    console.log('');
  }
  
  if (high.length > 0) {
    console.log('⚠️  HIGH 문제:');
    high.forEach(issue => {
      console.log(`  ${issue.file}: ${issue.issue}`);
    });
    console.log('');
  }
  
  if (medium.length > 0) {
    console.log('⚡ MEDIUM 문제:');
    medium.forEach(issue => {
      console.log(`  ${issue.file}: ${issue.issue}`);
    });
    console.log('');
  }
  
  console.log('📋 수정 권장사항:');
  console.log('1. 클라이언트 사이드에서는 NEXT_PUBLIC_ 변수만 사용하세요');
  console.log('2. 서버 전용 변수는 API 라우트에서만 사용하세요');
  console.log('3. 민감한 데이터는 절대 NEXT_PUBLIC_로 시작하지 마세요');
  console.log('4. clientEnv, serverEnv 객체를 사용해 명확히 구분하세요');
  
  process.exit(1);
}

console.log('\n💡 추가 권장사항:');
console.log('- 정기적으로 이 스크립트를 실행하여 보안을 확인하세요');
console.log('- CI/CD 파이프라인에 이 검증을 포함하세요');
console.log('- 환경 변수 분리를 위해 .env.client, .env.server 파일을 활용하세요');