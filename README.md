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

## 📚 문서

- [개발 워크플로우](docs/project/DEVELOPMENT_WORKFLOW.md) ⭐ **필수 읽기**
- [Vercel 배포 가이드](docs/vercel/VERCEL_BUILD_FIX.md)
- [환경 변수 설정](docs/guides/SUPABASE_ENV_GUIDE.md)
- [보안 가이드](docs/guides/SECURITY_CLEANUP.md)
- [작업 로그](docs/project/worklog.md)

## 🔒 보안

### Public 저장소 보안
- 🔐 이 프로젝트는 **Public 저장소**로 운영됩니다
- 🚫 환경 변수는 절대 커밋하지 마세요
- ✅ 모든 민감 정보는 GitHub Secrets에 저장됩니다
- 📝 `.env.local` 파일은 .gitignore에 포함되어 있습니다
- 🛡️ 보안 이슈 발견 시 [Security 탭](.github/SECURITY.md)에서 비공개 보고

### 자동 보안 스캔
- CodeQL 자동 분석 (매일)
- Trivy 취약점 스캔
- Secret 노출 감지
- 의존성 취약점 모니터링

## 🚦 Merge Queue 시스템

### 작동 방식
모든 Pull Request는 GitHub Merge Queue를 통해 자동으로 병합됩니다:
1. PR 리뷰 및 승인
2. Merge Queue에 추가
3. 최신 main 브랜치와 자동 병합 테스트
4. 모든 테스트 통과 시 자동 병합

### 장점
- ✅ 병합 충돌 자동 해결
- ✅ main 브랜치 안정성 보장
- ✅ Race condition 방지
- ✅ 빌드 실패 최소화

## 🤝 기여하기

프로젝트에 기여하고 싶으신가요? [기여 가이드](CONTRIBUTING.md)를 참고해 주세요.

### 빠른 시작
1. Fork & Clone
2. 브랜치 생성 (`feature/기능명`)
3. 커밋 (`feat: 새로운 기능`)
4. Pull Request 생성
5. Merge Queue에서 자동 병합

## 📞 문의

- 웹사이트: [dduksang.com](https://dduksang.com)
- 이메일: contact@dduksang.com

---

© 2024 떡상연구소. All rights reserved.# Mon Jul 28 16:26:57 KST 2025
