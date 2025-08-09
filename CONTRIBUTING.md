# 🤝 기여 가이드 (Contributing Guide)

dduksangLAB 프로젝트에 기여해 주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 📋 목차

- [행동 강령](#행동-강령)
- [기여 방법](#기여-방법)
- [개발 환경 설정](#개발-환경-설정)
- [Pull Request 프로세스](#pull-request-프로세스)
- [Merge Queue 시스템](#merge-queue-시스템)
- [커밋 메시지 규칙](#커밋-메시지-규칙)
- [코드 스타일](#코드-스타일)
- [테스트 작성](#테스트-작성)

## 📜 행동 강령

- 모든 참여자는 서로를 존중하고 배려해야 합니다
- 건설적인 피드백을 주고받습니다
- 다양성을 존중하고 포용적인 환경을 만듭니다

## 🎯 기여 방법

### 1. Issue 생성
문제를 발견하거나 새로운 기능을 제안하려면:
1. 기존 Issue가 있는지 먼저 확인
2. 없다면 새로운 Issue 생성
3. 명확한 제목과 상세한 설명 작성

### 2. Fork & Clone
```bash
# 저장소 Fork (GitHub에서)
# Fork한 저장소 Clone
git clone https://github.com/YOUR-USERNAME/dduksangLAB.git
cd dduksangLAB
```

### 3. 브랜치 생성
```bash
# 기능 개발
git checkout -b feature/기능명

# 버그 수정
git checkout -b fix/버그명

# 문서 수정
git checkout -b docs/문서명
```

## 🛠️ 개발 환경 설정

### DevContainer 사용 (권장)
```bash
# VS Code에서 프로젝트 열기
code .

# "Reopen in Container" 선택
# 자동으로 개발 환경 구성됨
```

### 로컬 환경 설정
```bash
# Node.js 18+ 필요
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 개발 서버 실행
npm run dev
```

## 🚀 Pull Request 프로세스

### 1. 코드 작성 및 테스트
```bash
# 린트 검사
npm run lint

# 타입 체크
npm run type-check

# 테스트 실행
npm test

# 빌드 테스트
npm run build
```

### 2. 커밋 및 푸시
```bash
# 변경사항 추가
git add .

# 커밋 (규칙 준수)
git commit -m "feat: 새로운 기능 추가"

# Fork한 저장소에 푸시
git push origin feature/기능명
```

### 3. Pull Request 생성
1. GitHub에서 "New Pull Request" 클릭
2. 템플릿에 따라 PR 설명 작성
3. 관련 Issue 연결 (#이슈번호)
4. 리뷰어 지정

### 4. 코드 리뷰
- 리뷰어의 피드백에 응답
- 필요시 코드 수정 후 추가 커밋
- 모든 체크가 통과할 때까지 수정

## 🔄 Merge Queue 시스템

### 작동 방식
1. **PR 승인**: 리뷰어가 PR 승인
2. **Queue 추가**: "Add to merge queue" 버튼 클릭
3. **자동 테스트**: 최신 main 브랜치와 병합 테스트
4. **자동 병합**: 모든 테스트 통과 시 자동 병합

### 장점
- ✅ 병합 충돌 자동 해결
- ✅ 항상 최신 코드와 테스트
- ✅ main 브랜치 안정성 보장
- ✅ Race condition 방지

### 실패 시
- Queue에서 자동 제거
- 텔레그램으로 알림 발송
- 문제 해결 후 다시 Queue에 추가

## 📝 커밋 메시지 규칙

### 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 패키지 매니저 등

### 예시
```bash
feat(auth): 소셜 로그인 기능 추가

Google OAuth를 통한 로그인 기능을 구현했습니다.
- Google OAuth 2.0 연동
- 사용자 프로필 자동 생성
- 기존 계정과 연동 기능

Closes #123
```

## 🎨 코드 스타일

### TypeScript/JavaScript
- ESLint 규칙 준수
- Prettier 포맷팅 적용
- 함수형 컴포넌트 사용 (React)
- TypeScript 타입 명시

### 네이밍 규칙
- 컴포넌트: PascalCase
- 함수/변수: camelCase  
- 상수: UPPER_SNAKE_CASE
- 파일명: kebab-case

## 🧪 테스트 작성

### 단위 테스트
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // 테스트 코드
  });
});
```

### E2E 테스트 (Playwright)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## 🏆 기여자 인정

- 모든 기여자는 README.md에 기록됩니다
- 주요 기여자는 CONTRIBUTORS.md에 별도 언급
- 정기적으로 기여자 감사 이벤트 진행

## 📚 추가 자료

- [프로젝트 구조](./docs/project/README.md)
- [API 문서](./docs/API.md)
- [보안 정책](./.github/SECURITY.md)

## 💬 도움이 필요하신가요?

- Issue 생성하여 질문
- Discussions 탭에서 토론
- 텔레그램 커뮤니티 참여 (링크는 별도 공유)

---

**감사합니다!** 여러분의 기여가 프로젝트를 더 좋게 만듭니다. 🚀