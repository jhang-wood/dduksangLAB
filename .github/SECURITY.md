# 🔐 보안 정책 (Security Policy)

## 📊 지원되는 버전

현재 보안 업데이트가 지원되는 버전:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🚨 취약점 보고

### 보고 방법

이 프로젝트의 보안 취약점을 발견하셨다면, 다음 방법으로 보고해 주세요:

1. **GitHub Security Advisories** (권장)
   - 저장소의 Security 탭 → Report a vulnerability 클릭
   - 비공개로 안전하게 보고할 수 있습니다

2. **이메일 보고**
   - 보안 이슈 전용 이메일로 보고
   - 제목에 [SECURITY] 태그 포함

### ⚠️ 공개 금지 사항

다음 채널에는 보안 취약점을 공개하지 마세요:
- ❌ Public Issues
- ❌ Public Pull Requests  
- ❌ Public Discussions
- ❌ Social Media

### 📝 보고 시 포함 사항

효과적인 취약점 보고를 위해 다음 정보를 포함해 주세요:

1. **취약점 설명**
   - 취약점의 유형
   - 영향을 받는 컴포넌트

2. **재현 단계**
   - 취약점을 재현하는 상세한 단계
   - 필요한 전제 조건

3. **영향 범위**
   - 잠재적 영향
   - 공격 시나리오

4. **환경 정보**
   - Node.js 버전
   - 브라우저 정보
   - OS 정보

## 🛡️ 보안 조치

### 현재 구현된 보안 기능

- ✅ **자동 보안 스캔**: 매일 자동 실행
- ✅ **의존성 관리**: Renovate Bot으로 자동 업데이트
- ✅ **코드 분석**: CodeQL 자동 분석 (Public 저장소)
- ✅ **시크릿 스캔**: TruffleHog로 민감 정보 감지
- ✅ **환경변수 보호**: GitHub Secrets 사용

### 보안 체크리스트

- [ ] 모든 의존성이 최신 버전인지 확인
- [ ] 환경변수가 코드에 노출되지 않았는지 확인
- [ ] API 엔드포인트에 적절한 인증이 있는지 확인
- [ ] 사용자 입력이 적절히 검증되는지 확인
- [ ] HTTPS가 모든 통신에 사용되는지 확인

## 📅 대응 일정

| 심각도 | 초기 대응 | 패치 목표 |
|--------|----------|----------|
| 🔴 Critical | 24시간 이내 | 48시간 이내 |
| 🟠 High | 48시간 이내 | 1주일 이내 |
| 🟡 Medium | 1주일 이내 | 2주일 이내 |
| 🟢 Low | 2주일 이내 | 다음 릴리즈 |

## 🏆 보안 기여자

보안 취약점을 책임감 있게 보고해 주신 분들께 감사드립니다.

## 📚 추가 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [GitHub Security Features](https://github.com/features/security)

---

**마지막 업데이트**: 2025-08-09  
**보안 담당자**: Security Team