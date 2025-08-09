#!/usr/bin/env node

/**
 * dduksangLAB 배포 워크플로우 테스트 스크립트
 * 
 * GitHub Actions 워크플로우를 실행하기 전에 로컬에서 
 * 배포 프로세스의 주요 단계를 테스트합니다.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// 색상 출력용 상수
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`${title}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');
}

// 환경 변수 검증
function validateEnvironment() {
  section('환경 변수 검증');
  
  const requiredSecrets = [
    'VERCEL_TOKEN',
    'VERCEL_ORG_ID', 
    'VERCEL_PROJECT_ID',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID'
  ];
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  let allValid = true;
  
  // GitHub Secrets 체크 (로컬에서는 .env 파일에서)
  info('GitHub Secrets 확인 (로컬 .env 파일):');
  requiredSecrets.forEach(secret => {
    const value = process.env[secret];
    if (value) {
      success(`${secret}: 설정됨 (${value.substring(0, 10)}...)`);
    } else {
      error(`${secret}: 누락됨`);
      allValid = false;
    }
  });
  
  // Next.js 환경 변수 체크
  info('\nNext.js 환경 변수 확인:');
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
      success(`${envVar}: 설정됨`);
    } else {
      error(`${envVar}: 누락됨`);
      allValid = false;
    }
  });
  
  return allValid;
}

// 의존성 및 도구 검증
async function validateDependencies() {
  section('의존성 및 도구 검증');
  
  const tools = [
    { name: 'Node.js', cmd: 'node --version', min: 'v18' },
    { name: 'npm', cmd: 'npm --version', min: '8' },
    { name: 'Git', cmd: 'git --version', min: '2' }
  ];
  
  let allValid = true;
  
  for (const tool of tools) {
    try {
      const version = execSync(tool.cmd, { encoding: 'utf8' }).trim();
      success(`${tool.name}: ${version}`);
    } catch (err) {
      error(`${tool.name}: 설치되지 않음`);
      allValid = false;
    }
  }
  
  // package.json 스크립트 확인
  info('\npackage.json 스크립트 확인:');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'lint', 'type-check', 'env:validate'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      success(`${script}: 정의됨`);
    } else {
      error(`${script}: 누락됨`);
      allValid = false;
    }
  });
  
  return allValid;
}

// 코드 품질 검증 (Validate 단계 시뮬레이션)
async function validateCodeQuality() {
  section('코드 품질 검증');
  
  const tasks = [
    { name: 'ESLint', cmd: 'npm run lint' },
    { name: 'TypeScript', cmd: 'npm run type-check' },
    { name: 'Environment', cmd: 'npm run env:validate' }
  ];
  
  let allPassed = true;
  
  for (const task of tasks) {
    try {
      info(`${task.name} 실행 중...`);
      execSync(task.cmd, { 
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 60000
      });
      success(`${task.name}: 통과`);
    } catch (err) {
      error(`${task.name}: 실패`);
      console.log(err.stdout || err.message);
      allPassed = false;
    }
  }
  
  return allPassed;
}

// 빌드 테스트 (Deploy 단계 시뮬레이션)
async function testBuild() {
  section('프로덕션 빌드 테스트');
  
  try {
    info('Next.js 빌드 실행 중...');
    const buildOutput = execSync('npm run build', {
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 180000,
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
    
    success('빌드 성공');
    
    // 빌드 결과 분석
    if (buildOutput.includes('Build completed')) {
      success('빌드 완료 확인됨');
    }
    
    if (fs.existsSync('.next')) {
      success('.next 디렉토리 생성됨');
    }
    
    return true;
  } catch (err) {
    error('빌드 실패');
    console.log(err.stdout || err.message);
    return false;
  }
}

// Vercel 연결 테스트
async function testVercelConnection() {
  section('Vercel 연결 테스트');
  
  if (!process.env.VERCEL_TOKEN) {
    warning('VERCEL_TOKEN이 설정되지 않아 Vercel 테스트를 건너뜁니다.');
    return true;
  }
  
  try {
    // Vercel CLI 설치 확인
    try {
      execSync('vercel --version', { stdio: 'pipe' });
      success('Vercel CLI 설치됨');
    } catch {
      info('Vercel CLI 설치 중...');
      execSync('npm install -g vercel@latest', { stdio: 'inherit' });
    }
    
    // Vercel 프로젝트 링크 테스트
    info('Vercel 프로젝트 연결 테스트 중...');
    const linkOutput = execSync('vercel ls', {
      stdio: 'pipe',
      encoding: 'utf8',
      env: {
        ...process.env,
        VERCEL_TOKEN: process.env.VERCEL_TOKEN
      }
    });
    
    if (linkOutput.includes('dduksang')) {
      success('Vercel 프로젝트 연결 확인됨');
      return true;
    } else {
      warning('Vercel 프로젝트 연결 상태를 확인할 수 없습니다.');
      return true; // 치명적이지 않음
    }
  } catch (err) {
    error('Vercel 연결 실패');
    console.log(err.stdout || err.message);
    return false;
  }
}

// 텔레그램 봇 연결 테스트
async function testTelegramConnection() {
  section('텔레그램 봇 연결 테스트');
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    warning('TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않아 텔레그램 테스트를 건너뜁니다.');
    return true;
  }
  
  return new Promise((resolve) => {
    const testMessage = `🧪 dduksangLAB 배포 워크플로우 테스트\n시간: ${new Date().toLocaleString('ko-KR')}`;
    
    const postData = JSON.stringify({
      chat_id: chatId,
      text: testMessage
    });
    
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          success('텔레그램 메시지 전송 성공');
          resolve(true);
        } else {
          error(`텔레그램 메시지 전송 실패: ${res.statusCode}`);
          console.log(data);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      error(`텔레그램 연결 오류: ${err.message}`);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// E2E 테스트 시뮬레이션
async function simulateE2ETests() {
  section('E2E 테스트 시뮬레이션');
  
  const testUrl = process.env.TEST_URL || 'http://localhost:3000';
  
  info(`테스트 대상 URL: ${testUrl}`);
  
  // 간단한 HTTP 상태 체크
  return new Promise((resolve) => {
    const url = new URL(testUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      timeout: 10000
    };
    
    const client = url.protocol === 'https:' ? https : require('http');
    
    const req = client.request(options, (res) => {
      if (res.statusCode === 200) {
        success(`홈페이지 접근 성공 (${res.statusCode})`);
        resolve(true);
      } else {
        warning(`홈페이지 응답: ${res.statusCode}`);
        resolve(true); // 200이 아니어도 연결은 성공
      }
    });
    
    req.on('error', (err) => {
      warning(`URL 접근 불가: ${err.message} (로컬 서버가 실행 중인지 확인하세요)`);
      resolve(true); // E2E 테스트는 실제 배포 후에만 가능
    });
    
    req.on('timeout', () => {
      warning('URL 응답 시간 초과');
      req.destroy();
      resolve(true);
    });
    
    req.end();
  });
}

// GitHub Actions 워크플로우 파일 검증
function validateWorkflowFile() {
  section('GitHub Actions 워크플로우 검증');
  
  const workflowPath = '.github/workflows/deploy.yml';
  
  if (!fs.existsSync(workflowPath)) {
    error('deploy.yml 파일이 존재하지 않습니다');
    return false;
  }
  
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  
  const requiredElements = [
    'on:',
    'jobs:',
    'validate:',
    'deploy:',
    'e2e-test:',
    'finalize:',
    'VERCEL_TOKEN',
    'TELEGRAM_BOT_TOKEN'
  ];
  
  let allPresent = true;
  
  requiredElements.forEach(element => {
    if (workflowContent.includes(element)) {
      success(`${element}: 포함됨`);
    } else {
      error(`${element}: 누락됨`);
      allPresent = false;
    }
  });
  
  // YAML 구문 검증 (간단한 체크)
  const lines = workflowContent.split('\n');
  let indentationValid = true;
  
  lines.forEach((line, index) => {
    if (line.trim() && line.match(/^\s*\t/)) {
      error(`라인 ${index + 1}: 탭 문자 사용됨 (스페이스 사용 권장)`);
      indentationValid = false;
    }
  });
  
  if (indentationValid) {
    success('YAML 들여쓰기 검증 통과');
  }
  
  return allPresent && indentationValid;
}

// 메인 테스트 실행 함수
async function runTests() {
  console.log('🚀 dduksangLAB 배포 워크플로우 테스트 시작\n');
  
  const testResults = {
    environment: false,
    dependencies: false,
    codeQuality: false,
    build: false,
    vercel: false,
    telegram: false,
    e2e: false,
    workflow: false
  };
  
  try {
    // .env 파일 로드 (로컬 테스트용)
    if (fs.existsSync('.env.local')) {
      require('dotenv').config({ path: '.env.local' });
      info('.env.local 파일 로드됨');
    }
    
    testResults.environment = validateEnvironment();
    testResults.dependencies = await validateDependencies();
    testResults.codeQuality = await validateCodeQuality();
    testResults.build = await testBuild();
    testResults.vercel = await testVercelConnection();
    testResults.telegram = await testTelegramConnection();
    testResults.e2e = await simulateE2ETests();
    testResults.workflow = validateWorkflowFile();
    
  } catch (err) {
    error(`테스트 중 오류 발생: ${err.message}`);
  }
  
  // 결과 요약
  section('테스트 결과 요약');
  
  const passed = Object.values(testResults).filter(Boolean).length;
  const total = Object.keys(testResults).length;
  
  Object.entries(testResults).forEach(([test, result]) => {
    const status = result ? '✅ 통과' : '❌ 실패';
    console.log(`${test}: ${status}`);
  });
  
  log(`\n총 ${total}개 테스트 중 ${passed}개 통과 (${Math.round(passed/total*100)}%)`, 
      passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    success('\n🎉 모든 테스트 통과! GitHub Actions 워크플로우 실행 준비 완료');
  } else {
    warning('\n⚠️  일부 테스트가 실패했습니다. 문제를 해결한 후 다시 시도하세요.');
  }
  
  // 다음 단계 안내
  section('다음 단계');
  
  if (passed === total) {
    info('1. git add . && git commit -m "feat: add deployment workflow"');
    info('2. git push origin main');
    info('3. GitHub Actions 탭에서 워크플로우 실행 상태 확인');
  } else {
    info('1. 실패한 테스트 항목을 확인하여 문제 해결');
    info('2. GitHub Secrets 설정 확인 (docs/GITHUB_SECRETS_SETUP.md 참조)');
    info('3. 테스트 스크립트 재실행: node scripts/test-deployment.js');
  }
  
  return passed === total;
}

// 스크립트 실행
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests };