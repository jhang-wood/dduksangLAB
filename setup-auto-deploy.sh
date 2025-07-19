#!/bin/bash

echo "🚀 dduksangLAB 자동 배포 설정 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vercel CLI 설치 확인
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Vercel CLI 설치 중...${NC}"
    npm install -g vercel
fi

# 프로젝트 정보 확인
if [ -f ".vercel/project.json" ]; then
    echo -e "${GREEN}✅ Vercel 프로젝트가 이미 연결되어 있습니다.${NC}"
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | sed 's/"projectId":"//')
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*' | sed 's/"orgId":"//')
    echo "Project ID: $PROJECT_ID"
    echo "Org ID: $ORG_ID"
else
    echo -e "${RED}❌ Vercel 프로젝트가 연결되지 않았습니다.${NC}"
    echo "먼저 'vercel' 명령을 실행하여 프로젝트를 연결하세요."
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 다음 단계를 따라주세요:${NC}"
echo ""
echo "1. Vercel 토큰 생성:"
echo "   - https://vercel.com/account/tokens 방문"
echo "   - 'Create Token' 클릭"
echo "   - 토큰 이름: 'github-actions' 입력"
echo "   - 생성된 토큰 복사"
echo ""
echo "2. GitHub Secrets 설정:"
echo "   - https://github.com/jhang-wood/dduksangLAB/settings/secrets/actions 방문"
echo "   - 다음 secrets 추가:"
echo "     • VERCEL_TOKEN: [위에서 복사한 토큰]"
echo "     • VERCEL_ORG_ID: $ORG_ID"
echo "     • VERCEL_PROJECT_ID: $PROJECT_ID"
echo ""
echo "3. Git Integration 활성화 (권장):"
echo "   - https://vercel.com/dashboard 방문"
echo "   - dduksangLAB 프로젝트 → Settings → Git Integration"
echo "   - GitHub 저장소 연결"
echo ""
echo -e "${GREEN}✅ 설정 완료 후 git push만 하면 자동 배포됩니다!${NC}"
echo ""
echo "테스트 방법:"
echo "  git add ."
echo "  git commit -m \"test auto deploy\""
echo "  git push origin main"
echo ""
echo "배포 상태 확인:"
echo "  - Vercel: https://vercel.com/dashboard"
echo "  - GitHub: https://github.com/jhang-wood/dduksangLAB/actions"