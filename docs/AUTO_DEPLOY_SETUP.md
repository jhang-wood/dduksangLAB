# 🚀 자동 배포 설정 가이드

## 현재 문제

코드 수정 후 dduksang.com에 자동으로 반영되지 않는 이유:

- GitHub와 Vercel 간의 자동 배포가 설정되지 않음
- 수동으로 `deploy.sh` 스크립트를 실행해야만 배포됨

## 해결 방법

### 방법 1: Vercel 대시보드에서 GitHub 연동 (권장) ⭐

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard 로그인

2. **프로젝트 설정 이동**
   - dduksangLAB 프로젝트 클릭
   - Settings 탭 이동

3. **Git Integration 설정**
   - Git Integration 섹션 찾기
   - "Connect Git Repository" 클릭
   - GitHub 계정 연결
   - `jhang-wood/dduksangLAB` 저장소 선택

4. **자동 배포 설정**
   - Production Branch: `main` 또는 `master` 설정
   - Auto-deploy on push: 활성화

### 방법 2: GitHub Actions 사용 (이미 설정함)

`.github/workflows/deploy.yml` 파일을 생성했습니다.
이제 GitHub Secrets를 설정해야 합니다:

1. **GitHub Repository Settings**
   - https://github.com/jhang-wood/dduksangLAB/settings/secrets/actions

2. **다음 Secrets 추가**

   ```
   VERCEL_TOKEN: (Vercel 대시보드에서 생성)
   VERCEL_ORG_ID: team_M9KekmKYwjOPaxOjjBbzRCMI
   VERCEL_PROJECT_ID: prj_9PxVrXKpdbe9JYiAaTVhVWCAIIsW
   ```

3. **Vercel Token 생성 방법**
   - https://vercel.com/account/tokens
   - "Create Token" 클릭
   - 이름 입력 (예: github-actions)
   - 생성된 토큰을 복사하여 GitHub Secrets에 추가

### 방법 3: Vercel CLI로 직접 연동

```bash
# 프로젝트 디렉토리에서 실행
cd /home/qwg18/work/dduksangLAB

# Vercel에 로그인
npx vercel login

# Git 연동 설정
npx vercel git connect

# 자동 배포 확인
npx vercel --prod
```

## 자동 배포 작동 방식

설정 완료 후:

1. 코드 수정
2. `git add .`
3. `git commit -m "변경사항"`
4. `git push origin main`
5. **자동으로 Vercel이 감지하고 배포 시작**
6. 2-3분 후 dduksang.com에 반영

## 배포 상태 확인

### Vercel 대시보드

- https://vercel.com/dashboard
- 실시간 배포 상태 확인 가능

### GitHub Actions (방법 2 사용 시)

- https://github.com/jhang-wood/dduksangLAB/actions
- 워크플로우 실행 상태 확인

### 커맨드라인

```bash
npx vercel ls
```

## 문제 해결

### 자동 배포가 안 될 때

1. Vercel 대시보드에서 Git Integration 확인
2. GitHub 저장소 권한 확인
3. Branch 이름 확인 (main vs master)

### 빌드 실패 시

1. 로컬에서 `npm run build` 테스트
2. 환경 변수 설정 확인 (Vercel 대시보드)
3. 빌드 로그 확인

## 환경 변수 관리

Vercel 대시보드에서 환경 변수 설정:

1. Settings → Environment Variables
2. 필요한 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - 기타 필요한 환경 변수

## 추가 팁

### 빠른 배포 확인

```bash
# 최신 배포 URL 확인
npx vercel inspect [deployment-url]

# 배포 로그 확인
npx vercel logs [deployment-url]
```

### 도메인 연결

1. Vercel 대시보드 → Settings → Domains
2. dduksang.com 추가
3. DNS 설정 업데이트

---

✅ 이제 코드를 푸시하면 자동으로 dduksang.com에 반영됩니다!
