import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { logger } from '@/lib/logger';
import { generateSVGThumbnail } from '@/lib/svg-generator';
import { CATEGORY_PROMPTS } from '@/lib/category-prompts';

// Gemini API 설정
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// 새로운 카테고리 정의
const CATEGORIES = [
  { name: 'AI 부업정보', slug: 'ai-side-income', interval: 3 },
  { name: '바이브코딩 성공사례', slug: 'vibecoding-success', interval: 7 },
  { name: 'MCP 추천', slug: 'mcp-recommendation', interval: 3 },
  { name: '클로드코드 Level UP', slug: 'claude-levelup', interval: 1 }
];

// 카테고리별 키워드 풀
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'AI 부업정보': [
    '네이버 블로그 수익화', '쿠팡 파트너스', '인스타그램 마케팅',
    'AI 콘텐츠 제작', '유튜브 쇼츠', '틱톡 크리에이터',
    '스마트스토어', '아마존 KDP', '디지털 상품 판매',
    '온라인 강의 제작', '프리랜서 플랫폼', 'AI 자동화 도구'
  ],
  '바이브코딩 성공사례': [
    'SaaS 스타트업', '인디 해커', 'Product Hunt',
    '부트스트랩 창업', 'MRR 성장', '해외 진출',
    '원맨 스타트업', 'AI 서비스 개발', 'API 비즈니스',
    '구독 모델', '마이크로 SaaS', 'No-code 툴'
  ],
  'MCP 추천': [
    'GitHub MCP', 'Slack MCP', 'Google Drive MCP',
    'Notion MCP', 'Linear MCP', 'Jira MCP',
    'Postgres MCP', 'Redis MCP', 'AWS MCP',
    'Stripe MCP', 'SendGrid MCP', 'Twilio MCP'
  ],
  '클로드코드 Level UP': [
    'Claude Squad', 'SuperClaude', '서브에이전트',
    'git worktree', 'Claude Hooks', 'MCP 서버',
    'Claude API', 'Anthropic SDK', 'Claude Projects',
    'Claude Artifacts', 'Claude Constitution', 'Prompt Engineering'
  ]
};

interface GeneratedContent {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  thumbnail: string;
  images: string[];
}

async function generateWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 40
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function selectRandomKeywords(category: string, count: number = 3): string[] {
  const keywords = CATEGORY_KEYWORDS[category] || [];
  const shuffled = [...keywords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 문서 조건 기반 콘텐츠 생성 함수들
function generateAISideIncomeContent(mainKeyword: string, keywords: string[]) {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  
  return {
    title: `💰 ${mainKeyword}로 월 20-40만원 부업하기: 2025년 검증된 방법`,
    summary: `${mainKeyword}를 활용한 현실적인 부업 모델로 월 20-40만원 수익을 만드는 구체적인 방법을 단계별로 안내합니다.`,
    sections: [
      {
        heading: "🎯 시작하기 전 준비사항",
        content: `<p><strong>필요한 것들:</strong></p>
        <ul>
          <li>💻 컴퓨터나 스마트폰 (기본 사양)</li>
          <li>📱 네이버 계정 및 ${mainKeyword} 관련 기본 지식</li>
          <li>⏰ 하루 1-2시간 꾸준한 시간 투자</li>
          <li>💵 초기 투자금: 0-5만원 (선택사항)</li>
        </ul>
        <p>특별한 기술 없이도 시작할 수 있으며, 점진적으로 스킬을 키워나가면서 수익을 늘릴 수 있습니다.</p>`
      },
      {
        heading: "📋 단계별 실행 방법",
        content: `<p><strong>1단계: 기초 세팅 (1주차)</strong></p>
        <ul>
          <li>네이버 블로그 개설 및 ${mainKeyword} 테마 설정</li>
          <li>쿠팡 파트너스 가입 (수수료 1-8%)</li>
          <li>타겟 고객층 분석 및 콘텐츠 계획 수립</li>
        </ul>
        
        <p><strong>2단계: 콘텐츠 제작 (2-4주차)</strong></p>
        <ul>
          <li>일주일에 3-5개 포스팅 (${mainKeyword} 관련)</li>
          <li>실제 사용 후기 및 비교 리뷰 작성</li>
          <li>SEO 최적화된 제목 및 태그 활용</li>
        </ul>
        
        <p><strong>3단계: 수익화 (5주차부터)</strong></p>
        <ul>
          <li>방문자 100명/일 달성 시 수익 발생 시작</li>
          <li>쿠팡 파트너스 링크를 자연스럽게 삽입</li>
          <li>독자 문의 및 상담을 통한 추가 수익</li>
        </ul>`
      },
      {
        heading: "💸 현실적인 수익 구조",
        content: `<p><strong>월 수익 단계별 현황:</strong></p>
        <ul>
          <li>🟢 <strong>월 5-10만원</strong>: 하루 30분, 월 20-30개 포스팅</li>
          <li>🟡 <strong>월 15-25만원</strong>: 하루 1시간, 월 40-50개 포스팅</li>
          <li>🔵 <strong>월 25-40만원</strong>: 하루 1.5-2시간, 전문성 구축</li>
        </ul>
        
        <p><strong>수익원 구성:</strong></p>
        <ul>
          <li>쿠팡 파트너스 수수료: 월 10-25만원</li>
          <li>광고 수익 (애드센스): 월 3-8만원</li>
          <li>개인 상담/컨설팅: 월 5-15만원</li>
        </ul>
        
        <p>⚠️ <strong>주의:</strong> 위 수치는 꾸준히 6개월 이상 활동했을 때의 현실적인 범위입니다.</p>`
      },
      {
        heading: "✅ 성공을 위한 실전 팁",
        content: `<p><strong>검증된 노하우:</strong></p>
        <ul>
          <li>📊 네이버 데이터랩으로 인기 키워드 파악</li>
          <li>🎯 경쟁이 적은 롱테일 키워드 공략</li>
          <li>📝 솔직한 후기로 신뢰도 구축</li>
          <li>🔄 꾸준한 포스팅이 가장 중요</li>
        </ul>
        
        <p><strong>피해야 할 실수:</strong></p>
        <ul>
          <li>❌ 과장된 수익 광고 (블로그 신뢰도 하락)</li>
          <li>❌ 카피 콘텐츠 (네이버 검색 제외)</li>
          <li>❌ 너무 많은 제휴 링크 (독자 이탈)</li>
        </ul>`
      }
    ],
    tags: keywords.slice(0, 5),
    one_line_summary: `${mainKeyword}로 6개월 내 월 20-40만원 부업 수익을 만드는 검증된 단계별 가이드`,
    reading_time: "7"
  };
}

// 나머지 카테고리 생성 함수들 (임시 구현)
function generateVibecodingSuccessContent(mainKeyword: string, keywords: string[]) {
  return generateAISideIncomeContent(mainKeyword, keywords); // 임시로 같은 구조 사용
}

function generateMCPRecommendationContent(mainKeyword: string, keywords: string[]) {
  return generateAISideIncomeContent(mainKeyword, keywords); // 임시로 같은 구조 사용
}

function generateClaudeCodeLevelUpContent(mainKeyword: string, keywords: string[]) {
  return generateAISideIncomeContent(mainKeyword, keywords); // 임시로 같은 구조 사용
}

async function selectEligibleCategory(supabase: any): Promise<string | null> {
  // 각 카테고리의 게시 가능 여부 확인
  for (const category of CATEGORIES) {
    // 먼저 카테고리 정보 가져오기
    const { data: categoryData } = await supabase
      .from('ai_trend_categories')
      .select('id, last_posted_at, posting_interval_days')
      .eq('name', category.name)
      .single();
    
    if (!categoryData) continue;
    
    // 마지막 게시 시간 확인
    if (!categoryData.last_posted_at) {
      return category.name; // 한 번도 게시 안 함
    }
    
    const lastPosted = new Date(categoryData.last_posted_at);
    const now = new Date();
    const daysSinceLastPost = (now.getTime() - lastPosted.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastPost >= categoryData.posting_interval_days) {
      return category.name;
    }
  }
  return null;
}

async function generateSingleContent(category: string, topic?: string): Promise<GeneratedContent> {
  const keywords = selectRandomKeywords(category, 3);
  const mainKeyword = topic || keywords[0];
  
  // 문서 조건에 맞는 직접 콘텐츠 생성 (Gemini API 우회)
  let parsed;
  
  if (category === 'AI 부업정보') {
    parsed = generateAISideIncomeContent(mainKeyword, keywords);
  } else if (category === '바이브코딩 성공사례') {
    parsed = generateVibecodingSuccessContent(mainKeyword, keywords);
  } else if (category === 'MCP 추천') {
    parsed = generateMCPRecommendationContent(mainKeyword, keywords);
  } else if (category === '클로드코드 Level UP') {
    parsed = generateClaudeCodeLevelUpContent(mainKeyword, keywords);
  } else {
    throw new Error(`Unknown category: ${category}`);
  }
    
    // SVG 기반 안정적인 썸네일 생성
    const thumbnailUrl = generateSVGThumbnail(
      category,
      parsed.title || mainKeyword,
      1200,
      630
    );
    
    // 섹션별 콘텐츠와 이미지 처리
    let fullContent = '';
    const contentImages: string[] = [];
    
    if (parsed.sections && Array.isArray(parsed.sections)) {
      // 한줄 요약을 상단에 추가
      if (parsed.one_line_summary) {
        fullContent = `<div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
          <p class="text-lg font-semibold text-gray-800">${parsed.one_line_summary}</p>
        </div>\n`;
      }
      
      // 읽는 시간 표시
      if (parsed.reading_time) {
        fullContent += `<div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>⏱️ 읽는 시간: 약 ${parsed.reading_time}분</span>
        </div>\n`;
      }
      
      // 각 섹션 처리 (SEO 최적화)
      parsed.sections.forEach((section: any, index: number) => {
        // H2 태그로 섹션 제목 (구조화된 데이터)
        fullContent += `<h2>${section.heading}</h2>\n`;
        
        // 섹션 내용 추가
        fullContent += section.content + '\n';
        
        // SVG 기반 이미지로 대체 (필요 시)
        // 현재는 이미지 없이 콘텐츠만 표시
      });
    } else if (parsed.content) {
      // 기존 형식 폴백
      fullContent = parsed.content;
    }
    
    // 콘텐츠 이미지는 SVG로 대체
    
    return {
      title: parsed.title || `${mainKeyword} 완벽 가이드`,
      content: fullContent || '<p>콘텐츠를 생성하는 중 오류가 발생했습니다.</p>',
      summary: parsed.summary || `${mainKeyword}에 대한 최신 정보와 활용 방법`,
      category,
      tags: parsed.tags || keywords,
      thumbnail: thumbnailUrl,
      images: contentImages
    };
  } catch (error) {
    logger.error('Content generation error:', error);
    
    // 폴백 콘텐츠
    return {
      title: `📚 ${mainKeyword}: 2025년 완벽 가이드`,
      content: `
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
          <p class="text-lg font-semibold text-gray-800">⚡ ${mainKeyword}의 모든 것을 한 번에 정리했습니다.</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>⏱️ 읽는 시간: 약 5분</span>
        </div>
        <h2>🎯 ${mainKeyword} 소개</h2>
        <p>${mainKeyword}는 현재 AI 업계에서 가장 주목받는 기술 중 하나입니다. 2025년 현재 많은 기업들이 이 기술을 활용하여 혁신적인 서비스를 제공하고 있습니다.</p>
        <img src="https://placehold.co/1200x800/1a1a2e/ffffff?text=${encodeURIComponent(mainKeyword)}" alt="${mainKeyword} 소개" class="w-full rounded-lg my-6" loading="lazy">
        <h2>✨ 주요 특징</h2>
        <ul>
          <li>🚀 혁신적인 기술 구현</li>
          <li>💡 실용적인 활용 사례</li>
          <li>🔮 미래 발전 가능성</li>
        </ul>
        <img src="https://placehold.co/1200x800/2a2a3e/ffd700?text=${encodeURIComponent(mainKeyword + ' Features')}" alt="${mainKeyword} 특징" class="w-full rounded-lg my-6" loading="lazy">
        <h2>📖 활용 방법</h2>
        <p>다양한 분야에서 ${mainKeyword}를 활용할 수 있습니다. 특히 비즈니스, 교육, 연구 분야에서 큰 효과를 보이고 있습니다.</p>
      `,
      summary: `🎯 ${mainKeyword}의 핵심 개념과 2025년 최신 활용 방법을 상세히 알아봅니다.`,
      category,
      tags: [...keywords, '2025', 'AI트렌드'],
      thumbnail: `https://placehold.co/1200x630/1a1a2e/ffd700?text=${encodeURIComponent(mainKeyword)}`,
      images: [
        `https://placehold.co/1200x800/1a1a2e/ffffff?text=${encodeURIComponent(mainKeyword)}`,
        `https://placehold.co/1200x800/2a2a3e/ffd700?text=${encodeURIComponent(mainKeyword + ' Tech')}`
      ]
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (옵션)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // 개발 환경에서는 인증 우회 (로컬호스트일 경우만)
    const isDevelopment = request.headers.get('host')?.includes('localhost');
    
    if (!isDevelopment) {
      // Cron job이거나 인증된 사용자만 허용
      const supabase = createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // 요청 바디 파싱
    const body = await request.json().catch(() => ({}));
    const count = body.count || 1;
    const specificCategory = body.category; // 특정 카테고리 지정 가능
    const specificTopic = body.specificTopic; // 특정 주제 지정 가능
    
    logger.info(`Generating ${count} AI trend posts with Gemini`);
    
    // 콘텐츠 생성
    const contents: GeneratedContent[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        // 카테고리 선택 (지정되면 해당 카테고리, 아니면 게시 가능한 카테고리)
        // 카테고리 선택 (단순화)
        const category = specificCategory || CATEGORIES[0].name;
        const content = await generateSingleContent(category, specificTopic);
        contents.push(content);
        
        // API 레이트 리밋 방지
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        logger.error(`Failed to generate content ${i + 1}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      generated: contents.length,
      contents
    });
    
  } catch (error) {
    logger.error('AI trends generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to generate AI trends',
    endpoint: '/api/ai-trends/generate',
    method: 'POST',
    body: {
      count: 'number (optional, default: 1)'
    }
  });
}