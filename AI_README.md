# 떡상연구소 (dduksangLAB) - AI 작업 가이드

## 🎯 프로젝트 개요
- **기술 스택**: Next.js 14, TypeScript, Supabase, Tailwind CSS
- **주요 기능**: AI 트렌드 분석, 온라인 강의, 커뮤니티
- **URL**: https://www.dduksang.kr

## 📁 핵심 디렉토리 구조
```
app/                    # Next.js 앱 라우터
├── admin/             # 관리자 페이지
├── ai-trends/         # AI 트렌드 페이지
├── api/               # API 라우트
├── auth/              # 인증 관련
├── community/         # 커뮤니티
├── lectures/          # 강의 관련
└── payment/           # 결제 관련

components/            # React 컴포넌트
├── Header.tsx         # 헤더
├── Footer.tsx         # 푸터
└── PaymentButton.tsx  # 결제 버튼

lib/                   # 유틸리티
├── supabase.ts       # Supabase 클라이언트
└── payapp.ts         # 결제 연동

supabase/             # DB 스키마
└── migrations/       # 마이그레이션 파일
```

## 🚀 주요 명령어
```bash
npm run dev      # 개발 서버 시작 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # 코드 검사
```

## 💡 AI 작업 시 주의사항
1. **TypeScript 엄격 모드**: 타입 안전성 필수
2. **Supabase RLS**: Row Level Security 정책 확인
3. **환경 변수**: .env.local 파일 필요
4. **Tailwind CSS**: 유틸리티 클래스 사용

## 🔧 자주 수정하는 파일
- `app/page.tsx` - 메인 페이지
- `app/api/*/route.ts` - API 엔드포인트
- `components/*.tsx` - UI 컴포넌트
- `lib/supabase.ts` - DB 연결 설정