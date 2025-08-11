#!/usr/bin/env node

/**
 * Claude Code CLI 전용 Git 자동화 헬퍼 v2
 * 개선사항: 브랜치 자동 감지, 스마트 빌드 테스트, 롤백 메커니즘
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// 로그 함수
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  task: (msg) => console.log(`${colors.cyan}🔄 ${msg}${colors.reset}`),
  rollback: (msg) => console.log(`${colors.magenta}⏪ ${msg}${colors.reset}`)
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

// 현재 브랜치 가져오기
function getCurrentBranch() {
  const result = runCommand('git branch --show-current', { silent: true });
  return result.success ? result.output.trim() : 'main';
}

// 변경된 파일 분석
function analyzeChanges() {
  const diffResult = runCommand('git diff --name-only', { silent: true });
  const stagedResult = runCommand('git diff --cached --name-only', { silent: true });
  
  const changedFiles = [
    ...diffResult.output.split('\n').filter(f => f),
    ...stagedResult.output.split('\n').filter(f => f)
  ];
  
  // 중요 파일 변경 감지
  const hasImportantChanges = changedFiles.some(f => 
    f.includes('package.json') ||
    f.includes('tsconfig.json') ||
    f.includes('next.config') ||
    f.includes('.env') ||
    f.includes('middleware') ||
    f.includes('api/')
  );
  
  // 구조적 변경 감지
  const hasStructuralChanges = changedFiles.some(f =>
    f.includes('app/') && (f.includes('.tsx') || f.includes('.ts')) ||
    f.includes('components/') && (f.includes('.tsx') || f.includes('.ts'))
  );
  
  return {
    files: changedFiles,
    hasImportantChanges,
    hasStructuralChanges,
    requiresBuild: hasImportantChanges || hasStructuralChanges
  };
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

// 스마트 빌드 테스트
function smartBuildTest(changes) {
  if (changes.requiresBuild) {
    log.task('중요 변경사항 감지 - 빌드 테스트 시작...');
    log.info(`변경된 중요 파일: ${changes.files.filter(f => 
      f.includes('package.json') || f.includes('tsconfig') || f.includes('next.config')
    ).join(', ')}`);
    
    const result = runCommand('npm run build', { silent: false });
    
    if (result.success) {
      log.success('빌드 테스트 성공!');
      return true;
    } else {
      log.error('빌드 실패!');
      return false;
    }
  } else {
    log.info('빌드 테스트 건너뜀 (중요 변경사항 없음)');
    return true;
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
  
  const changes = analyzeChanges();
  
  if (changes.files.length === 0) {
    return null;
  }
  
  // 변경 타입 추론
  let type = 'chore';
  let scope = '';
  let description = '코드 수정';
  
  // 파일 경로 분석으로 타입 결정
  if (changes.files.some(f => f.includes('components/') || f.includes('app/'))) {
    if (changes.files.some(f => f.includes('new') || f.includes('create'))) {
      type = 'feat';
      description = '새 기능 추가';
    } else if (changes.files.some(f => f.includes('fix') || f.includes('bug'))) {
      type = 'fix';
      description = '버그 수정';
    } else {
      type = 'refactor';
      description = '코드 개선';
    }
  } else if (changes.files.some(f => f.includes('docs/') || f.includes('.md'))) {
    type = 'docs';
    description = '문서 업데이트';
  } else if (changes.files.some(f => f.includes('test') || f.includes('spec'))) {
    type = 'test';
    description = '테스트 추가/수정';
  } else if (changes.files.some(f => f.includes('style') || f.includes('.css'))) {
    type = 'style';
    description = '스타일 수정';
  } else if (changes.files.some(f => f.includes('.github/workflows'))) {
    type = 'ci';
    description = 'CI/CD 워크플로우 개선';
  } else if (changes.files.some(f => f.includes('scripts/'))) {
    type = 'build';
    description = '빌드 스크립트 개선';
  }
  
  // 주요 변경 파일 목록
  const mainFiles = changes.files.slice(0, 3).map(f => `- ${f}`).join('\n');
  
  const message = `${type}: ${description}

변경된 파일:
${mainFiles}${changes.files.length > 3 ? `\n... 외 ${changes.files.length - 3}개 파일` : ''}

🤖 Generated with Claude Code CLI v2

Co-Authored-By: Claude <noreply@anthropic.com>`;
  
  return message;
}

// 커밋 해시 저장 (롤백용)
function saveCommitHash() {
  const result = runCommand('git rev-parse HEAD', { silent: true });
  if (result.success) {
    const hash = result.output.trim();
    fs.writeFileSync('.last-deploy-commit', hash);
    return hash;
  }
  return null;
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
    saveCommitHash();
    return true;
  } else {
    log.error('커밋 실패!');
    return false;
  }
}

// 안전한 푸시
function safePush() {
  const branch = getCurrentBranch();
  log.task(`원격 저장소로 푸시 중 (브랜치: ${branch})...`);
  
  const result = runCommand(`git push origin ${branch}`, { silent: false });
  
  if (result.success) {
    log.success('푸시 완료! GitHub Actions가 자동으로 배포를 시작합니다.');
    log.info('Telegram으로 배포 상태를 확인하세요.');
    return true;
  } else {
    log.error('푸시 실패!');
    return false;
  }
}

// 롤백 기능
function rollback() {
  log.rollback('이전 커밋으로 롤백 시작...');
  
  if (fs.existsSync('.last-deploy-commit')) {
    const lastCommit = fs.readFileSync('.last-deploy-commit', 'utf8').trim();
    log.info(`롤백 대상 커밋: ${lastCommit}`);
    
    const result = runCommand(`git reset --hard ${lastCommit}`, { silent: false });
    
    if (result.success) {
      log.success('로컬 롤백 완료!');
      
      const branch = getCurrentBranch();
      log.task('원격 저장소에 강제 푸시...');
      const pushResult = runCommand(`git push origin ${branch} --force-with-lease`, { silent: false });
      
      if (pushResult.success) {
        log.success('롤백 완료!');
        return true;
      }
    }
  } else {
    log.error('롤백할 커밋 정보가 없습니다.');
  }
  return false;
}

// 배포 상태 확인
function checkDeploymentStatus() {
  log.task('배포 상태 확인 중...');
  
  // GitHub Actions 상태 확인 (gh CLI 필요)
  const result = runCommand('gh run list --limit 1 --json conclusion,status', { silent: true });
  
  if (result.success) {
    try {
      const status = JSON.parse(result.output)[0];
      if (status.conclusion === 'failure') {
        log.error('배포 실패 감지!');
        return false;
      } else if (status.status === 'in_progress') {
        log.info('배포 진행 중...');
      } else if (status.conclusion === 'success') {
        log.success('배포 성공!');
        return true;
      }
    } catch (e) {
      log.warning('배포 상태를 확인할 수 없습니다.');
    }
  }
  return true;
}

// 통합 배포 함수
async function deploy() {
  console.log('\n' + colors.cyan + '═══════════════════════════════════════');
  console.log('   Claude Code Git 자동화 v2 시작   ');
  console.log('═══════════════════════════════════════' + colors.reset + '\n');
  
  // 현재 브랜치 확인
  const branch = getCurrentBranch();
  log.info(`현재 브랜치: ${branch}`);
  
  // 변경사항 분석
  const changes = analyzeChanges();
  log.info(`변경된 파일: ${changes.files.length}개`);
  
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
  
  // 3. 스마트 빌드 테스트
  const buildOk = smartBuildTest(changes);
  if (!buildOk) {
    log.error('빌드 오류를 수정해주세요.');
    process.exit(1);
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
  
  // 6. 배포 상태 모니터링 (선택적)
  if (process.argv.includes('--monitor')) {
    setTimeout(() => {
      const deployOk = checkDeploymentStatus();
      if (!deployOk) {
        log.warning('배포 실패! 롤백을 시작하시겠습니까? (--rollback 옵션 사용)');
      }
    }, 30000); // 30초 후 확인
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
      
    case 'rollback':
      rollback();
      break;
      
    case 'status':
      checkDeploymentStatus();
      break;
      
    default:
      console.log(`
Claude Code Git 자동화 헬퍼 v2

사용법:
  node scripts/claude-helper-v2.js [명령어]

명령어:
  fix      - ESLint 자동 수정 & TypeScript 체크
  commit   - 자동 커밋 (메시지 자동 생성)
  deploy   - 전체 프로세스 실행 (수정 → 체크 → 빌드 → 커밋 → 푸시)
  rollback - 이전 배포로 롤백
  status   - 배포 상태 확인

옵션:
  --monitor - deploy 후 배포 상태 모니터링

새로운 기능:
  ✨ 현재 브랜치 자동 감지
  ✨ 중요 변경사항 자동 빌드 테스트
  ✨ 롤백 메커니즘
  ✨ 배포 상태 모니터링

예시:
  npm run claude:deploy-v2
      `);
  }
}

// 실행
main().catch(error => {
  log.error(`예상치 못한 오류: ${error.message}`);
  process.exit(1);
});