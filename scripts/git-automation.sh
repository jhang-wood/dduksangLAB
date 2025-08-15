#!/bin/bash

# 🚀 1인 개발자용 최소 Git 자동화 스크립트 (2025년 8월 버전)
# 간단하고 빠르게 코드 검증 → 커밋 → 푸시 → 배포까지 한번에!

set -e  # 오류 발생 시 즉시 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)

echo -e "${BLUE}🔍 현재 브랜치: ${CURRENT_BRANCH}${NC}"

# 1. 변경사항 확인
echo -e "\n${YELLOW}📋 변경사항 확인 중...${NC}"
git status --short

# 변경사항이 없으면 종료
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  변경사항이 없습니다.${NC}"
    exit 0
fi

# 2. ESLint 자동 수정 (있으면 실행)
if [ -f "package.json" ] && grep -q "\"lint\"" package.json; then
    echo -e "\n${BLUE}🔧 ESLint 자동 수정 중...${NC}"
    npm run lint --fix 2>/dev/null || npm run lint || true
fi

# 3. TypeScript 타입 체크 (있으면 실행)
if [ -f "tsconfig.json" ]; then
    echo -e "\n${BLUE}📘 TypeScript 타입 체크 중...${NC}"
    npx tsc --noEmit || true
fi

# 4. 모든 변경사항 스테이징
echo -e "\n${BLUE}📦 변경사항 스테이징...${NC}"
git add -A

# 5. 커밋 메시지 자동 생성
echo -e "\n${BLUE}💬 커밋 메시지 생성 중...${NC}"

# 변경된 파일 수와 타입 분석
ADDED=$(git diff --cached --numstat | wc -l)
MODIFIED=$(git diff --cached --name-status | grep "^M" | wc -l)
DELETED=$(git diff --cached --name-status | grep "^D" | wc -l)

# 주요 변경 파일 확인
MAIN_FILES=$(git diff --cached --name-only | head -5 | xargs)

# 커밋 타입 자동 결정
if git diff --cached --name-only | grep -q "fix\|bug\|error"; then
    COMMIT_TYPE="fix"
elif git diff --cached --name-only | grep -q "feat\|feature\|add"; then
    COMMIT_TYPE="feat"
elif git diff --cached --name-only | grep -q "docs\|README\|md$"; then
    COMMIT_TYPE="docs"
elif git diff --cached --name-only | grep -q "test\|spec"; then
    COMMIT_TYPE="test"
elif git diff --cached --name-only | grep -q "style\|css\|scss"; then
    COMMIT_TYPE="style"
else
    COMMIT_TYPE="update"
fi

# 커밋 메시지 생성
COMMIT_MSG="${COMMIT_TYPE}: "

if [ $ADDED -gt 0 ]; then
    COMMIT_MSG="${COMMIT_MSG}+${ADDED} "
fi
if [ $MODIFIED -gt 0 ]; then
    COMMIT_MSG="${COMMIT_MSG}~${MODIFIED} "
fi
if [ $DELETED -gt 0 ]; then
    COMMIT_MSG="${COMMIT_MSG}-${DELETED} "
fi

COMMIT_MSG="${COMMIT_MSG}files | $(date +'%Y-%m-%d %H:%M')"

# 사용자에게 커밋 메시지 확인
echo -e "${GREEN}📝 생성된 커밋 메시지:${NC}"
echo "   $COMMIT_MSG"
echo ""
read -p "이 메시지를 사용하시겠습니까? (Y/n/수정): " choice

case "$choice" in
    n|N)
        echo "커밋을 취소합니다."
        git reset HEAD
        exit 0
        ;;
    y|Y|"")
        # 그대로 사용
        ;;
    *)
        # 사용자가 메시지 수정
        COMMIT_MSG="$choice"
        ;;
esac

# 6. 커밋 실행
echo -e "\n${BLUE}✅ 커밋 중...${NC}"
git commit -m "$COMMIT_MSG"

# 7. 푸시 여부 확인
echo ""
read -p "🚀 원격 저장소에 푸시하시겠습니까? (Y/n): " push_choice

if [[ "$push_choice" =~ ^[Yy]?$ ]]; then
    echo -e "\n${BLUE}🚀 푸시 중...${NC}"
    git push origin $CURRENT_BRANCH
    
    echo -e "\n${GREEN}✨ 완료! 변경사항이 성공적으로 푸시되었습니다.${NC}"
    
    # Vercel 자동 배포 알림 (Next.js 프로젝트인 경우)
    if [ -f "next.config.js" ]; then
        echo -e "${BLUE}🔄 Vercel 자동 배포가 시작됩니다...${NC}"
        echo -e "${YELLOW}   배포 상태: https://vercel.com/dashboard${NC}"
    fi
else
    echo -e "\n${GREEN}✅ 로컬 커밋이 완료되었습니다.${NC}"
fi

echo -e "\n${GREEN}🎉 Git 자동화 완료!${NC}"