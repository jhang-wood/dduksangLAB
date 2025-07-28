# 📋 dduksangLAB 개선 작업 TODO 리스트

> 각 작업은 순차적으로 진행되며, 완료된 항목은 체크박스에 표시합니다.
> 작업 진행 상황은 날짜와 함께 기록합니다.

## 🎯 작업 원칙
- 한 번에 하나의 작업만 진행
- 각 작업은 테스트 가능한 단위로 분할
- 완료 후 즉시 테스트 및 검증
- 문제 발생 시 즉시 문서화

---

## Phase 1: 기초 개선 (1-2일)

### 1.1 개발 환경 정리

#### TypeScript 설정 강화
- [x] tsconfig.json에서 strict 모드 활성화
  - [x] `"strict": true` 설정 추가
  - [x] `"noUnusedLocals": true` 추가
  - [x] `"noUnusedParameters": true` 추가
  - [x] `"noImplicitAny": true` 추가
- [ ] TypeScript 컴파일 에러 확인 (`npm run build`)
- [ ] 각 파일별 TypeScript 에러 수정
  - [ ] app/layout.tsx 타입 에러 수정
  - [ ] app/page.tsx 타입 에러 수정
  - [ ] components/ 폴더 내 모든 컴포넌트 타입 수정
  - [ ] lib/ 폴더 내 유틸리티 함수 타입 수정
  - [ ] app/api/ 폴더 내 API 라우트 타입 수정
- [ ] next.config.js에서 `ignoreBuildErrors: false`로 변경
- [ ] 빌드 테스트 및 검증

#### ESLint 설정 및 수정
- [ ] .eslintrc.json 파일 생성 및 규칙 설정
- [ ] ESLint 실행 및 에러 목록 생성 (`npm run lint`)
- [ ] 각 파일별 ESLint 에러 수정
  - [ ] 사용하지 않는 import 제거
  - [ ] 변수명 규칙 통일
  - [ ] 코드 포맷팅 규칙 적용
- [ ] next.config.js에서 `ignoreDuringBuilds: false`로 변경
- [ ] 린트 테스트 및 검증

#### console.log 정리
- [ ] lib/logger.ts 유틸리티 파일 생성
  ```typescript
  export const logger = {
    log: (...args: any[]) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(...args)
      }
    },
    error: console.error,
    warn: console.warn,
  }
  ```
- [ ] 각 파일의 console.log를 logger로 교체 (34개 파일)
  - [ ] app/api/ai-trends/collect/route.ts
  - [ ] app/admin/ai-trends/[id]/edit/page.tsx
  - [ ] app/admin/ai-trends/new/page.tsx
  - [ ] app/admin/ai-trends/page.tsx
  - [ ] app/ai-trends/[slug]/page.tsx
  - [ ] app/ai-trends/[slug]/page-client.tsx
  - [ ] app/ai-trends/page.tsx
  - [ ] app/api/cron/collect-ai-trends/route.ts
  - [ ] app/api/ai-trends/slug/[slug]/route.ts
  - [ ] app/api/ai-trends/[id]/route.ts
  - [ ] app/api/ai-trends/route.ts
  - [ ] app/community/page.tsx
  - [ ] components/Header.tsx
  - [ ] app/admin/settings/page.tsx
  - [ ] app/admin/stats/page.tsx
  - [ ] app/admin/users/page.tsx
  - [ ] app/sites/page.tsx
  - [ ] lib/auth-context.tsx
  - [ ] app/mypage/page.tsx
  - [ ] components/AdminDebug.tsx
  - [ ] scripts/create-admin.js
  - [ ] app/community/[category]/[id]/page.tsx
  - [ ] app/community/write/page.tsx
  - [ ] app/admin/lectures/page.tsx
  - [ ] app/lectures/[id]/page.tsx
  - [ ] lib/supabase.ts
  - [ ] app/lectures/[id]/preview/page.tsx
  - [ ] app/api/payment/callback/route.ts
  - [ ] app/api/payment/route.ts
  - [ ] lib/payment/payapp.ts
  - [ ] lib/payapp.ts
  - [ ] app/api/payment/webhook/route.ts
  - [ ] app/payment/success/page.tsx
  - [ ] components/PaymentButton.tsx
- [ ] 프로덕션 빌드에서 console.log 제거 확인

#### 환경 변수 검증 유틸리티
- [ ] lib/env.ts 파일 생성
  ```typescript
  export const getEnvVar = (key: string): string => {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`)
    }
    return value
  }
  ```
- [ ] 필수 환경 변수 목록 정의
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] NEXT_PUBLIC_TOSS_CLIENT_KEY
  - [ ] TOSS_SECRET_KEY
  - [ ] GEMINI_API_KEY
  - [ ] CRON_SECRET
- [ ] 각 파일에서 process.env 직접 접근을 getEnvVar로 교체
- [ ] 환경 변수 검증 테스트

### 1.2 보안 강화

#### 환경 변수 분리
- [ ] 클라이언트용 환경 변수 파일 생성 (.env.client)
- [ ] 서버용 환경 변수 파일 생성 (.env.server)
- [ ] 환경 변수 로더 스크립트 작성
- [ ] SUPABASE_SERVICE_ROLE_KEY가 클라이언트 코드에서 사용되지 않도록 검증
- [ ] 각 API 라우트에서 서버 전용 환경 변수 사용 확인

#### API 라우트 보안
- [ ] lib/middleware/auth.ts 미들웨어 생성
- [ ] 인증이 필요한 API 라우트 식별
  - [ ] /api/admin/* 라우트
  - [ ] /api/payment/* 라우트
  - [ ] /api/ai-trends/* (일부)
- [ ] 각 보호된 라우트에 인증 미들웨어 적용
- [ ] 권한 검증 로직 추가 (관리자, 일반 사용자)
- [ ] API 응답 에러 처리 표준화

#### CORS 및 Rate Limiting
- [ ] middleware.ts 파일 생성
- [ ] CORS 정책 설정
  - [ ] 허용된 도메인 목록 정의
  - [ ] API 라우트별 CORS 규칙 설정
- [ ] Rate Limiting 구현
  - [ ] IP 기반 요청 제한
  - [ ] API 키 기반 요청 제한
  - [ ] 라우트별 제한 규칙 설정
- [ ] 보안 헤더 추가 (CSP, X-Frame-Options 등)

---

## Phase 2: 성능 최적화 (2-3일)

### 2.1 이미지 최적화

#### Next.js Image 컴포넌트 적용
- [ ] public/images 폴더 구조 정리
- [ ] 모든 img 태그를 Next.js Image 컴포넌트로 교체
  - [ ] 메인 페이지 이미지
  - [ ] 강의 썸네일 이미지
  - [ ] 프로필 이미지
  - [ ] 로고 이미지
- [ ] 이미지 크기 및 비율 최적화
- [ ] placeholder blur 이미지 생성

#### 이미지 포맷 최적화
- [ ] 이미지 변환 스크립트 작성 (WebP 변환)
- [ ] 기존 이미지 백업
- [ ] 모든 이미지를 WebP 포맷으로 변환
- [ ] fallback 이미지 설정
- [ ] next.config.js의 `unoptimized: false`로 변경

#### Lazy Loading 구현
- [ ] 스크롤 기반 이미지 로딩 구현
- [ ] Intersection Observer API 활용
- [ ] 로딩 스피너 컴포넌트 추가
- [ ] 성능 측정 및 검증

### 2.2 번들 최적화

#### Bundle Analyzer 설정
- [ ] @next/bundle-analyzer 패키지 설치
- [ ] next.config.js에 analyzer 설정 추가
- [ ] 번들 분석 스크립트 추가
- [ ] 초기 번들 크기 측정 및 기록

#### 종속성 정리
- [ ] package.json 종속성 검토
- [ ] 사용하지 않는 패키지 식별
- [ ] 대체 가능한 무거운 라이브러리 확인
- [ ] 불필요한 종속성 제거
- [ ] package-lock.json 재생성

#### 코드 분할
- [ ] Dynamic import가 필요한 컴포넌트 식별
- [ ] 무거운 컴포넌트 dynamic import로 변경
- [ ] 라우트별 코드 분할 구현
- [ ] 번들 크기 재측정 및 비교

---

## Phase 3: 테스트 환경 구축 (3-4일)

### 3.1 테스트 프레임워크 설정

#### Jest 설정
- [ ] Jest 및 관련 패키지 설치
- [ ] jest.config.js 생성
- [ ] 테스트 환경 설정 (jsdom)
- [ ] TypeScript 지원 설정
- [ ] 테스트 스크립트 추가

#### React Testing Library 설정
- [ ] @testing-library/react 설치
- [ ] @testing-library/jest-dom 설치
- [ ] 테스트 유틸리티 설정
- [ ] 기본 테스트 헬퍼 함수 작성

#### 기본 테스트 작성
- [ ] 컴포넌트 테스트
  - [ ] Header 컴포넌트 테스트
  - [ ] Footer 컴포넌트 테스트
  - [ ] 주요 페이지 컴포넌트 테스트
- [ ] 유틸리티 함수 테스트
  - [ ] logger 테스트
  - [ ] env 유틸리티 테스트
- [ ] API 라우트 테스트
  - [ ] 인증 관련 API 테스트
  - [ ] 데이터 조회 API 테스트

#### E2E 테스트 설정
- [ ] Playwright 설치 및 설정
- [ ] playwright.config.ts 생성
- [ ] 기본 E2E 테스트 시나리오 작성
  - [ ] 로그인 플로우 테스트
  - [ ] 강의 구매 플로우 테스트
  - [ ] 커뮤니티 글 작성 테스트
- [ ] 테스트 실행 및 검증

### 3.2 CI/CD 파이프라인

#### GitHub Actions 설정
- [ ] .github/workflows 폴더 생성
- [ ] ci.yml 워크플로우 파일 생성
- [ ] 빌드 단계 설정
- [ ] 테스트 단계 설정
- [ ] 린트 단계 설정

#### 자동 테스트
- [ ] PR 생성 시 자동 테스트 실행
- [ ] 테스트 커버리지 리포트 생성
- [ ] 테스트 실패 시 PR 차단
- [ ] 성공/실패 알림 설정

#### Vercel 통합
- [ ] Vercel 프로젝트 연결
- [ ] Preview 배포 자동화
- [ ] 프로덕션 배포 규칙 설정
- [ ] 배포 후 검증 스크립트

---

## Phase 4: 아키텍처 개선 (4-5일)

### 4.1 컴포넌트 구조 개선

#### 공통 컴포넌트 라이브러리
- [ ] components/ui 폴더 생성
- [ ] 기본 UI 컴포넌트 작성
  - [ ] Button 컴포넌트
  - [ ] Input 컴포넌트
  - [ ] Card 컴포넌트
  - [ ] Modal 컴포넌트
  - [ ] Toast 컴포넌트
- [ ] 컴포넌트 props 타입 정의
- [ ] 컴포넌트 문서화

#### Storybook 설정
- [ ] Storybook 설치 및 설정
- [ ] 각 컴포넌트별 스토리 작성
- [ ] 컴포넌트 상태별 시각화
- [ ] 인터랙션 테스트 추가

#### 디자인 시스템
- [ ] 디자인 토큰 정의 (색상, 폰트, 간격)
- [ ] 테마 시스템 구현
- [ ] 다크/라이트 모드 지원
- [ ] 디자인 가이드 문서 작성

### 4.2 상태 관리 개선

#### Context API 최적화
- [ ] 현재 Context 사용 패턴 분석
- [ ] Context 분할 (인증, 테마, 데이터)
- [ ] 불필요한 리렌더링 방지
- [ ] Context Provider 최적화

#### 상태 관리 라이브러리 검토
- [ ] Zustand vs Jotai 비교 분석
- [ ] POC 구현
- [ ] 마이그레이션 계획 수립
- [ ] 점진적 마이그레이션

#### 서버 상태 관리
- [ ] React Query/SWR 도입 검토
- [ ] API 캐싱 전략 수립
- [ ] 낙관적 업데이트 구현
- [ ] 에러 처리 표준화

---

## Phase 5: 모니터링 및 분석 (5-6일)

### 5.1 에러 트래킹

#### Sentry 통합
- [ ] Sentry 계정 및 프로젝트 생성
- [ ] @sentry/nextjs 설치
- [ ] Sentry 초기화 설정
- [ ] 소스맵 업로드 설정
- [ ] 환경별 설정 분리

#### 에러 처리
- [ ] 전역 에러 경계 구현
- [ ] API 에러 처리 표준화
- [ ] 사용자 친화적 에러 페이지
- [ ] 에러 리포팅 자동화

#### 사용자 피드백
- [ ] 피드백 위젯 구현
- [ ] 에러 발생 시 자동 리포트
- [ ] 사용자 컨텍스트 수집
- [ ] 피드백 대시보드 구축

### 5.2 성능 모니터링

#### Web Vitals 측정
- [ ] Core Web Vitals 측정 설정
- [ ] 커스텀 메트릭 정의
- [ ] 성능 데이터 수집
- [ ] 성능 기준선 설정

#### Analytics 통합
- [ ] Google Analytics 4 설정
- [ ] 커스텀 이벤트 정의
- [ ] 사용자 행동 추적
- [ ] 전환율 측정

#### 모니터링 대시보드
- [ ] 실시간 성능 모니터링
- [ ] 에러율 추적
- [ ] 사용자 세션 분석
- [ ] 주간/월간 리포트 자동화

---

## 🎉 완료 기준

각 Phase가 완료되면:
1. 모든 체크박스가 체크됨
2. 테스트가 모두 통과함
3. 빌드가 성공적으로 완료됨
4. 성능 지표가 개선됨
5. 문서가 업데이트됨

## 📝 진행 상황 기록

### 2024-01-XX
- [ ] 작업 시작
- [ ] Phase 1 시작

---

> 이 TODO 리스트는 지속적으로 업데이트되며, 각 작업의 완료 시간과 발견된 이슈를 기록합니다.