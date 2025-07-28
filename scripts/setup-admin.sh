#!/bin/bash

# dduksangLAB 관리자 계정 설정 스크립트

echo "🚀 dduksangLAB 관리자 계정 설정을 시작합니다..."
echo ""

# Node.js 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되어 있지 않습니다. Node.js를 먼저 설치해주세요."
    exit 1
fi

# 프로젝트 루트 디렉토리로 이동
cd "$(dirname "$0")/.." || exit

# 환경 변수 파일 확인
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local 파일이 없습니다. 먼저 환경 변수를 설정해주세요."
    exit 1
fi

# dotenv 패키지 설치 확인
if [ ! -d "node_modules/dotenv" ]; then
    echo "📦 dotenv 패키지를 설치합니다..."
    npm install dotenv
fi

# 관리자 계정 생성 스크립트 실행
echo "👤 관리자 계정을 생성합니다..."
node scripts/create-admin.js

echo ""
echo "✅ 완료!"