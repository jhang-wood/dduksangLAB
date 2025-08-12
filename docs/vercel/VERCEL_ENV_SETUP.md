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
Value: [YOUR_SUPABASE_ANON_KEY]

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [YOUR_SUPABASE_SERVICE_ROLE_KEY]
```

#### PayApp (필수)

```
Name: PAYAPP_SECRET_KEY
Value: [YOUR_PAYAPP_SECRET_KEY]

Name: PAYAPP_VALUE
Value: [YOUR_PAYAPP_VALUE]
```

#### NextAuth (필수)

```
Name: NEXTAUTH_SECRET
Value: [GENERATE_A_SECURE_RANDOM_STRING]

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
Value: [YOUR_CLOUDFLARE_API_TOKEN]

Name: CLOUDFLARE_ACCOUNT_ID
Value: [YOUR_CLOUDFLARE_ACCOUNT_ID]

Name: CLOUDFLARE_ZONE_ID
Value: [YOUR_CLOUDFLARE_ZONE_ID]
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
