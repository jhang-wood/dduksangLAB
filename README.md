# 🚀 떡상연구소 (DDuksangLAB)

AI 시대를 선도하는 개발자 커뮤니티 플랫폼

## 🔧 빠른 시작
- **개발 서버 실행**: `scripts\dev.ps1`
- **빌드**: `scripts\build.ps1`
- **프로덕션 서버**: `scripts\start.ps1`

## 📌 프로젝트 소개

떡상연구소는 AI와 노코드 도구를 활용하여 누구나 쉽게 웹서비스를 만들 수 있도록 돕는 교육 플랫폼입니다.

### 주요 특징
- 🤖 AI 개발 도구 교육
- 🔧 노코드/로우코드 플랫폼 활용법
- 👥 개발자 커뮤니티
- 📚 실전 프로젝트 기반 학습

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Payment**: PayApp Integration

### Deployment
- **Platform**: Vercel
- **Domain**: dduksang.com

## 📁 프로젝트 구조

```
dduksangLAB/
├── app/              # Next.js 14 App Router
├── components/       # React 컴포넌트
├── lib/             # 유틸리티 함수
├── public/          # 정적 파일
├── docs/            # 프로젝트 문서
│   ├── vercel/      # Vercel 배포 가이드
│   ├── guides/      # 개발 가이드
│   └── project/     # 프로젝트 문서
└── supabase/        # Supabase 설정
```

## 🚀 시작하기

### 환경 설정
1. `.env.local` 파일 생성
2. 필요한 환경 변수 설정 (docs/guides/SUPABASE_ENV_GUIDE.md 참조)

### 개발 서버 실행
```bash
npm install
npm run dev
```

### 빌드 및 배포
```bash
npm run build
```

## 🤖 자동화 시스템

dduksangLAB은 각 역할에 특화된 자동화 에이전트들로 구성된 통합 자동화 시스템을 제공합니다.

### 자동화 에이전트

- **QA Agent**: 환경 변수 검증 및 품질 검사
- **Security Agent**: 취약점 스캔 및 보안 검사
- **Performance Agent**: 성능 분석 및 최적화 권장
- **DevOps Agent**: 배포 모니터링 및 건강성 체크

### 실행 명령어

```bash
# 개별 에이전트 실행
npm run automation:qa              # QA 검증
npm run automation:security        # 보안 스캔
npm run automation:performance     # 성능 분석
npm run automation:devops          # 배포 상태 확인

# 통합 워크플로우 실행
npm run automation:workflow:quick  # 빠른 검사 (QA + Security)
npm run automation:workflow:full   # 전체 검사 (모든 에이전트)
npm run test:all                   # 모든 테스트 실행
```

### GitHub Actions 워크플로우

- **CI Pipeline**: PR 및 push 시 자동 QA 검증
- **Security Scan**: 주기적 보안 취약점 검사  
- **Deployment Pipeline**: 배포 시 성능 검증 및 모니터링
- **Full Automation**: 수동/야간 전체 자동화 실행

## 📚 문서

- [개발 워크플로우](docs/project/DEVELOPMENT_WORKFLOW.md) ⭐ **필수 읽기**
- [Vercel 배포 가이드](docs/vercel/VERCEL_BUILD_FIX.md)
- [환경 변수 설정](docs/guides/SUPABASE_ENV_GUIDE.md)
- [보안 가이드](docs/guides/SECURITY_CLEANUP.md)
- [작업 로그](docs/project/worklog.md)

## 🔒 보안

- 환경 변수는 절대 커밋하지 마세요
- `.env.local` 파일은 .gitignore에 포함되어 있습니다
- 민감한 정보는 Vercel 대시보드에서 관리하세요

## 📞 문의

- 웹사이트: [dduksang.com](https://dduksang.com)
- 이메일: contact@dduksang.com

---

© 2024 떡상연구소. All rights reserved.# Mon Jul 28 16:26:57 KST 2025
