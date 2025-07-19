# Supabase 환경 변수 찾기 가이드

## 📍 Supabase 대시보드에서 환경 변수 찾기

### 1단계: Supabase 대시보드 접속
1. https://supabase.com/dashboard 로그인
2. 프로젝트 목록에서 해당 프로젝트 클릭

### 2단계: API 설정으로 이동
1. 왼쪽 사이드바에서 ⚙️ **Settings** 클릭
2. Settings 메뉴에서 **API** 클릭

### 3단계: 환경 변수 복사

#### 🔗 Project URL
- **위치**: 페이지 상단 "Project URL" 섹션
- **변수명**: `NEXT_PUBLIC_SUPABASE_URL`
- **값 예시**: `https://wpzvocfgfwvsxmpckdnu.supabase.co`
- **설명**: Supabase 프로젝트의 기본 URL

#### 🔑 Anon Key (공개 키)
- **위치**: "Project API keys" 섹션의 첫 번째 키
- **라벨**: "anon" "public"
- **변수명**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **특징**: 
  - 매우 긴 문자열 (JWT 토큰)
  - 클라이언트 사이드에서 사용 가능
  - 공개되어도 안전

#### 🔐 Service Role Key (비밀 키)
- **위치**: "Project API keys" 섹션의 두 번째 키
- **라벨**: "service_role" "secret"
- **변수명**: `SUPABASE_SERVICE_ROLE_KEY`
- **특징**:
  - 매우 긴 문자열 (JWT 토큰)
  - ⚠️ **절대 공개하면 안됨**
  - 서버 사이드에서만 사용
  - 눈 아이콘 클릭해서 표시

## 🚨 주의사항

1. **Service Role Key는 절대 GitHub에 커밋하지 마세요**
2. **NEXT_PUBLIC_ 접두사가 붙은 변수만 클라이언트에서 사용 가능**
3. **환경 변수 값을 복사할 때 앞뒤 공백이 없도록 주의**

## ✅ 확인 방법

환경 변수가 제대로 설정되었는지 확인:

```bash
# Vercel CLI가 설치되어 있다면
vercel env pull

# 또는 Vercel 대시보드에서
Settings → Environment Variables → 각 변수 확인
```

## 🔧 문제 해결

### "Project URL not found" 오류
- Supabase 대시보드의 URL을 다시 확인
- https:// 포함 전체 URL 복사
- 마지막에 / 없이 입력

### 인증 오류
- Anon Key와 Service Role Key를 바꿔 입력하지 않았는지 확인
- JWT 토큰 전체를 복사했는지 확인 (매우 긴 문자열)

## 📝 백업된 환경 변수

프로젝트의 백업 파일에서도 확인 가능:
```
~/.config/env-backup/dduksanglab.env
```