#!/usr/bin/env node

/**
 * Git Cleanup 스크립트
 * Merge conflict 상태를 완전히 정리하고 깨끗한 상태로 복원합니다.
 * Claude Code CLI 자동화 시스템의 일부
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
    log.task(`실행 중: ${command}`);
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit'
    });
    return { success: true, output: result };
  } catch (error) {
    if (!options.ignoreError) {
      log.error(`명령어 실행 실패: ${command}`);
      log.error(`에러: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
}

// Git cleanup 메인 함수
function performGitCleanup() {
  log.info('Git Cleanup 시작...');
  
  // 1. 현재 git 상태 확인
  log.task('1단계: 현재 git 상태 확인');
  const statusResult = runCommand('git status --porcelain', { silent: true });
  if (statusResult.success) {
    log.info('Git 상태 확인 완료');
  }
  
  // 2. 진행중인 merge/rebase 중단
  log.task('2단계: 진행중인 merge/rebase 중단');
  runCommand('git merge --abort', { ignoreError: true, silent: true });
  runCommand('git rebase --abort', { ignoreError: true, silent: true });
  runCommand('git cherry-pick --abort', { ignoreError: true, silent: true });
  log.success('Merge/Rebase 작업 중단 완료');
  
  // 3. 모든 로컬 변경사항 제거
  log.task('3단계: 로컬 변경사항 강제 제거');
  const resetResult = runCommand('git reset --hard HEAD');
  if (resetResult.success) {
    log.success('로컬 변경사항 제거 완료');
  }
  
  // 4. untracked 파일들 제거
  log.task('4단계: Untracked 파일들 제거');
  runCommand('git clean -fd');
  log.success('Untracked 파일 제거 완료');
  
  // 5. 원격 저장소에서 최신 변경사항 가져오기
  log.task('5단계: 원격 저장소 최신 변경사항 가져오기');
  const fetchResult = runCommand('git fetch origin');
  if (fetchResult.success) {
    log.success('원격 저장소 fetch 완료');
  }
  
  // 6. main 브랜치로 강제 재설정
  log.task('6단계: main 브랜치로 강제 재설정');
  const resetToOriginResult = runCommand('git reset --hard origin/main');
  if (resetToOriginResult.success) {
    log.success('main 브랜치 강제 재설정 완료');
  }
  
  // 7. 최종 상태 확인
  log.task('7단계: 최종 git 상태 확인');
  const finalStatusResult = runCommand('git status');
  
  log.success('Git Cleanup 완료! 저장소가 깨끗한 상태로 복원되었습니다.');
  
  return true;
}

// 메인 실행
if (require.main === module) {
  try {
    // 프로젝트 루트로 이동
    const projectRoot = path.resolve(__dirname, '..');
    process.chdir(projectRoot);
    log.info(`작업 디렉토리: ${projectRoot}`);
    
    performGitCleanup();
    
    log.info('이제 npm run claude:deploy 명령을 실행할 수 있습니다.');
    
  } catch (error) {
    log.error('Git cleanup 실행 중 오류가 발생했습니다:');
    log.error(error.message);
    process.exit(1);
  }
}

module.exports = { performGitCleanup };