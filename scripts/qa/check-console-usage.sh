#!/bin/bash
# QA: Console.log 사용 현황 분석 스크립트

echo "🔍 Console.log 사용 현황 분석..."
echo "=================================="

# 프로젝트 루트로 이동
cd "$(dirname "$0")/../.."

# 전체 console 사용 개수
echo "📊 전체 console 사용 개수:"
TOTAL_CONSOLE=$(grep -r "console\." --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" . \
  --exclude-dir=node_modules --exclude-dir=.next | wc -l)
echo "   총 $TOTAL_CONSOLE 개 발견"

echo ""

# Scripts 폴더 제외한 실제 수정 대상
echo "🎯 수정 대상 console 사용 개수 (scripts 폴더 제외):"
TARGET_CONSOLE=$(grep -r "console\." --include="*.tsx" --include="*.ts" . \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=scripts | wc -l)
echo "   총 $TARGET_CONSOLE 개 발견"

echo ""

# 파일별 console 사용 현황
echo "📁 파일별 console 사용 현황:"
grep -r "console\." --include="*.tsx" --include="*.ts" . \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=scripts \
  | cut -d: -f1 | sort | uniq -c | sort -nr | head -20

echo ""

# console.log만 따로 확인
echo "📝 console.log 사용 파일들:"
grep -r "console\.log" --include="*.tsx" --include="*.ts" . \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=scripts \
  | cut -d: -f1 | sort | uniq

echo ""

# logger.ts 사용 확인
echo "✅ Logger 사용 현황:"
LOGGER_USAGE=$(grep -r "logger\." --include="*.tsx" --include="*.ts" . \
  --exclude-dir=node_modules --exclude-dir=.next | wc -l)
echo "   총 $LOGGER_USAGE 개 logger 사용 중"

echo ""

# 상세 console 사용 내역 (처음 20개)
echo "🔍 Console 사용 상세 내역 (상위 20개):"
grep -r "console\." --include="*.tsx" --include="*.ts" . \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=scripts \
  | head -20

echo ""
echo "=================================="
echo "✅ 분석 완료!"
echo "📈 수정 진행률: $(echo "scale=1; (125-$TARGET_CONSOLE)*100/125" | bc)% 완료"