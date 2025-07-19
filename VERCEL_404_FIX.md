# Vercel DEPLOYMENT_NOT_FOUND 오류 해결 가이드

## 문제 상황
- Vercel에서 404 NOT_FOUND 오류 발생
- Code: `DEPLOYMENT_NOT_FOUND`
- ID: `icn1::zszkr-1752908364269-97642775ce69`

## 해결 방법

### 1. Vercel 대시보드 확인
1. https://vercel.com 로그인
2. dduksangLAB 프로젝트가 있는지 확인
3. 프로젝트가 없다면 새로 생성 필요

### 2. 프로젝트 상태 확인
프로젝트가 있다면:
1. **Deployments** 탭 확인
2. 배포 상태 확인 (Success/Failed/Building)
3. 실패했다면 로그 확인

### 3. 도메인 연결 확인
1. Settings → Domains
2. dduksang.com이 연결되어 있는지 확인
3. 없다면 "Add Domain" 클릭하여 추가

### 4. 도메인 추가 방법
1. Settings → Domains → Add Domain
2. `dduksang.com` 입력
3. DNS 설정 안내가 나오면:

#### Cloudflare DNS 설정
Cloudflare 대시보드에서:
1. dduksang.com 도메인 선택
2. DNS 설정으로 이동
3. 다음 레코드 추가/수정:

```
Type: A
Name: @
Value: 76.76.21.21
Proxy: OFF (DNS only)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
Proxy: OFF (DNS only)
```

### 5. 빌드 실패 시
1. Build Logs 확인
2. 환경 변수 누락 확인
3. 다음 명령으로 로컬 테스트:
```bash
npm install
npm run build
```

### 6. 강제 재배포
1. Deployments 탭
2. 최신 배포의 "..." 메뉴
3. "Redeploy" 클릭
4. "Use existing Build Cache" 체크 해제

### 7. 프로젝트가 완전히 없다면
1. "Add New..." → "Project"
2. GitHub 저장소 import
3. 환경 변수 설정 (VERCEL_ENV_SETUP.md 참조)
4. Deploy

## 즉시 확인 사항
1. https://vercel.com/[your-username]/dduksanglab 접속
2. 프로젝트 존재 여부 확인
3. 최신 배포 상태 확인
4. 도메인 연결 상태 확인