#!/bin/bash

# GitHub CLI 자동화 스크립트
# 사용법: ./scripts/gh-automation.sh [command] [options]

set -e

# 색상 설정
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# gh CLI 설치 확인
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}❌ gh CLI가 설치되어 있지 않습니다.${NC}"
        echo "설치 방법: https://cli.github.com/"
        exit 1
    fi
    echo -e "${GREEN}✅ gh CLI 확인됨${NC}"
}

# 최근 실패한 워크플로우 가져오기
get_failed_runs() {
    echo -e "${YELLOW}🔍 실패한 워크플로우 검색 중...${NC}"
    gh run list --status failure --limit 5 --json databaseId,name,status,conclusion,createdAt,headBranch,workflowName | \
    jq -r '.[] | "ID: \(.databaseId) | \(.workflowName) | Branch: \(.headBranch) | \(.createdAt)"'
}

# 특정 워크플로우 로그 가져오기
get_run_logs() {
    local run_id=$1
    if [ -z "$run_id" ]; then
        echo -e "${RED}❌ Run ID가 필요합니다.${NC}"
        echo "사용법: ./gh-automation.sh logs <run_id>"
        exit 1
    fi
    
    echo -e "${YELLOW}📄 워크플로우 로그 가져오는 중... (ID: $run_id)${NC}"
    gh run view $run_id --log-failed
}

# 실패한 작업의 상세 정보 가져오기
get_failed_jobs() {
    local run_id=$1
    if [ -z "$run_id" ]; then
        echo -e "${RED}❌ Run ID가 필요합니다.${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}🔍 실패한 작업 분석 중...${NC}"
    gh api "/repos/$GITHUB_REPOSITORY/actions/runs/$run_id/jobs" \
        --jq '.jobs[] | select(.conclusion == "failure") | "Job: \(.name)\nSteps failed: \([.steps[] | select(.conclusion == "failure") | .name] | join(", "))\n"'
}

# 워크플로우 재실행
rerun_workflow() {
    local run_id=$1
    if [ -z "$run_id" ]; then
        echo -e "${RED}❌ Run ID가 필요합니다.${NC}"
        echo "사용법: ./gh-automation.sh rerun <run_id>"
        exit 1
    fi
    
    echo -e "${YELLOW}🔄 워크플로우 재실행 중... (ID: $run_id)${NC}"
    gh run rerun $run_id
    echo -e "${GREEN}✅ 재실행 시작됨${NC}"
}

# 워크플로우 모니터링
watch_workflow() {
    local run_id=$1
    if [ -z "$run_id" ]; then
        echo -e "${YELLOW}최근 워크플로우를 모니터링합니다...${NC}"
        gh run watch
    else
        echo -e "${YELLOW}워크플로우 모니터링 중... (ID: $run_id)${NC}"
        gh run watch $run_id
    fi
}

# 린트 오류 자동 수정 후 커밋
fix_and_commit() {
    echo -e "${YELLOW}🔧 린트 오류 자동 수정 중...${NC}"
    
    # 린트 수정
    npm run lint:fix || true
    
    # 변경사항 확인
    if git diff --quiet; then
        echo -e "${GREEN}✅ 수정할 린트 오류가 없습니다.${NC}"
    else
        echo -e "${YELLOW}📝 변경사항 커밋 중...${NC}"
        git add -A
        git commit -m "fix: 린트 오류 자동 수정

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
        echo -e "${GREEN}✅ 커밋 완료${NC}"
        
        # 푸시 여부 확인
        read -p "변경사항을 푸시하시겠습니까? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push
            echo -e "${GREEN}✅ 푸시 완료${NC}"
        fi
    fi
}

# 워크플로우 상태 대시보드
dashboard() {
    echo -e "${YELLOW}📊 워크플로우 대시보드${NC}"
    echo "========================"
    
    echo -e "\n${GREEN}✅ 성공한 워크플로우 (최근 3개):${NC}"
    gh run list --status success --limit 3 --json name,headBranch,createdAt | \
        jq -r '.[] | "  • \(.name) | Branch: \(.headBranch) | \(.createdAt)"'
    
    echo -e "\n${RED}❌ 실패한 워크플로우 (최근 3개):${NC}"
    gh run list --status failure --limit 3 --json name,headBranch,createdAt | \
        jq -r '.[] | "  • \(.name) | Branch: \(.headBranch) | \(.createdAt)"'
    
    echo -e "\n${YELLOW}🔄 진행 중인 워크플로우:${NC}"
    gh run list --status in_progress --json name,headBranch,createdAt | \
        jq -r '.[] | "  • \(.name) | Branch: \(.headBranch) | \(.createdAt)"'
}

# 도움말
show_help() {
    cat << EOF
GitHub CLI 자동화 스크립트

사용법: ./scripts/gh-automation.sh [command] [options]

Commands:
  failed        실패한 워크플로우 목록 보기
  logs <id>     특정 워크플로우의 로그 보기
  jobs <id>     특정 워크플로우의 실패한 작업 상세 보기
  rerun <id>    워크플로우 재실행
  watch [id]    워크플로우 실시간 모니터링
  fix           린트 오류 자동 수정 후 커밋
  dashboard     워크플로우 상태 대시보드
  help          이 도움말 보기

Examples:
  ./scripts/gh-automation.sh failed
  ./scripts/gh-automation.sh logs 12345678
  ./scripts/gh-automation.sh rerun 12345678
  ./scripts/gh-automation.sh fix
  ./scripts/gh-automation.sh dashboard

EOF
}

# 메인 실행
check_gh_cli

case "$1" in
    failed)
        get_failed_runs
        ;;
    logs)
        get_run_logs $2
        ;;
    jobs)
        get_failed_jobs $2
        ;;
    rerun)
        rerun_workflow $2
        ;;
    watch)
        watch_workflow $2
        ;;
    fix)
        fix_and_commit
        ;;
    dashboard)
        dashboard
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}❌ 알 수 없는 명령: $1${NC}"
        show_help
        exit 1
        ;;
esac