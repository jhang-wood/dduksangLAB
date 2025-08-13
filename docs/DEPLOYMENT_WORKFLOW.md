# dduksangLAB 배포 워크플로우 가이드

GitHub Actions를 통한 자동화된 Vercel 배포 워크플로우의 상세 설명입니다.

## 워크플로우 개요

### 트리거 조건

- **main 브랜치 push**: 자동 배포 실행
- **Pull Request**: 검증만 수행 (배포하지 않음)
- **수동 실행**: GitHub Actions 탭에서 수동 트리거 가능

### 실행 단계

```
1. Validate (검증) → 2. Deploy (배포) → 3. E2E Test (테스트) → 4. Finalize (완료)
```

## 상세 실행 단계

### 1단계: Validate Build (검증)

**목적**: 배포 전 코드 품질과 빌드 가능성 검증

**실행 작업**:

- 코드 체크아웃 및 Node.js 환경 설정
- 의존성 설치 (`npm ci --prefer-offline --no-audit`)
- ESLint 실행 (`npm run lint`)
- TypeScript 타입 검사 (`npm run type-check`)
- 환경 변수 검증 (`npm run env:validate`)
- 프로덕션 빌드 테스트 (`npm run build`)

**성공 조건**:

- 모든 린트 규칙 통과
- TypeScript 컴파일 오류 없음
- 환경 변수 유효성 검증 통과
- Next.js 빌드 성공

### 2단계: Deploy to Vercel (배포)

**목적**: Vercel을 통한 프로덕션 배포

**실행 작업**:

- Vercel CLI 설치 및 환경 구성
- Vercel 환경 변수 동기화 (`vercel pull`)
- 프로덕션 빌드 생성 (`vercel build --prod`)
- Vercel 배포 실행 (`vercel deploy --prebuilt --prod`)
- 텔레그램 배포 시작 알림 발송

**성공 조건**:

- Vercel 빌드 성공
- 배포 URL 생성
- 텔레그램 알림 발송 성공

### 3단계: E2E Testing (종단간 테스트)

**목적**: 배포된 사이트의 주요 기능 검증

**테스트 시나리오**:

```javascript
1. 홈페이지 로딩 및 기본 네비게이션 확인
2. AI Trends 페이지 접근성 테스트
3. 인증 페이지 (로그인/회원가입) 접근성 테스트
4. API 엔드포인트 상태 검사
```

**실행 작업**:

- Playwright 설치 및 설정
- 배포된 사이트 접근성 대기 (최대 5분)
- Chrome 브라우저 기반 자동화 테스트 실행
- 실패 시 스크린샷 및 비디오 캡처
- 테스트 결과 아티팩트 업로드

**성공 조건**:

- 모든 핵심 페이지 로딩 성공
- 주요 UI 요소 정상 표시
- API 응답 상태 코드 < 500

### 4단계: Finalize Deployment (배포 완료)

**목적**: 테스트 결과에 따른 최종 처리

**성공 시 처리**:

- 성공 알림 텔레그램 메시지 발송
- 배포 URL 및 커밋 정보 포함

**실패 시 처리**:

- 이전 성공한 배포로 자동 롤백
- 실패 알림 텔레그램 메시지 발송
- 에러 로그 링크 제공

## 2025년 베스트 프랙티스 적용 사항

### 1. 보안 강화

```yaml
# 최신 액션 버전 사용
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/upload-artifact@v4

# 권한 최소화
permissions:
  contents: read

# 보안 스캔 통합
- name: Security audit
  run: npm audit --audit-level=critical
```

### 2. 성능 최적화

```yaml
# 의존성 캐싱
cache: 'npm'

# 병렬 작업 실행
jobs:
  validate:
  deploy:
    needs: validate
  e2e-test:
    needs: deploy

# 타임아웃 설정
timeout-minutes: 15
```

### 3. 안정성 향상

```yaml
# 동시 배포 방지
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

# 재시도 메커니즘
retries: 2

# 실패 시 계속 진행
continue-on-error: true
```

### 4. 모니터링 및 가시성

```yaml
# 상세한 로깅
- name: Debug deployment
  run: |
    echo "Deployment URL: ${{ steps.deploy.outputs.url }}"
    echo "Commit SHA: ${{ github.sha }}"

# 아티팩트 보존
- uses: actions/upload-artifact@v4
  with:
    retention-days: 7
```

## 환경 변수 및 Secrets

### 필수 GitHub Secrets

```bash
# Vercel 관련
VERCEL_TOKEN          # Vercel CLI 인증 토큰
VERCEL_ORG_ID         # Vercel 조직 ID
VERCEL_PROJECT_ID     # Vercel 프로젝트 ID

# Telegram 알림
TELEGRAM_BOT_TOKEN    # 텔레그램 봇 토큰
TELEGRAM_CHAT_ID      # 알림 받을 채팅 ID

# Next.js 빌드용
NEXT_PUBLIC_SUPABASE_URL      # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase 익명 키
```

### 환경 변수 설정

```yaml
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  DEPLOYMENT_URL: 'https://dduksang.com'
  NODE_ENV: production
```

## 알림 시스템

### 텔레그램 알림 종류

1. **배포 시작 알림**

```
🚀 dduksangLAB 배포 시작

📝 커밋: feat: add new AI trends feature
👤 작성자: developer_name
🌐 URL: https://dduksang-lab-xxx.vercel.app
⏰ 시간: 2025-01-15 14:30:00 KST
```

2. **배포 성공 알림**

```
✅ dduksangLAB 배포 성공

📝 커밋: feat: add new AI trends feature
👤 작성자: developer_name
🌐 URL: https://dduksang.com
🧪 E2E 테스트: 통과
⏰ 완료 시간: 2025-01-15 14:35:00 KST

🎉 새로운 버전이 성공적으로 배포되었습니다!
```

3. **배포 실패 알림**

```
❌ dduksangLAB 배포 실패

📝 커밋: feat: add new AI trends feature
👤 작성자: developer_name
🧪 E2E 테스트: 실패
🔄 롤백: 진행 중
⏰ 시간: 2025-01-15 14:33:00 KST

⚠️ 이전 버전으로 롤백이 수행되었습니다.
GitHub Actions에서 로그를 확인해주세요.
```

## 롤백 메커니즘

### 자동 롤백 조건

- E2E 테스트 실패
- 배포 후 5분 이내 사이트 접근 불가
- 심각한 빌드 오류 발생

### 롤백 프로세스

```bash
# 1. 이전 성공한 배포 ID 조회
previous_deployment=$(vercel ls --token=$VERCEL_TOKEN | grep -v "$current_deployment" | head -n 1)

# 2. 이전 배포로 프로모션
vercel promote $previous_deployment --token=$VERCEL_TOKEN

# 3. 롤백 완료 알림
echo "Rollback completed to: $previous_deployment"
```

### 수동 롤백 방법

```bash
# Vercel Dashboard에서
1. https://vercel.com/dashboard 접속
2. 프로젝트 선택
3. Deployments 탭
4. 이전 성공한 배포의 "Promote" 버튼 클릭

# CLI에서
vercel ls --token=$VERCEL_TOKEN
vercel promote [DEPLOYMENT_ID] --token=$VERCEL_TOKEN
```

## 모니터링 및 로깅

### GitHub Actions 로그 확인

1. GitHub 저장소 → Actions 탭
2. 해당 워크플로우 실행 선택
3. 각 단계별 상세 로그 확인

### Vercel 배포 로그 확인

1. Vercel Dashboard → 프로젝트 선택
2. Deployments 탭
3. 해당 배포의 "View Function Logs" 클릭

### 성능 메트릭 추적

```yaml
# 향후 추가 예정
- name: Performance metrics
  run: |
    # Lighthouse CI 실행
    # Core Web Vitals 측정
    # 성능 임계값 검증
```

## 트러블슈팅

### 자주 발생하는 문제

1. **Vercel 토큰 만료**

```
Error: Invalid token
```

→ Vercel Dashboard에서 새 토큰 생성 후 Secrets 업데이트

2. **빌드 메모리 부족**

```
Error: JavaScript heap out of memory
```

→ `next.config.js`에서 메모리 설정 조정

3. **E2E 테스트 타임아웃**

```
Test timeout of 30000ms exceeded
```

→ 네트워크 대기 시간 증가 또는 테스트 최적화

4. **텔레그램 알림 실패**

```
Error: Bad Request: chat not found
```

→ Chat ID 확인 및 봇 차단 상태 점검

### 디버깅 팁

```yaml
# 상세 로깅 활성화
- name: Debug info
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Environment: $NODE_ENV"
    ls -la .vercel/ || echo "No .vercel directory"
```

## 향후 개선 사항

### 계획된 기능

- [ ] Lighthouse CI 통합으로 성능 측정
- [ ] Slack 알림 지원 추가
- [ ] Staging 환경 배포 지원
- [ ] 자동화된 보안 스캔 (Snyk, CodeQL)
- [ ] Docker 컨테이너 기반 빌드
- [ ] 다중 리전 배포 지원

### 최적화 예정 사항

- [ ] 캐시 전략 개선
- [ ] 병렬 테스트 실행
- [ ] 조건부 배포 (파일 변경 감지)
- [ ] 성능 회귀 감지
- [ ] 자동 버전 태깅
