# 관리자 메뉴 활성화 가이드

## 🔍 문제 진단 방법

### 1. 브라우저 콘솔 확인

1. F12를 눌러 개발자 도구 열기
2. Console 탭 확인
3. 다음과 같은 로그가 표시되어야 함:
   - `[Auth] Fetching profile for user: ...`
   - `[Auth] Profile fetched: ...`
   - `[Auth] User role: ...`
   - `[Auth] isAdmin calculation: ...`
   - `[Header] Auth state: ...`
   - `[Header] Nav items: ...`

### 2. 관리자 권한 부여 단계

#### 방법 1: 마이페이지에서 직접 설정

1. 로그인 후 마이페이지(`/mypage`) 이동
2. 프로필 탭에서 이메일 아래 확인
3. "현재 역할: user" 텍스트 확인
4. "🔧 관리자 권한 부여 (임시)" 빨간 버튼 클릭
5. 성공 알림 확인 후 페이지 자동 새로고침
6. 상단 메뉴에 "관리" 메뉴 표시 확인

#### 방법 2: Supabase 대시보드에서 직접 수정

1. Supabase 대시보드 접속
2. Table Editor → profiles 테이블
3. 해당 사용자 찾기
4. role 컬럼을 'admin'으로 변경
5. Save 클릭
6. 사이트 새로고침

### 3. 문제 해결 체크리스트

#### ✅ 프로필이 없는 경우

- 콘솔에 `[Auth] Profile not found, creating new profile...` 표시
- 자동으로 프로필 생성됨
- 생성 후 관리자 권한 부여 버튼 사용 가능

#### ✅ 관리자 권한이 있는데 메뉴가 안 보이는 경우

1. 콘솔에서 `[Auth] User role:` 확인
2. `admin`이 아닌 경우 → 프로필 업데이트 필요
3. `admin`인 경우 → 캐시 문제일 수 있음
   - Ctrl + Shift + R (강제 새로고침)
   - 로그아웃 후 다시 로그인

#### ✅ 버튼 클릭 후 에러가 발생하는 경우

1. 콘솔 에러 메시지 확인
2. Supabase RLS 정책 확인
3. profiles 테이블 권한 확인

### 4. 디버깅 로그 해석

```javascript
// 정상적인 경우
[Auth] Fetching profile for user: abc123...
[Auth] Profile fetched: {id: "abc123", role: "admin", ...}
[Auth] User role: admin
[Auth] isAdmin calculation: {userProfile: {...}, role: "admin", isAdmin: true}
[Header] Auth state: {user: "[ADMIN_EMAIL]", role: "admin", isAdmin: true}
[Header] Nav items: [..., {id: "admin", label: "관리", href: "/admin"}]
```

```javascript
// 문제가 있는 경우
[Auth] Error fetching profile: {code: "PGRST116", ...}  // 프로필 없음
[Auth] User role: undefined  // role이 설정되지 않음
[Auth] isAdmin calculation: {userProfile: null, isAdmin: false}  // 관리자 아님
```

### 5. 최종 확인 사항

1. **프로필 존재 여부**: profiles 테이블에 해당 user ID의 레코드 존재
2. **role 값**: 'admin' (정확한 문자열)
3. **페이지 새로고침**: 권한 변경 후 반드시 필요
4. **캐시 문제**: 브라우저 캐시 삭제 또는 시크릿 모드 테스트

## 🎯 빠른 해결 방법

가장 빠른 방법은:

1. 마이페이지 → 빨간색 "🔧 관리자 권한 부여 (임시)" 버튼 클릭
2. 페이지 자동 새로고침 대기
3. 상단 메뉴에 "관리" 확인

문제가 지속되면 콘솔 로그를 확인하여 정확한 원인을 파악하세요.
