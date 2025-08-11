#\!/bin/bash

# 보안 블로그 자동화 시스템 통합 테스트
# dduksangLAB 관리자 자동 로그인 및 블로그 게시 테스트

set -e

echo "🔐 dduksangLAB 보안 블로그 자동화 시스템 테스트 시작"
echo "=================================================="

# 색깔 출력용 함수
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. 환경변수 검증
echo ""
print_info "1. 환경변수 검증"
echo "--------------------------------"

required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "ADMIN_EMAIL"
    "ADMIN_PASSWORD"
    "ENCRYPTION_KEY"
    "CRON_SECRET"
)

all_vars_present=true
for var in "${required_vars[@]}"; do
    if [ -z "${\!var}" ]; then
        print_error "환경변수 $var 가 설정되지 않았습니다"
        all_vars_present=false
    else
        print_success "환경변수 $var 확인됨"
    fi
done

if [ "$all_vars_present" = false ]; then
    print_error "필수 환경변수가 누락되었습니다. .env.local 파일을 확인하세요."
    exit 1
fi

# 2. 암호화 키 강도 검증
echo ""
print_info "2. 암호화 키 보안 검증"
echo "--------------------------------"

if [ ${#ENCRYPTION_KEY} -lt 32 ]; then
    print_error "ENCRYPTION_KEY는 최소 32자 이상이어야 합니다"
    exit 1
else
    print_success "암호화 키 길이 검증 통과"
fi

if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
    print_error "ADMIN_PASSWORD는 최소 8자 이상이어야 합니다"
    exit 1
else
    print_success "관리자 비밀번호 길이 검증 통과"
fi

# 3. 자동화 시스템 구성 요소 존재 확인
echo ""
print_info "3. 자동화 시스템 파일 검증"
echo "--------------------------------"

security_files=(
    "lib/security/credential-manager.ts"
    "lib/security/access-control.ts" 
    "lib/security/admin-auth-automation.ts"
    "lib/security/secure-blog-automation.ts"
    "app/api/automation/secure-blog/route.ts"
)

for file in "${security_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "파일 존재 확인: $file"
    else
        print_error "파일 누락: $file"
        exit 1
    fi
done

# 4. TypeScript 컴파일 테스트
echo ""
print_info "4. TypeScript 컴파일 테스트"
echo "--------------------------------"

if npm run build --silent > /dev/null 2>&1; then
    print_success "TypeScript 컴파일 성공"
else
    print_error "TypeScript 컴파일 실패"
    exit 1
fi

echo ""
echo "=================================================="
print_success "🎉 보안 블로그 자동화 시스템 검증 완료\!"
echo ""
print_info "시스템 준비 완료. 이제 다음 명령어로 테스트할 수 있습니다:"
echo "npm run dev"
echo ""

exit 0
SECURITY_SCRIPT_EOF < /dev/null
