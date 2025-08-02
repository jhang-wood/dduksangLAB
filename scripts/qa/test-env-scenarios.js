#!/usr/bin/env node
/**
 * 환경변수 테스트 시나리오 실행 스크립트
 * QA Engineer용 환경변수 검증 자동화
 */

const fs = require('fs');
const path = require('path');

// 색상 출력을 위한 헬퍼
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 테스트 시나리오 정의
const testScenarios = {
  // 필수 환경변수 검증
  requiredVariables: {
    client: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'NEXT_PUBLIC_TOSS_CLIENT_KEY'
    ],
    server: [
      'SUPABASE_SERVICE_ROLE_KEY',
      'TOSS_SECRET_KEY',
      'GEMINI_API_KEY',
      'CRON_SECRET'
    ]
  },

  // 보안 검증 시나리오
  securityTests: [
    {
      name: 'NEXT_PUBLIC_ 접두사 규칙',
      test: () => {
        const publicVars = Object.keys(process.env).filter(key => 
          key.startsWith('NEXT_PUBLIC_')
        );
        return {
          passed: publicVars.length > 0,
          details: `발견된 public 변수: ${publicVars.length}개`
        };
      }
    },
    {
      name: '서버 전용 키 보호',
      test: () => {
        const serverSecrets = ['SUPABASE_SERVICE_ROLE_KEY', 'TOSS_SECRET_KEY', 'GEMINI_API_KEY'];
        const exposed = serverSecrets.filter(secret => 
          typeof window !== 'undefined' && window.process?.env?.[secret]
        );
        return {
          passed: exposed.length === 0,
          details: exposed.length > 0 ? `노출된 서버 키: ${exposed.join(', ')}` : '모든 서버 키 안전'
        };
      }
    },
    {
      name: 'URL 형식 검증',
      test: () => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const isValidUrl = supabaseUrl && /^https?:\/\/.+/.test(supabaseUrl);
        return {
          passed: isValidUrl,
          details: isValidUrl ? 'Supabase URL 형식 올바름' : 'Supabase URL 형식 오류'
        };
      }
    }
  ],

  // 환경별 설정 검증
  environmentTests: [
    {
      name: '개발 환경 설정',
      test: () => {
        const isDev = process.env.NODE_ENV === 'development';
        return {
          passed: true, // 항상 통과 (정보성)
          details: `현재 환경: ${process.env.NODE_ENV}`
        };
      }
    },
    {
      name: '프로덕션 준비도',
      test: () => {
        const hasAllRequired = [
          'NEXT_PUBLIC_SUPABASE_URL',
          'SUPABASE_SERVICE_ROLE_KEY',
          'NEXT_PUBLIC_TOSS_CLIENT_KEY',
          'TOSS_SECRET_KEY'
        ].every(key => process.env[key]);
        
        return {
          passed: hasAllRequired,
          details: hasAllRequired ? '프로덕션 필수 환경변수 완료' : '일부 프로덕션 환경변수 누락'
        };
      }
    }
  ]
};

// 환경변수 로드 시도
function loadEnvironmentVariables() {
  log('blue', '🔄 환경변수 로드 중...');
  
  try {
    // .env.local 파일 확인
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      log('green', '✅ .env.local 파일 발견');
      
      // 간단한 .env 파일 파싱 (실제로는 dotenv 사용 권장)
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      let count = 0;
      
      lines.forEach(line => {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
          count++;
        }
      });
      
      log('cyan', `📝 ${count}개 환경변수 로드됨`);
    } else {
      log('yellow', '⚠️  .env.local 파일 없음 - 시스템 환경변수만 사용');
    }
  } catch (error) {
    log('red', `❌ 환경변수 로드 실패: ${error.message}`);
  }
}

// 필수 환경변수 검증
function testRequiredVariables() {
  log('blue', '\n🧪 필수 환경변수 검증 시작...');
  
  let passed = 0;
  let failed = 0;
  
  // 클라이언트 변수 검증
  log('cyan', '\n📱 클라이언트 환경변수:');
  testScenarios.requiredVariables.client.forEach(varName => {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      log('green', `  ✅ ${varName}: 설정됨`);
      passed++;
    } else {
      log('red', `  ❌ ${varName}: 누락`);
      failed++;
    }
  });
  
  // 서버 변수 검증  
  log('cyan', '\n🖥️  서버 환경변수:');
  testScenarios.requiredVariables.server.forEach(varName => {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      log('green', `  ✅ ${varName}: 설정됨`);
      passed++;
    } else {
      log('red', `  ❌ ${varName}: 누락`);
      failed++;
    }
  });
  
  return { passed, failed };
}

// 보안 검증 테스트
function runSecurityTests() {
  log('blue', '\n🔒 보안 검증 테스트...');
  
  let passed = 0;
  let failed = 0;
  
  testScenarios.securityTests.forEach(scenario => {
    try {
      const result = scenario.test();
      if (result.passed) {
        log('green', `  ✅ ${scenario.name}: ${result.details}`);
        passed++;
      } else {
        log('red', `  ❌ ${scenario.name}: ${result.details}`);
        failed++;
      }
    } catch (error) {
      log('red', `  ❌ ${scenario.name}: 테스트 실행 오류 - ${error.message}`);
      failed++;
    }
  });
  
  return { passed, failed };
}

// 환경별 설정 테스트
function runEnvironmentTests() {
  log('blue', '\n🌍 환경별 설정 검증...');
  
  let passed = 0;
  let failed = 0;
  
  testScenarios.environmentTests.forEach(scenario => {
    try {
      const result = scenario.test();
      if (result.passed) {
        log('green', `  ✅ ${scenario.name}: ${result.details}`);
        passed++;
      } else {
        log('yellow', `  ⚠️  ${scenario.name}: ${result.details}`);
        // 환경 테스트는 경고로 처리
      }
    } catch (error) {
      log('red', `  ❌ ${scenario.name}: 테스트 실행 오류 - ${error.message}`);
      failed++;
    }
  });
  
  return { passed, failed };
}

// 환경변수 사용 패턴 분석
function analyzeUsagePatterns() {
  log('blue', '\n📊 환경변수 사용 패턴 분석...');
  
  const patterns = {
    directAccess: 0,
    libEnvUsage: 0,
    processEnvUsage: 0
  };
  
  try {
    // lib/env.ts 파일 확인
    const libEnvPath = path.join(process.cwd(), 'lib', 'env.ts');
    if (fs.existsSync(libEnvPath)) {
      log('green', '  ✅ lib/env.ts 타입 안전 환경변수 시스템 발견');
      patterns.libEnvUsage++;
    }
    
    // 코드베이스에서 process.env 직접 사용 검색
    const { execSync } = require('child_process');
    try {
      const grepResult = execSync(
        'grep -r "process\\.env\\." --include="*.tsx" --include="*.ts" . --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null || true',
        { encoding: 'utf8', cwd: process.cwd() }
      );
      
      const matches = grepResult.split('\n').filter(line => line.trim());
      patterns.processEnvUsage = matches.length;
      
      if (matches.length > 0) {
        log('yellow', `  ⚠️  process.env 직접 사용: ${matches.length}개 위치`);
        log('cyan', '     → lib/env.ts 사용 권장');
      } else {
        log('green', '  ✅ process.env 직접 사용 없음');
      }
    } catch (error) {
      log('yellow', '  ⚠️  코드 분석 스킵 (grep 명령 실행 실패)');
    }
    
  } catch (error) {
    log('red', `  ❌ 패턴 분석 실패: ${error.message}`);
  }
  
  return patterns;
}

// 메인 실행 함수
function main() {
  log('magenta', '🚀 dduksangLAB 환경변수 테스트 시나리오 실행');
  log('magenta', '================================================');
  
  // 환경변수 로드
  loadEnvironmentVariables();
  
  // 테스트 실행
  const requiredResults = testRequiredVariables();
  const securityResults = runSecurityTests();
  const environmentResults = runEnvironmentTests();
  const usagePatterns = analyzeUsagePatterns();
  
  // 결과 요약
  log('blue', '\n📋 테스트 결과 요약');
  log('blue', '==================');
  
  const totalPassed = requiredResults.passed + securityResults.passed + environmentResults.passed;
  const totalFailed = requiredResults.failed + securityResults.failed + environmentResults.failed;
  const totalTests = totalPassed + totalFailed;
  
  log('cyan', `총 테스트: ${totalTests}개`);
  log('green', `통과: ${totalPassed}개`);
  log('red', `실패: ${totalFailed}개`);
  
  const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
  log('magenta', `성공률: ${successRate}%`);
  
  // 권장사항
  log('blue', '\n💡 권장사항:');
  if (requiredResults.failed > 0) {
    log('yellow', '  • 누락된 필수 환경변수를 .env.local에 추가하세요');
  }
  if (securityResults.failed > 0) {
    log('yellow', '  • 보안 이슈를 해결하세요');
  }
  if (usagePatterns.processEnvUsage > 10) {
    log('yellow', '  • process.env 직접 사용을 lib/env.ts로 마이그레이션하세요');
  }
  
  // 종료 코드 설정
  process.exit(totalFailed > 0 ? 1 : 0);
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = {
  testScenarios,
  loadEnvironmentVariables,
  testRequiredVariables,
  runSecurityTests,
  runEnvironmentTests,
  analyzeUsagePatterns
};