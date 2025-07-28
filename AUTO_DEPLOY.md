# 🚀 자동 배포 프로세스

## 현재 설정
- **GitHub 토큰**: ✅ 설정 완료
- **Vercel 연동**: ✅ 자동 배포 활성화
- **도메인**: https://dduksang.com

## Claude가 자동으로 수행하는 작업

1. **코드 수정** 완료 후
2. **자동으로 실행**:
   ```bash
   git add .
   git commit -m "feat/fix/etc: 변경 내용 설명"
   git push origin main
   ```
3. **Vercel 자동 배포** (2-3분)
4. **배포 완료 알림**

## 배포 확인
- 라이브 사이트: https://dduksang.com
- Vercel 대시보드: https://vercel.com/dashboard

---
*이제 코드 변경만 요청하시면 배포까지 자동으로 처리됩니다!*