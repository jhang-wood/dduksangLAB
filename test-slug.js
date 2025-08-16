// 새로운 slug 생성 함수 테스트
const { generateSlug, validateSlug, sanitizeSlug } = require('./utils/helpers');

// 테스트 케이스
const testCases = [
  'Claude 3 비즈니스 혁신을 위한 Anthropic의 새로운 AI 파워하우스',
  '2025년 AI 자동화 혁명: 테스트 게시글',
  'ChatGPT-4의 새로운 멀티모달 기능',
  '한글과 English 혼합된 제목',
  '!!!특수문자@@@ 포함된 ##제목##',
  ''
];

console.log('🧪 Slug 생성 함수 테스트\n');

testCases.forEach((title, index) => {
  console.log(`${index + 1}. 입력: "${title}"`);
  try {
    const slug = generateSlug(title);
    const isValid = validateSlug(slug);
    const sanitized = sanitizeSlug(slug);
    
    console.log(`   생성된 slug: "${slug}"`);
    console.log(`   유효성 검사: ${isValid ? '✅ 통과' : '❌ 실패'}`);
    console.log(`   정리된 slug: "${sanitized}"`);
  } catch (error) {
    console.log(`   ❌ 오류: ${error.message}`);
  }
  console.log();
});

console.log('🔍 특별 테스트: 문제가 있던 slug');
const problematicSlug = 'claude-3-비즈니스-혁신을-위한-anthropic의-새로운-ai-파워하우스';
console.log(`입력: "${problematicSlug}"`);
console.log(`정리된 결과: "${sanitizeSlug(problematicSlug)}"`);
console.log(`유효성: ${validateSlug(sanitizeSlug(problematicSlug)) ? '✅ 통과' : '❌ 실패'}`);