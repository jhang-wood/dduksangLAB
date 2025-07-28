// 관리자 페이지 테스트 스크립트
// Node.js 환경에서 실행

const fs = require('fs');
const path = require('path');

const ADMIN_PAGES_DIR = path.join(__dirname, '../app/admin');

// 테스트 결과 저장
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// 파일 존재 여부 확인
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    testResults.passed.push(`✅ ${description}: 파일 존재`);
    return true;
  } else {
    testResults.failed.push(`❌ ${description}: 파일 없음 - ${filePath}`);
    return false;
  }
}

// 파일 내용 검증
function checkFileContent(filePath, pattern, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (pattern.test(content)) {
      testResults.passed.push(`✅ ${description}: 패턴 일치`);
      return true;
    } else {
      testResults.failed.push(`❌ ${description}: 패턴 불일치`);
      return false;
    }
  } catch (error) {
    testResults.failed.push(`❌ ${description}: 파일 읽기 오류 - ${error.message}`);
    return false;
  }
}

// logger import 통일 검증
function checkLoggerImports(filePath, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasCorrectImport = /import\s+\{\s*userNotification,\s*logger\s*\}\s+from\s+['"]@\/lib\/logger['"]/.test(content);
    
    if (hasCorrectImport) {
      testResults.passed.push(`✅ ${description}: logger import 통일됨`);
      return true;
    } else {
      testResults.warnings.push(`⚠️ ${description}: logger import 확인 필요`);
      return false;
    }
  } catch (error) {
    testResults.failed.push(`❌ ${description}: 파일 읽기 오류 - ${error.message}`);
    return false;
  }
}

console.log('🧪 관리자 페이지 테스트 시작...\n');

// 1. 기본 관리자 페이지들 존재 확인
console.log('📂 기본 관리자 페이지 확인:');
checkFileExists(path.join(ADMIN_PAGES_DIR, 'page.tsx'), '메인 관리자 페이지');
checkFileExists(path.join(ADMIN_PAGES_DIR, 'settings/page.tsx'), '시스템 설정 페이지');
checkFileExists(path.join(ADMIN_PAGES_DIR, 'users/page.tsx'), '사용자 관리 페이지');
checkFileExists(path.join(ADMIN_PAGES_DIR, 'lectures/page.tsx'), '강의 관리 페이지');
checkFileExists(path.join(ADMIN_PAGES_DIR, 'stats/page.tsx'), '통계 페이지');
checkFileExists(path.join(ADMIN_PAGES_DIR, 'ai-trends/page.tsx'), 'AI 트렌드 페이지');

// 2. 새로 구현된 기능들 확인
console.log('\n🆕 새로 구현된 기능 확인:');
checkFileExists(path.join(ADMIN_PAGES_DIR, 'users/[id]/page.tsx'), '사용자 상세 페이지');
checkFileExists(path.join(__dirname, '../app/api/admin/settings/route.ts'), '시스템 설정 API');
checkFileExists(path.join(__dirname, '../sql/system_settings.sql'), '시스템 설정 DB 스키마');

// 3. 시스템 설정 API 내용 확인
console.log('\n🔧 시스템 설정 API 검증:');
const settingsApiPath = path.join(__dirname, '../app/api/admin/settings/route.ts');
checkFileContent(settingsApiPath, /export async function GET/, '시스템 설정 API - GET 메서드');
checkFileContent(settingsApiPath, /export async function PUT/, '시스템 설정 API - PUT 메서드');
checkFileContent(settingsApiPath, /system_settings/, '시스템 설정 API - 테이블 참조');

// 4. logger import 통일 확인
console.log('\n📝 logger import 통일 확인:');
const adminFiles = [
  'settings/page.tsx',
  'users/page.tsx', 
  'lectures/page.tsx',
  'ai-trends/page.tsx'
];

adminFiles.forEach(file => {
  const filePath = path.join(ADMIN_PAGES_DIR, file);
  if (fs.existsSync(filePath)) {
    checkLoggerImports(filePath, `${file} logger import`);
  }
});

// 5. 강의 챕터 관리 기능 확인
console.log('\n📚 강의 챕터 관리 기능 확인:');
const lecturesPath = path.join(ADMIN_PAGES_DIR, 'lectures/page.tsx');
checkFileContent(lecturesPath, /ChapterManagement/, '강의 페이지 - ChapterManagement 컴포넌트');
checkFileContent(lecturesPath, /fetchChapters/, '강의 페이지 - 챕터 데이터 로딩');
checkFileContent(lecturesPath, /addNewChapter/, '강의 페이지 - 챕터 추가 기능');
checkFileContent(lecturesPath, /deleteChapter/, '강의 페이지 - 챕터 삭제 기능');

// 6. 통계 차트 시각화 확인
console.log('\n📊 통계 차트 시각화 확인:');
const statsPath = path.join(ADMIN_PAGES_DIR, 'stats/page.tsx');
checkFileContent(statsPath, /UserGrowthChart/, '통계 페이지 - 사용자 증가 차트');
checkFileContent(statsPath, /RevenueChart/, '통계 페이지 - 매출 차트');
checkFileContent(statsPath, /RefreshCw/, '통계 페이지 - 새로고침 기능');

// 7. 사용자 상세 페이지 확인
console.log('\n👤 사용자 상세 페이지 확인:');
const userDetailPath = path.join(ADMIN_PAGES_DIR, 'users/[id]/page.tsx');
checkFileContent(userDetailPath, /AdminUserDetailPage/, '사용자 상세 페이지 - 컴포넌트');
checkFileContent(userDetailPath, /fetchUserDetail/, '사용자 상세 페이지 - 사용자 정보 로딩');
checkFileContent(userDetailPath, /handleUpdateUser/, '사용자 상세 페이지 - 사용자 정보 수정');

// 결과 출력
console.log('\n' + '='.repeat(60));
console.log('🧪 테스트 결과 요약');
console.log('='.repeat(60));

console.log('\n✅ 통과한 테스트:');
testResults.passed.forEach(result => console.log(result));

if (testResults.warnings.length > 0) {
  console.log('\n⚠️ 경고:');
  testResults.warnings.forEach(result => console.log(result));
}

if (testResults.failed.length > 0) {
  console.log('\n❌ 실패한 테스트:');
  testResults.failed.forEach(result => console.log(result));
}

console.log('\n📈 테스트 통계:');
console.log(`- 통과: ${testResults.passed.length}개`);
console.log(`- 경고: ${testResults.warnings.length}개`);
console.log(`- 실패: ${testResults.failed.length}개`);

const totalTests = testResults.passed.length + testResults.warnings.length + testResults.failed.length;
const successRate = ((testResults.passed.length / totalTests) * 100).toFixed(1);
console.log(`- 성공률: ${successRate}%`);

if (testResults.failed.length === 0) {
  console.log('\n🎉 모든 핵심 기능이 구현되었습니다!');
} else {
  console.log('\n⚠️ 일부 수정이 필요합니다.');
  process.exit(1);
}