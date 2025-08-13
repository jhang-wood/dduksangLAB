# TypeScript 기술 부채 관리 계획

## 현재 상황 (2024.12)

- TypeScript 오류: 60개+
- 주요 오류 유형:
  - nullish coalescing (`??`) 불필요 사용: 45개
  - null 체크 필요: 10개
  - 타입 불일치: 5개

## 임시 조치

```javascript
// next.config.js
typescript: {
  ignoreBuildErrors: true;
} // 임시!
```

## 개선 계획

### Phase 1: 즉시 수정 필요 (Critical)

- [ ] app/api/payment/webhook/route.ts - null 체크
- [ ] app/lectures/[id]/page.tsx - undefined 체크
- [ ] lib/error-handling/error-handler.ts - 메소드 누락

### Phase 2: 중요 (High)

- [ ] 모든 API route의 null 체크
- [ ] 컴포넌트 props 타입 정의

### Phase 3: 개선 (Medium)

- [ ] `??` 연산자를 `||`로 변경 (필요한 경우만)
- [ ] 사용하지 않는 변수 제거

## 목표

- 2025년 1월: Phase 1 완료
- 2025년 2월: Phase 2 완료
- 2025년 3월: TypeScript 검사 완전 활성화

## 진행 상황 추적

```bash
# 오류 개수 확인
npm run type-check 2>&1 | grep error | wc -l

# 현재: 60개
# 목표: 0개
```
