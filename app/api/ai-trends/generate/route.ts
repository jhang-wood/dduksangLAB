import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { logger } from '@/lib/logger';

// Gemini API 설정
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// AI 트렌드 카테고리
const CATEGORIES = ['AI 기술', 'AI 도구', 'AI 활용', 'AI 비즈니스', 'AI 교육'];

// 트렌드 키워드 풀
const TREND_KEYWORDS = [
  'GPT-4', 'Claude 3', 'Gemini', 'Llama 3', 'Mistral',
  'AI 에이전트', '멀티모달 AI', 'RAG 시스템', '로컬 LLM',
  'AI 코딩 어시스턴트', 'Cursor', 'V0', 'Claude Artifacts',
  'AI 이미지 생성', 'Midjourney', 'DALL-E 3', 'Stable Diffusion',
  'AI 비디오 생성', 'Sora', 'Runway', 'Pika Labs',
  'AI 음성 합성', 'ElevenLabs', 'AI 번역', 'AI 요약',
  'AutoGPT', 'LangChain', 'Vector DB', 'AI 파인튜닝',
  'AI 윤리', 'AI 규제', 'AI 보안', 'Prompt Engineering',
  'AI 스타트업', 'AI 투자', 'AI 교육 플랫폼', 'AI 자격증'
];

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

function selectRandomKeywords(count: number = 3): string[] {
  const shuffled = [...TREND_KEYWORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function selectRandomCategory(): string {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

async function generateSingleContent(): Promise<GeneratedContent> {
  const keywords = selectRandomKeywords(3);
  const category = selectRandomCategory();
  const mainKeyword = keywords[0];
  
  const prompt = `
당신은 SEO 최적화 AI 트렌드 전문 블로거입니다. 다음 주제로 구글 상위노출에 최적화된 고품질 블로그 포스트를 작성해주세요.

주제: ${mainKeyword}
카테고리: ${category}
관련 키워드: ${keywords.join(', ')}

다음 JSON 형식으로 정확히 응답해주세요:
{
  "title": "📚 이모지 포함 매력적인 제목 (60자 이내, 숫자 포함 권장 예: 2025년 필수 AI 도구 TOP 7)",
  "summary": "🎯 핵심 내용 한줄 요약 (200자 이내, 독자가 얻을 수 있는 가치 명시)",
  "thumbnail_keyword": "영문 키워드 (예: artificial intelligence technology)",
  "sections": [
    {
      "heading": "섹션 제목",
      "content": "HTML 형식 섹션 내용 (이모지 활용, 500자 이상)",
      "needs_image": true 또는 false,
      "image_keyword": "영문 이미지 검색 키워드 (예: machine learning visualization)"
    }
  ],
  "tags": ["실용적태그1", "트렌드태그2", "기술태그3", "활용태그4", "2025태그5"],
  "seo": {
    "meta_description": "검색 결과에 표시될 설명 (160자, 행동 유도)",
    "keywords": ["SEO키워드1", "검색키워드2", "관련키워드3"],
    "related_searches": ["사용자가 추가로 검색할 만한 질문 5개"]
  },
  "one_line_summary": "⚡ 이 글의 핵심을 한 문장으로 (강력한 이모지 사용)",
  "reading_time": 예상 읽기 시간(분)
}

콘텐츠 작성 가이드:
1. 섹션 제목은 일반 텍스트로만 (HTML 태그 없이)
2. content 필드에만 HTML 태그 사용:
   - <p>문단</p>
   - <ul><li>목록</li></ul>
   - <strong>강조</strong>
   - <em>이탤릭</em>
3. 첫 문단에서 독자의 문제점/니즈 언급
4. 📌 중요 포인트는 이모지로 강조
5. 실제 사례와 2025년 최신 트렌드 포함
6. 각 섹션은 500-800자 (전체 2000자 이상)
7. 신뢰할 수 있는 통계나 출처 언급
8. 마지막에 실행 가능한 액션 아이템 제시

이미지 전략:
- 콘텐츠 500자당 1개 이미지 (최소 2개, 최대 8개)
- 각 주요 섹션마다 관련 이미지 필요 여부 판단
- 이미지 키워드는 구체적이고 전문적인 영문 용어 사용

JSON 형식으로만 응답하세요.`;

  try {
    const response = await generateWithGemini(prompt);
    
    // JSON 파싱 시도
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Picsum 이미지 URL 생성 함수 (더 안정적)
    const getImageUrl = (seed: string, width: number, height: number) => {
      // seed를 기반으로 고유한 이미지 ID 생성
      const imageId = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1000;
      return `https://picsum.photos/seed/${imageId}/${width}/${height}`;
    };
    
    // 썸네일 URL 생성
    const thumbnailUrl = getImageUrl(
      parsed.thumbnail_keyword || mainKeyword || 'AI', 
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
        
        // 이미지가 필요한 섹션에 이미지 추가
        if (section.needs_image && contentImages.length < 8) {
          const imageSeed = section.image_keyword || section.heading || `section-${index}`;
          const imageUrl = getImageUrl(imageSeed, 1200, 800);
          contentImages.push(imageUrl);
          // SEO 최적화된 이미지 태그
          fullContent += `<figure class="my-8">
            <img src="${imageUrl}" 
                 alt="${section.heading}" 
                 class="w-full rounded-lg shadow-lg" 
                 loading="lazy"
                 width="1200"
                 height="800">
            <figcaption class="text-center text-sm text-gray-600 mt-2">${section.heading}</figcaption>
          </figure>\n`;
        }
      });
    } else if (parsed.content) {
      // 기존 형식 폴백
      fullContent = parsed.content;
    }
    
    // 최소 2개 이미지 보장
    if (contentImages.length < 2) {
      contentImages.push(getImageUrl('artificial intelligence tech', 1200, 800));
      if (contentImages.length < 2) {
        contentImages.push(getImageUrl('machine learning future', 1200, 800));
      }
    }
    
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
        <img src="https://picsum.photos/seed/${Date.now()}-1/1200/800" alt="${mainKeyword} 소개" class="w-full rounded-lg my-6" loading="lazy">
        <h2>✨ 주요 특징</h2>
        <ul>
          <li>🚀 혁신적인 기술 구현</li>
          <li>💡 실용적인 활용 사례</li>
          <li>🔮 미래 발전 가능성</li>
        </ul>
        <img src="https://picsum.photos/seed/${Date.now()}-2/1200/800" alt="${mainKeyword} 특징" class="w-full rounded-lg my-6" loading="lazy">
        <h2>📖 활용 방법</h2>
        <p>다양한 분야에서 ${mainKeyword}를 활용할 수 있습니다. 특히 비즈니스, 교육, 연구 분야에서 큰 효과를 보이고 있습니다.</p>
      `,
      summary: `🎯 ${mainKeyword}의 핵심 개념과 2025년 최신 활용 방법을 상세히 알아봅니다.`,
      category,
      tags: [...keywords, '2025', 'AI트렌드'],
      thumbnail: `https://picsum.photos/seed/${Date.now()}/1200/630`,
      images: [
        `https://picsum.photos/seed/${Date.now()}-1/1200/800`,
        `https://picsum.photos/seed/${Date.now()}-2/1200/800`
      ]
    };
  }
}

export async function POST(request: NextRequest) {
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
    
    logger.info(`Generating ${count} AI trend posts with Gemini`);
    
    // 콘텐츠 생성
    const contents: GeneratedContent[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const content = await generateSingleContent();
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