#!/bin/bash

# 떡상연구소 개발 환경 설정 스크립트
# 2025년 최신 개발 환경 자동 구성

set -e

echo "🚀 떡상연구소 개발 환경 설정을 시작합니다..."

# 시스템 업데이트
echo "📦 시스템 패키지 업데이트 중..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# 기본 도구 설치
echo "🔧 기본 개발 도구 설치 중..."
sudo apt-get install -y -qq \
    curl \
    wget \
    unzip \
    build-essential \
    jq \
    tree \
    htop \
    neofetch \
    bat \
    exa \
    ripgrep \
    fd-find \
    git-lfs

# Git 설정
echo "📝 Git 설정 중..."
git config --global init.defaultBranch main
git config --global core.autocrlf input
git config --global core.editor "code --wait"
git config --global pull.rebase false
git config --global push.autoSetupRemote true

# Node.js 도구 설치
echo "📦 Node.js 글로벌 패키지 설치 중..."
npm install -g \
    @vercel/cli \
    netlify-cli \
    firebase-tools \
    typescript \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/parser \
    eslint \
    prettier \
    @playwright/test \
    semantic-release \
    @semantic-release/changelog \
    @semantic-release/git \
    @semantic-release/github \
    commitizen \
    cz-conventional-changelog \
    husky \
    lint-staged

# pnpm 설치 (빠른 패키지 매니저)
echo "⚡ pnpm 설치 중..."
npm install -g pnpm

# Playwright 브라우저 설치
echo "🎭 Playwright 브라우저 설치 중..."
npx playwright install --with-deps

# 개발 환경 최적화
echo "⚙️ 개발 환경 최적화 설정 중..."

# zsh 플러그인 설치
echo "🐚 Zsh 플러그인 설치 중..."
if [ -d "$HOME/.oh-my-zsh" ]; then
    # zsh-autosuggestions
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions 2>/dev/null || true
    
    # zsh-syntax-highlighting
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting 2>/dev/null || true
    
    # zsh-completions
    git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions 2>/dev/null || true

    # .zshrc 설정 업데이트
    sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting zsh-completions)/' ~/.zshrc
    echo "autoload -U compinit && compinit" >> ~/.zshrc
fi

# 개발 환경 별칭 설정
echo "📝 개발 환경 별칭 설정 중..."
cat >> ~/.zshrc << 'EOF'

# 떡상연구소 개발 환경 별칭
alias ll="exa -la --icons --group-directories-first"
alias ls="exa --icons"
alias cat="batcat"
alias find="fd"
alias grep="rg"
alias dev="npm run dev"
alias build="npm run build"
alias test="npm test"
alias lint="npm run lint"
alias format="npm run format"
alias commit="npm run commit"
alias deploy="vercel --prod"
alias logs="vercel logs"
alias status="git status"
alias push="git push"
alias pull="git pull"
alias stash="git stash"
alias unstash="git stash pop"

# 프로젝트 빠른 이동
alias lab="cd /workspaces/dduksangLAB"
alias docs="cd /workspaces/dduksangLAB/docs"
alias components="cd /workspaces/dduksangLAB/components"

# 개발 서버 관리
alias start="npm start"
alias stop="pkill -f 'next'"
alias restart="npm run build && npm start"

# 테스트 환경
alias test:unit="npm run test:unit"
alias test:e2e="npm run test:e2e"
alias test:watch="npm run test:watch"
alias test:coverage="npm run test:coverage"

# 배포 관리
alias deploy:preview="vercel"
alias deploy:prod="vercel --prod"
alias deploy:status="vercel list"

# 로그 확인
alias logs:dev="npm run dev 2>&1 | tee dev.log"
alias logs:build="npm run build 2>&1 | tee build.log"
alias logs:vercel="vercel logs --follow"

# Git 워크플로우
alias gaa="git add ."
alias gcm="git commit -m"
alias gco="git checkout"
alias gcb="git checkout -b"
alias gbd="git branch -d"
alias gst="git status"
alias gpl="git pull"
alias gps="git push"
alias glog="git log --oneline --graph --decorate"

# 패키지 관리
alias ni="npm install"
alias nu="npm update"
alias nr="npm run"
alias nrd="npm run dev"
alias nrb="npm run build"
alias nrt="npm run test"

# pnpm 별칭
alias pi="pnpm install"
alias pu="pnpm update"
alias pr="pnpm run"
alias prd="pnpm run dev"
alias prb="pnpm run build"
alias prt="pnpm run test"
EOF

# 환경 변수 설정
echo "🌍 환경 변수 설정 중..."
cat >> ~/.zshrc << 'EOF'

# 떡상연구소 환경 변수
export EDITOR="code"
export BROWSER="none"
export TZ="Asia/Seoul"
export LANG="ko_KR.UTF-8"
export NODE_ENV="development"

# 개발 도구 경로
export PATH="$PATH:$HOME/.local/bin"
export PATH="$PATH:./node_modules/.bin"
EOF

# VS Code 확장 프로그램 설치 (서버 모드)
echo "🔧 VS Code Server 확장 프로그램 설치 중..."
if command -v code-server >/dev/null 2>&1; then
    # 필수 확장 프로그램들을 백그라운드에서 설치
    extensions=(
        "ms-vscode.vscode-typescript-next"
        "bradlc.vscode-tailwindcss"
        "esbenp.prettier-vscode"
        "dbaeumer.vscode-eslint"
        "ms-playwright.playwright"
        "eamodio.gitlens"
        "github.vscode-github-actions"
        "supabase.supabase-vscode"
        "ms-ceintl.vscode-language-pack-ko"
    )
    
    for ext in "${extensions[@]}"; do
        code-server --install-extension "$ext" 2>/dev/null &
    done
    wait
fi

# 프로젝트 의존성 설치 및 설정
echo "📦 프로젝트 의존성 확인 중..."
if [ -f "/workspaces/dduksangLAB/package.json" ]; then
    cd /workspaces/dduksangLAB
    
    # package.json이 있으면 의존성 설치
    echo "📦 프로젝트 의존성 설치 중..."
    npm ci
    
    # Playwright 설정이 있으면 브라우저 설치
    if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
        echo "🎭 Playwright 브라우저 설치 중..."
        npx playwright install
    fi
    
    # Husky 설정이 있으면 활성화
    if [ -f ".husky/pre-commit" ] || grep -q "husky" package.json 2>/dev/null; then
        echo "🐶 Husky Git hooks 설정 중..."
        npx husky install 2>/dev/null || true
    fi
fi

# 개발 도구 확인 및 버전 출력
echo "🔍 설치된 도구 버전 확인..."
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "pnpm: $(pnpm --version 2>/dev/null || echo 'Not installed')"
echo "TypeScript: $(tsc --version 2>/dev/null || echo 'Not installed globally')"
echo "Git: $(git --version)"
echo "Vercel CLI: $(vercel --version 2>/dev/null || echo 'Not installed')"
echo "Playwright: $(npx playwright --version 2>/dev/null || echo 'Not installed')"

# 환경 정보 표시
echo ""
echo "🎯 떡상연구소 개발 환경 설정 완료!"
echo ""
echo "📋 설정된 기능:"
echo "  ✅ Node.js 18 + TypeScript 개발 환경"
echo "  ✅ Next.js 프로젝트 지원"
echo "  ✅ Playwright E2E 테스트 환경"
echo "  ✅ ESLint + Prettier 코드 품질 도구"
echo "  ✅ Tailwind CSS 개발 도구"
echo "  ✅ Supabase 데이터베이스 통합"
echo "  ✅ GitHub Actions CI/CD"
echo "  ✅ Vercel 배포 도구"
echo "  ✅ 한국어 로케일 및 시간대 설정"
echo ""
echo "🚀 개발 시작 명령어:"
echo "  npm run dev      # 개발 서버 시작"
echo "  npm run build    # 프로덕션 빌드"
echo "  npm run test     # 테스트 실행"
echo "  npm run lint     # 코드 검사"
echo "  vercel           # 미리보기 배포"
echo "  vercel --prod    # 프로덕션 배포"
echo ""
echo "🎉 Happy coding! 떡상연구소에서 멋진 프로젝트를 만들어보세요!"

# zsh 재로드
if [ "$SHELL" = "/bin/zsh" ]; then
    exec zsh
fi