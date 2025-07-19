# Vercel 환경 변수 설정 가이드

## Vercel 대시보드에서 설정해야 할 환경 변수

### 1. Vercel 대시보드 접속
1. https://vercel.com 로그인
2. dduksangLAB 프로젝트 선택
3. Settings → Environment Variables

### 2. 다음 환경 변수 추가/확인

#### Supabase (필수)
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://wpzvocfgfwvsxmpckdnu.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2Njc4NTIsImV4cCI6MjA2ODI0Mzg1Mn0.LlO3iM55sbzXexcCExkDsSH448J2Z-NJUT1aZQCdck8

Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2Nzg1MiwiZXhwIjoyMDY4MjQzODUyfQ.c7vRQStMHbBZRjkDDM_iXdLWq4t0HWBvDNbkC7P6Z6c
```

#### PayApp (필수)
```
Name: PAYAPP_SECRET_KEY
Value: 2m/tdA5GmmwTLP/KWo9V7e1DPJnCCRVaOgT+oqg6zaM=

Name: PAYAPP_VALUE
Value: 2m/tdA5GmmwTLP/KWo9V7c0BU4QO/tDrbfcHeaukANY=
```

#### NextAuth (필수)
```
Name: NEXTAUTH_SECRET
Value: EkprhjFI9i16QoEIN3Y2itAxSfPLSlIvcvlMETfvr1o=

Name: NEXTAUTH_URL
Value: https://dduksang.com
```

#### Site URL (필수)
```
Name: NEXT_PUBLIC_SITE_URL
Value: https://dduksang.com
```

#### Cloudflare (선택사항 - 필요시)
```
Name: CLOUDFLARE_API_TOKEN
Value: 1mT4GjLX68DOkfd8MQfuts9R3QTE2jGAiwUpII2T

Name: CLOUDFLARE_ACCOUNT_ID
Value: bc8ec24cef9d77d4fa1a545dffbccd38

Name: CLOUDFLARE_ZONE_ID
Value: 53c8596574446b6b61ad6c1211da8e1c
```

### 3. 환경 변수 적용
- 각 환경 변수를 추가할 때 모든 환경(Production, Preview, Development)에 적용
- "Save" 버튼 클릭

### 4. 재배포
환경 변수 추가 후:
1. Deployments 탭으로 이동
2. 최신 배포에서 "..." 메뉴 클릭
3. "Redeploy" 선택
4. "Use existing Build Cache" 체크 해제
5. "Redeploy" 클릭

## 중요 사항
- 환경 변수 이름은 정확하게 입력 (대소문자 구분)
- 값 복사 시 앞뒤 공백 주의
- SUPABASE_SERVICE_ROLE_KEY는 절대 공개하지 말 것

## 문제 해결
빌드가 계속 실패한다면:
1. 환경 변수가 모두 설정되었는지 확인
2. Build Logs에서 구체적인 오류 메시지 확인
3. 필요시 캐시 삭제 후 재배포