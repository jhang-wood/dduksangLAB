# 🚀 떡상연구소 배포 워크플로우

## 📋 현재 설정
- **도메인**: dduksang.com
- **호스팅**: Vercel
- **저장소**: github.com/jhang-wood/dduksangLAB
- **메인 브랜치**: main

## 🔧 코드 변경 후 배포 프로세스

### 1. 변경사항 확인
```bash
git status
```

### 2. 변경사항 추가
```bash
git add .
```

### 3. 커밋 생성
```bash
git commit -m "feat: 히어로 섹션 개선"
```

### 4. GitHub로 푸시
```bash
git push origin main
```

### 5. 자동 배포 (Vercel)
- 푸시 후 2-3분 내 자동 배포
- 배포 상태: https://vercel.com/dashboard
- 라이브 사이트: https://dduksang.com

## 🛠️ 빠른 배포 스크립트

### 옵션 1: auto-deploy.sh 사용
```bash
./auto-deploy.sh "커밋 메시지"
```

### 옵션 2: 수동 명령어
```bash
git add . && git commit -m "변경사항" && git push origin main
```

## 📊 배포 상태 확인

### Vercel 대시보드
- https://vercel.com/dashboard
- 실시간 빌드 로그 확인 가능

### 도메인 확인
- https://dduksang.com (프로덕션)
- https://dduksanglab.vercel.app (Vercel 기본 도메인)

## ⚠️ 주의사항

1. **환경 변수**: Vercel 대시보드에서 설정
2. **빌드 테스트**: 푸시 전 `npm run build` 확인
3. **브랜치**: main 브랜치만 자동 배포됨

## 🔍 문제 해결

### 빌드 실패 시
```bash
npm run build  # 로컬 테스트
npm run lint   # 린트 에러 확인
```

### 배포 안 될 때
1. Vercel 대시보드에서 빌드 로그 확인
2. GitHub Actions 상태 확인
3. 환경 변수 설정 확인