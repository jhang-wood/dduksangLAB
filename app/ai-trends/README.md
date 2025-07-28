# AI 트렌드 기능 가이드

## 개요
AI 트렌드 페이지는 매일 자동으로 3개의 AI 관련 트렌드를 수집하여 중학생도 이해할 수 있는 쉬운 언어로 제공하는 기능입니다.

## 주요 기능

### 1. 자동 트렌드 수집
- 매일 오전 9시 (UTC)에 자동으로 3개의 AI 트렌드 생성
- Google Gemini API를 사용하여 최신 트렌드 콘텐츠 생성 (무료 티어 사용 가능)
- 중복 방지를 위한 콘텐츠 해시 체크

### 2. 카테고리
- AI 기술
- AI 도구
- AI 활용
- AI 비즈니스
- AI 교육

### 3. SEO 최적화
- 동적 메타데이터 생성
- 사이트맵 자동 업데이트
- SEO 친화적 URL (slug)

### 4. 관리자 기능
- 트렌드 생성/수정/삭제
- 발행 상태 관리
- 추천 트렌드 설정
- 수동 트렌드 수집

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# Gemini API (필수)
GEMINI_API_KEY=your_gemini_api_key

# Cron Secret (필수)
CRON_SECRET=your_secure_random_string
```

### Gemini API 키 발급 방법
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. API 키 복사하여 환경 변수에 설정

**무료 티어 제한**:
- 분당 60회 요청 (하루 3개 생성에는 충분)
- 일일 1,500회 요청
- 완전 무료

## 데이터베이스 마이그레이션

Supabase에서 다음 SQL 마이그레이션을 실행하세요:
```bash
/supabase/migrations/create_ai_trends_table.sql
```

## 썸네일 이미지

기본 썸네일 이미지를 다음 경로에 추가하세요:
- `/public/images/ai-trends/default-ai-기술.jpg`
- `/public/images/ai-trends/default-ai-도구.jpg`
- `/public/images/ai-trends/default-ai-활용.jpg`
- `/public/images/ai-trends/default-ai-비즈니스.jpg`
- `/public/images/ai-trends/default-ai-교육.jpg`

## 사용 방법

### 사용자
1. `/ai-trends` 페이지에서 최신 AI 트렌드 확인
2. 카테고리별 필터링 가능
3. 상세 페이지에서 전체 내용 확인

### 관리자
1. `/admin/ai-trends`에서 트렌드 관리
2. "AI 트렌드 수집" 버튼으로 수동 수집 가능
3. 개별 트렌드 수정/삭제 가능