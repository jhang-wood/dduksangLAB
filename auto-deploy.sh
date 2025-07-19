#!/bin/bash

# 자동 배포 스크립트 - Claude가 사용

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🚀 자동 배포 시작...${NC}"

# Git 상태 확인
if [[ -z $(git status -s) ]]; then
    echo -e "${YELLOW}변경사항이 없습니다.${NC}"
    exit 0
fi

# 변경사항 표시
echo -e "${GREEN}📝 변경사항:${NC}"
git status -s

# 모든 변경사항 추가
git add -A

# 커밋 메시지 생성
COMMIT_MSG="🔄 auto: $(date '+%Y-%m-%d %H:%M:%S') 자동 배포"
if [ ! -z "$1" ]; then
    COMMIT_MSG="$1"
fi

# 커밋
git commit -m "$COMMIT_MSG"

# Push
echo -e "${YELLOW}📤 GitHub에 푸시 중...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 성공적으로 푸시되었습니다!${NC}"
    echo -e "${GREEN}🌐 2-3분 후 https://dduksang.com 에서 확인하세요.${NC}"
    echo -e "${GREEN}📊 배포 상태: https://vercel.com/dashboard${NC}"
else
    echo -e "${RED}❌ 푸시 실패!${NC}"
    exit 1
fi