#!/bin/bash

# Vercel 배포 스크립트

echo "🚀 dduksangLAB Vercel 배포 시작..."

# 디렉토리 이동
cd /home/qwg18/dduksangLAB || exit 1

# 환경 변수 확인
if [ ! -f .env.local ]; then
    echo "❌ .env.local 파일이 없습니다. 환경 변수를 설정해주세요."
    exit 1
fi

# node_modules 재설치 (선택사항)
if [ "$1" = "--clean" ]; then
    echo "📦 node_modules 재설치 중..."
    rm -rf node_modules package-lock.json
    npm install
fi

# 빌드 테스트
echo "🔨 로컬 빌드 테스트 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패! 오류를 확인하세요."
    exit 1
fi

echo "✅ 로컬 빌드 성공!"

# Vercel 배포
echo "🌐 Vercel에 배포 중..."

# 프로젝트가 이미 연결되어 있다면 --yes 플래그로 자동 진행
if [ -d ".vercel" ]; then
    npx vercel --prod --yes
else
    echo "📝 Vercel 프로젝트 연결이 필요합니다."
    npx vercel --prod
fi

if [ $? -eq 0 ]; then
    echo "✅ 배포 완료!"
    echo "🌐 https://dduksanglab.vercel.app 에서 확인하세요."
else
    echo "❌ 배포 실패!"
    exit 1
fi