#\!/bin/bash

# dduksang.com 사이트 헬스 체크 스크립트
echo "🔍 dduksang.com 사이트 헬스 체크 시작..."

# 기본 변수 설정
SITE_URL="https://www.dduksang.com"
REDIRECT_URL="https://dduksang.com"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 1. www.dduksang.com 상태 확인
echo "1. www.dduksang.com 상태 확인 중..."
WWW_STATUS=$(curl -I -s -w "%{http_code}" "$SITE_URL" -o /dev/null)
if [ "$WWW_STATUS" = "200" ]; then
  echo "✅ www.dduksang.com: 정상 (HTTP $WWW_STATUS)"
else
  echo "❌ www.dduksang.com: 오류 (HTTP $WWW_STATUS)"
fi

# 2. dduksang.com 리다이렉트 확인
echo "2. dduksang.com 리다이렉트 확인 중..."
REDIRECT_STATUS=$(curl -I -s -w "%{http_code}" "$REDIRECT_URL" -o /dev/null)
if [ "$REDIRECT_STATUS" = "307" ] || [ "$REDIRECT_STATUS" = "308" ]; then
  echo "✅ dduksang.com: 정상 리다이렉트 (HTTP $REDIRECT_STATUS)"
else
  echo "❌ dduksang.com: 리다이렉트 오류 (HTTP $REDIRECT_STATUS)"
fi

# 3. 페이지 콘텐츠 확인
echo "3. 페이지 콘텐츠 로딩 확인 중..."
CONTENT_CHECK=$(curl -s "$SITE_URL" | grep -c "떡상연구소")
if [ "$CONTENT_CHECK" -gt 0 ]; then
  echo "✅ 페이지 콘텐츠: 정상 로딩"
else
  echo "❌ 페이지 콘텐츠: 로딩 실패"
fi

# 4. 미들웨어 오류 확인
echo "4. 미들웨어 오류 확인 중..."
MIDDLEWARE_ERROR=$(curl -I -s "$SITE_URL" | grep -c "x-vercel-error")
if [ "$MIDDLEWARE_ERROR" -eq 0 ]; then
  echo "✅ 미들웨어: 정상 동작"
else
  echo "❌ 미들웨어: 오류 감지"
fi

echo ""
echo "🔍 헬스 체크 완료 - $TIMESTAMP"
