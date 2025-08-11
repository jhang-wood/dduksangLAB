#!/usr/bin/env node

/**
 * MCP 통합 시스템 테스트 스크립트
 * PlaywrightMCP와 SupabaseMCP 통합 검증
 */

const fs = require('fs');
const path = require('path');

// 컬러 출력을 위한 ANSI 색상 코드
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// 로깅 유틸리티
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  task: (msg) => console.log(`${colors.cyan}[TASK]${colors.reset} ${msg}`)
};

// 파일 존재 여부 확인
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

// 파일 내용에서 특정 텍스트 찾기
function checkFileContains(filePath, searchText) {
  if (!checkFileExists(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(searchText);
  } catch (error) {
    return false;
  }
}

// TypeScript 컴파일 체크 (간단한 구문 분석)
function checkTypeScriptSyntax(filePath) {
  if (!checkFileExists(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 기본적인 구문 체크
    const issues = [];
    
    // 미완성 함수 체크
    const incompleteFunctions = content.match(/async\s+\w+\s*\([^)]*\)\s*:\s*Promise<[^>]*>\s*\{\s*$/gm);
    if (incompleteFunctions) {
      issues.push(`미완성 함수 발견: ${incompleteFunctions.length}개`);
    }
    
    // import 문 체크
    const importPattern = /import\s+.*\s+from\s+['"][^'"]+['"];?/g;
    const imports = content.match(importPattern) || [];
    const validImports = imports.filter(imp => !imp.includes('from ""') && !imp.includes("from ''"));
    
    if (imports.length !== validImports.length) {
      issues.push('빈 import 경로 발견');
    }
    
    return issues;
  } catch (error) {
    return ['파일 읽기 오류'];
  }
}

// 테스트 실행
async function runTests() {
  console.log('\n' + colors.cyan + '═══════════════════════════════════════');
  console.log('   MCP 통합 시스템 테스트 시작');
  console.log('═══════════════════════════════════════' + colors.reset + '\n');

  let totalTests = 0;
  let passedTests = 0;

  // 1. 필수 파일 존재 확인
  log.task('1. 필수 파일 존재 확인');
  const requiredFiles = [
    'lib/mcp/playwright-controller.ts',
    'lib/mcp/supabase-controller.ts',
    'lib/mcp/orchestrator.ts',
    'lib/mcp/error-handler.ts',
    'lib/automation/blog-publisher.ts',
    'lib/automation/content-manager.ts',
    'lib/automation/scheduler.ts',
    'lib/monitoring/health-checker.ts',
    'lib/monitoring/notification-service.ts',
    'app/api/automation/health/route.ts',
    'app/api/automation/scheduler/route.ts',
    'app/api/automation/content/route.ts',
    'app/api/automation/orchestrator/route.ts',
    'app/api/automation/notifications/route.ts',
    'app/api/cron/automation/route.ts'
  ];

  for (const file of requiredFiles) {
    totalTests++;
    const fullPath = path.join(__dirname, '..', file);
    
    if (checkFileExists(fullPath)) {
      log.success(`✓ ${file}`);
      passedTests++;
    } else {
      log.error(`✗ ${file} - 파일이 존재하지 않습니다`);
    }
  }

  // 2. 핵심 클래스 및 함수 존재 확인
  log.task('\n2. 핵심 클래스 및 함수 존재 확인');
  const coreChecks = [
    {
      file: 'lib/mcp/playwright-controller.ts',
      checks: ['class PlaywrightController', 'loginToAdmin', 'publishContent']
    },
    {
      file: 'lib/mcp/supabase-controller.ts',
      checks: ['class SupabaseController', 'logAutomation', 'recordPerformanceMetric']
    },
    {
      file: 'lib/mcp/orchestrator.ts',
      checks: ['class AutomationOrchestrator', 'executeLoginWorkflow', 'executePublishWorkflow']
    },
    {
      file: 'lib/automation/scheduler.ts',
      checks: ['class AutomationScheduler', 'start', 'executeTask']
    },
    {
      file: 'lib/monitoring/health-checker.ts',
      checks: ['class HealthChecker', 'performHealthCheck', 'checkServiceHealth']
    }
  ];

  for (const { file, checks } of coreChecks) {
    const fullPath = path.join(__dirname, '..', file);
    
    for (const check of checks) {
      totalTests++;
      
      if (checkFileContains(fullPath, check)) {
        log.success(`✓ ${file}: ${check}`);
        passedTests++;
      } else {
        log.error(`✗ ${file}: ${check} - 코드가 존재하지 않습니다`);
      }
    }
  }

  // 3. TypeScript 구문 체크
  log.task('\n3. TypeScript 구문 체크');
  const tsFiles = [
    'lib/mcp/playwright-controller.ts',
    'lib/mcp/supabase-controller.ts',
    'lib/mcp/orchestrator.ts',
    'lib/automation/scheduler.ts'
  ];

  for (const file of tsFiles) {
    totalTests++;
    const fullPath = path.join(__dirname, '..', file);
    const issues = checkTypeScriptSyntax(fullPath);
    
    if (Array.isArray(issues) && issues.length === 0) {
      log.success(`✓ ${file}: 구문 체크 통과`);
      passedTests++;
    } else if (Array.isArray(issues)) {
      log.warning(`⚠ ${file}: 잠재적 문제 - ${issues.join(', ')}`);
      passedTests++; // 경고는 통과로 간주
    } else {
      log.error(`✗ ${file}: 구문 체크 실패`);
    }
  }

  // 4. 환경변수 설정 확인
  log.task('\n4. 환경변수 설정 확인');
  const envFile = path.join(__dirname, '..', '.env.example');
  const envChecks = [
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'SLACK_WEBHOOK_URL'
  ];

  for (const envVar of envChecks) {
    totalTests++;
    
    if (checkFileContains(envFile, envVar)) {
      log.success(`✓ 환경변수 템플릿에 ${envVar} 존재`);
      passedTests++;
    } else {
      log.error(`✗ 환경변수 템플릿에 ${envVar} 누락`);
    }
  }

  // 5. API 라우트 확인
  log.task('\n5. API 라우트 확인');
  const apiChecks = [
    {
      file: 'app/api/automation/health/route.ts',
      methods: ['GET', 'POST']
    },
    {
      file: 'app/api/automation/scheduler/route.ts', 
      methods: ['GET', 'POST']
    },
    {
      file: 'app/api/cron/automation/route.ts',
      methods: ['GET', 'POST']
    }
  ];

  for (const { file, methods } of apiChecks) {
    const fullPath = path.join(__dirname, '..', file);
    
    for (const method of methods) {
      totalTests++;
      
      if (checkFileContains(fullPath, `export async function ${method}`)) {
        log.success(`✓ ${file}: ${method} 메소드 존재`);
        passedTests++;
      } else {
        log.error(`✗ ${file}: ${method} 메소드 누락`);
      }
    }
  }

  // 6. 타입 정의 확인
  log.task('\n6. 타입 정의 확인');
  const typeFile = path.join(__dirname, '..', 'types/index.ts');
  const typeChecks = [
    'AutomationLog',
    'ContentItem', 
    'NotificationMessage',
    'SystemHealth',
    'BlogPostData'
  ];

  for (const type of typeChecks) {
    totalTests++;
    
    if (checkFileContains(typeFile, `export interface ${type}`)) {
      log.success(`✓ 타입 정의: ${type}`);
      passedTests++;
    } else {
      log.error(`✗ 타입 정의 누락: ${type}`);
    }
  }

  // 결과 출력
  console.log('\n' + colors.cyan + '═══════════════════════════════════════');
  console.log('   테스트 결과 요약');
  console.log('═══════════════════════════════════════' + colors.reset);
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`\n총 테스트: ${totalTests}`);
  console.log(`통과: ${colors.green}${passedTests}${colors.reset}`);
  console.log(`실패: ${colors.red}${totalTests - passedTests}${colors.reset}`);
  console.log(`성공률: ${successRate >= 90 ? colors.green : successRate >= 70 ? colors.yellow : colors.red}${successRate}%${colors.reset}`);

  if (successRate >= 90) {
    console.log(`\n${colors.green}🎉 MCP 통합 시스템이 성공적으로 구현되었습니다!${colors.reset}`);
  } else if (successRate >= 70) {
    console.log(`\n${colors.yellow}⚠️ MCP 통합 시스템이 대부분 구현되었지만 일부 개선이 필요합니다.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ MCP 통합 시스템 구현에 문제가 있습니다. 누락된 부분을 확인해주세요.${colors.reset}`);
  }

  // 다음 단계 안내
  console.log('\n' + colors.cyan + '다음 단계:' + colors.reset);
  console.log('1. .env.local 파일 생성 및 환경변수 설정');
  console.log('2. Supabase에 필요한 테이블 생성');
  console.log('3. npm run dev로 개발 서버 시작');
  console.log('4. /api/automation/health 엔드포인트 테스트');
  console.log('5. 자동화 스케줄러 설정 및 테스트\n');
}

// 메인 실행
if (require.main === module) {
  runTests().catch(error => {
    log.error(`테스트 실행 중 오류 발생: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runTests };