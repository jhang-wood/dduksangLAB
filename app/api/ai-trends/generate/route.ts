import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { logger } from '@/lib/logger';
import { generateSVGThumbnail } from '@/lib/svg-generator';
import { getCategoryPrompt } from '@/lib/category-prompts';

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
  
  // 카테고리별 전용 프롬프트 사용 (특정 주제가 있으면 그것을 사용)
  const prompt = topic ? getCategoryPrompt(category, [topic, ...keywords.slice(0, 2)]) : getCategoryPrompt(category, keywords);

  try {
    const response = await generateWithGemini(prompt);
    
    // JSON 파싱 시도
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
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
  // ⚠️ 이 API는 비활성화되었습니다.
  // 새로운 Claude CLI + PlaywrightMCP 시스템을 사용하세요.
  return NextResponse.json(
    { 
      error: 'API 비활성화됨', 
      message: 'Claude CLI + PlaywrightMCP 시스템으로 대체되었습니다.',
      newSystem: '/home/qwg18/workflow/agents_team/dduksang_trend_agent/'
    },
    { status: 410 }
  );
  
  /*
  try {
    // 인증 확인 (옵션)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Cron job이거나 인증된 사용자만 허용
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
        const category = specificCategory || await selectEligibleCategory(supabase) || CATEGORIES[0].name;
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
  */
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