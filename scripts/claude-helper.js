#!/usr/bin/env node

/**
 * Claude Code CLI 전용 Git 자동화 헬퍼
 * 모든 Git 작업을 자동으로 처리합니다.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 로그 함수
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  task: (msg) => console.log(`${colors.cyan}🔄 ${msg}${colors.reset}`)
};

// 명령어 실행 함수
function runCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit'
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: error.stdout ? error.stdout.toString() : ''
    };
  }
}

// ESLint 자동 수정
function autoFixLint() {
  log.task('ESLint 자동 수정 시작...');
  
  const result = runCommand('npm run lint -- --fix', { silent: true });
  
  if (result.success) {
    log.success('ESLint 자동 수정 완료!');
    return true;
  } else {
    // 수정 불가능한 오류만 남은 경우
    const lintResult = runCommand('npm run lint', { silent: true });
    if (!lintResult.success) {
      log.warning('일부 ESLint 오류를 자동으로 수정할 수 없습니다.');
      console.log(lintResult.output);
      return false;
    }
    return true;
  }
}

// TypeScript 체크
function checkTypes() {
  log.task('TypeScript 타입 체크 중...');
  
  const result = runCommand('npm run type-check', { silent: true });
  
  if (result.success) {
    log.success('TypeScript 타입 체크 통과!');
    return true;
  } else {
    log.error('TypeScript 타입 오류 발견:');
    console.log(result.output);
    return false;
  }
}

// 빌드 테스트
function testBuild() {
  log.task('빌드 테스트 중... (시간이 걸릴 수 있습니다)');
  
  const result = runCommand('npm run build', { silent: false });
  
  if (result.success) {
    log.success('빌드 테스트 성공!');
    return true;
  } else {
    log.error('빌드 실패!');
    return false;
  }
}

// Git 상태 확인
function checkGitStatus() {
  const result = runCommand('git status --porcelain', { silent: true });
  return result.output.trim().length > 0;
}

// 자동 커밋 메시지 생성
function generateCommitMessage() {
  log.task('커밋 메시지 자동 생성 중...');
  
  // 변경된 파일 목록 가져오기
  const diffResult = runCommand('git diff --name-only', { silent: true });
  const stagedResult = runCommand('git diff --cached --name-only', { silent: true });
  
  const changedFiles = [
    ...diffResult.output.split('\n').filter(f => f),
    ...stagedResult.output.split('\n').filter(f => f)
  ];
  
  if (changedFiles.length === 0) {
    return null;
  }
  
  // 변경 타입 추론
  let type = 'chore';
  let scope = '';
  let description = '코드 수정';
  
  // 파일 경로 분석으로 타입 결정
  if (changedFiles.some(f => f.includes('components/') || f.includes('app/'))) {
    if (changedFiles.some(f => f.includes('new') || f.includes('create'))) {
      type = 'feat';
      description = '새 기능 추가';
    } else if (changedFiles.some(f => f.includes('fix') || f.includes('bug'))) {
      type = 'fix';
      description = '버그 수정';
    } else {
      type = 'refactor';
      description = '코드 개선';
    }
  } else if (changedFiles.some(f => f.includes('docs/') || f.includes('.md'))) {
    type = 'docs';
    description = '문서 업데이트';
  } else if (changedFiles.some(f => f.includes('test') || f.includes('spec'))) {
    type = 'test';
    description = '테스트 추가/수정';
  } else if (changedFiles.some(f => f.includes('style') || f.includes('.css'))) {
    type = 'style';
    description = '스타일 수정';
  }
  
  // 주요 변경 파일 목록
  const mainFiles = changedFiles.slice(0, 3).map(f => `- ${f}`).join('\n');
  
  const message = `${type}: ${description}

변경된 파일:
${mainFiles}${changedFiles.length > 3 ? `\n... 외 ${changedFiles.length - 3}개 파일` : ''}

🤖 Generated with Claude Code CLI

Co-Authored-By: Claude <noreply@anthropic.com>`;
  
  return message;
}

// 자동 커밋
function autoCommit(message = null) {
  if (!checkGitStatus()) {
    log.info('커밋할 변경사항이 없습니다.');
    return true;
  }
  
  log.task('변경사항을 스테이징 중...');
  runCommand('git add .');
  
  const commitMessage = message || generateCommitMessage();
  
  if (!commitMessage) {
    log.error('커밋 메시지를 생성할 수 없습니다.');
    return false;
  }
  
  log.task('커밋 생성 중...');
  const result = runCommand(`git commit -m "${commitMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`, { silent: false });
  
  if (result.success) {
    log.success('커밋 생성 완료!');
    return true;
  } else {
    log.error('커밋 실패!');
    return false;
  }
}

// 안전한 푸시
function safePush() {
  log.task('원격 저장소로 푸시 중...');
  
  const result = runCommand('git push origin main', { silent: false });
  
  if (result.success) {
    log.success('푸시 완료! GitHub Actions가 자동으로 배포를 시작합니다.');
    log.info('Telegram으로 배포 상태를 확인하세요.');
    return true;
  } else {
    log.error('푸시 실패!');
    return false;
  }
}

// 통합 배포 함수
async function deploy() {
  console.log('\n' + colors.cyan + '═══════════════════════════════════════');
  console.log('   Claude Code Git 자동화 시작   ');
  console.log('═══════════════════════════════════════' + colors.reset + '\n');
  
  // 1. ESLint 자동 수정
  const lintFixed = autoFixLint();
  if (!lintFixed) {
    log.error('ESLint 오류를 수정해주세요.');
    process.exit(1);
  }
  
  // 2. TypeScript 체크
  const typesOk = checkTypes();
  if (!typesOk) {
    log.error('TypeScript 타입 오류를 수정해주세요.');
    process.exit(1);
  }
  
  // 3. 빌드 테스트 (선택적)
  if (process.argv.includes('--build')) {
    const buildOk = testBuild();
    if (!buildOk) {
      log.error('빌드 오류를 수정해주세요.');
      process.exit(1);
    }
  }
  
  // 4. 자동 커밋
  const committed = autoCommit();
  if (!committed) {
    log.error('커밋 생성에 실패했습니다.');
    process.exit(1);
  }
  
  // 5. 푸시
  const pushed = safePush();
  if (!pushed) {
    log.error('푸시에 실패했습니다.');
    process.exit(1);
  }
  
  console.log('\n' + colors.green + '═══════════════════════════════════════');
  console.log('   🎉 모든 작업이 완료되었습니다!   ');
  console.log('═══════════════════════════════════════' + colors.reset + '\n');
}

// 메인 함수
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'fix':
      autoFixLint();
      checkTypes();
      break;
      
    case 'commit':
      autoCommit();
      break;
      
    case 'deploy':
      await deploy();
      break;
      
    default:
      console.log(`
Claude Code Git 자동화 헬퍼

사용법:
  node scripts/claude-helper.js [명령어]

명령어:
  fix     - ESLint 자동 수정 & TypeScript 체크
  commit  - 자동 커밋 (메시지 자동 생성)
  deploy  - 전체 프로세스 실행 (수정 → 커밋 → 푸시)

옵션:
  --build - deploy 시 빌드 테스트 포함

예시:
  npm run claude:deploy
      `);
  }
}

// 실행
main().catch(error => {
  log.error(`예상치 못한 오류: ${error.message}`);
  process.exit(1);
});