#!/usr/bin/env node

/**
 * AI 트렌드 한글 slug를 영문 slug로 마이그레이션하는 스크립트
 * 
 * 사용법:
 * node scripts/migrate-slugs.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 개선된 한글-영문 변환 맵핑
const koreanToEnglish = {
  // AI 관련
  '인공지능': 'artificial-intelligence',
  '머신러닝': 'machine-learning',
  '딥러닝': 'deep-learning',
  '자동화': 'automation',
  '로봇': 'robot',
  '챗봇': 'chatbot',
  '생성형': 'generative',
  // 기업/제품명
  '오픈에이아이': 'openai',
  '앤트로픽': 'anthropic',
  '구글': 'google',
  '마이크로소프트': 'microsoft',
  '메타': 'meta',
  '테슬라': 'tesla',
  'claude': 'claude',
  'chatgpt': 'chatgpt',
  'gpt': 'gpt',
  // 기술 용어
  '혁신': 'innovation',
  '기술': 'technology',
  '서비스': 'service',
  '플랫폼': 'platform',
  '솔루션': 'solution',
  '개발': 'development',
  '분석': 'analysis',
  '예측': 'prediction',
  '최적화': 'optimization',
  '효율성': 'efficiency',
  // 산업 분야
  '금융': 'finance',
  '의료': 'healthcare',
  '교육': 'education',
  '제조': 'manufacturing',
  '유통': 'retail',
  '물류': 'logistics',
  '마케팅': 'marketing',
  // 일반 용어
  '비즈니스': 'business',
  '전략': 'strategy',
  '미래': 'future',
  '트렌드': 'trend',
  '시장': 'market',
  '산업': 'industry',
  '회사': 'company',
  '기업': 'enterprise',
  '스타트업': 'startup',
  '투자': 'investment',
  '성장': 'growth',
  '성과': 'performance',
  '수익': 'revenue',
  '이익': 'profit',
  '고객': 'customer',
  '사용자': 'user',
  '데이터': 'data',
  '보안': 'security',
  '프라이버시': 'privacy',
  // 일반 단어
  '새로운': 'new',
  '최신': 'latest',
  '완전': 'complete',
  '전체': 'all',
  '위한': 'for',
  '활용': 'using',
  '방법': 'method',
  '가이드': 'guide',
  '능력': 'capabilities',
  '기능': 'features',
  '업데이트': 'update',
  '진화': 'evolution',
  '함께하는': 'with',
  '스마트': 'smart',
  '워크플로우': 'workflow',
  '사례': 'case-studies'
};

/**
 * URL-safe slug 생성 (영문 전용)
 */
function generateSlug(text, maxLength = 100) {
  let slug = text.toLowerCase().trim();
  
  // 한글 단어를 영문으로 변환
  Object.entries(koreanToEnglish).forEach(([korean, english]) => {
    const regex = new RegExp(korean, 'g');
    slug = slug.replace(regex, english);
  });
  
  // 남은 한글과 특수문자 제거, 영문/숫자/공백/하이픈만 유지
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  
  // 공백을 하이픈으로 변경
  slug = slug.replace(/\s+/g, '-');
  
  // 연속된 하이픈 제거
  slug = slug.replace(/-+/g, '-');
  
  // 앞뒤 하이픈 제거
  slug = slug.replace(/^-|-$/g, '');
  
  // 길이 제한
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > maxLength * 0.7) {
      slug = slug.substring(0, lastHyphen);
    }
  }
  
  // 빈 문자열인 경우 기본값 반환
  if (!slug) {
    slug = 'ai-trend-' + Date.now();
  }
  
  return slug;
}

/**
 * 중복 방지를 위한 고유 slug 생성
 */
function generateUniqueSlug(baseSlug, existingSlugs) {
  let uniqueSlug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

/**
 * 메인 마이그레이션 함수
 */
async function migrateSlugs() {
  console.log('🚀 AI 트렌드 slug 마이그레이션 시작...');
  
  // Supabase 클라이언트 초기화
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 환경변수가 설정되지 않았습니다.');
    console.error('필요한 환경변수: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 모든 AI 트렌드 조회
    const { data: trends, error } = await supabase
      .from('ai_trends')
      .select('id, title, slug')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ 데이터 조회 실패:', error);
      return;
    }
    
    if (!trends || trends.length === 0) {
      console.log('📝 마이그레이션할 데이터가 없습니다.');
      return;
    }
    
    console.log(`📊 총 ${trends.length}개의 트렌드를 처리합니다.`);
    
    const existingSlugs = [];
    const updates = [];
    
    // 각 트렌드에 대해 새로운 slug 생성
    for (const trend of trends) {
      const newSlug = generateSlug(trend.title);
      const uniqueSlug = generateUniqueSlug(newSlug, existingSlugs);
      
      // 기존 slug와 다른 경우에만 업데이트 목록에 추가
      if (trend.slug !== uniqueSlug) {
        updates.push({
          id: trend.id,
          title: trend.title,
          oldSlug: trend.slug,
          newSlug: uniqueSlug
        });
      }
      
      existingSlugs.push(uniqueSlug);
    }
    
    if (updates.length === 0) {
      console.log('✅ 모든 slug가 이미 올바른 형식입니다.');
      return;
    }
    
    console.log(`🔄 ${updates.length}개의 slug를 업데이트합니다:`);
    
    // 업데이트 목록 출력
    updates.forEach((update, index) => {
      console.log(`${index + 1}. "${update.title}"`);
      console.log(`   ${update.oldSlug} → ${update.newSlug}`);
    });
    
    // 사용자 확인 요청
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('\n계속 진행하시겠습니까? (y/N): ', (answer) => {
        rl.close();
        resolve(answer.toLowerCase());
      });
    });
    
    if (answer !== 'y' && answer !== 'yes') {
      console.log('❌ 마이그레이션이 취소되었습니다.');
      return;
    }
    
    // 실제 업데이트 실행
    console.log('\n🔧 slug 업데이트 중...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const update of updates) {
      try {
        const { error } = await supabase
          .from('ai_trends')
          .update({ slug: update.newSlug })
          .eq('id', update.id);
        
        if (error) {
          console.error(`❌ 업데이트 실패 (ID: ${update.id}):`, error.message);
          errorCount++;
        } else {
          console.log(`✅ 업데이트 완료: ${update.oldSlug} → ${update.newSlug}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ 업데이트 오류 (ID: ${update.id}):`, err.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 마이그레이션 완료:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    
    if (errorCount === 0) {
      console.log('\n🎉 모든 slug가 성공적으로 마이그레이션되었습니다!');
    } else {
      console.log('\n⚠️ 일부 실패한 항목이 있습니다. 로그를 확인하세요.');
    }
    
  } catch (error) {
    console.error('❌ 마이그레이션 중 오류 발생:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  migrateSlugs().catch(console.error);
}

module.exports = { migrateSlugs, generateSlug, generateUniqueSlug };