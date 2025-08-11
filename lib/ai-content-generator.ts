/**
 * 강화된 AI 콘텐츠 생성 모듈
 * OpenAI, Claude, Gemini API를 활용한 고품질 블로그 콘텐츠 자동 생성
 */

import { logger } from './logger'
import { env } from './env'

// AI 서비스 타입 정의
type AIService = 'openai' | 'claude' | 'gemini'

// 콘텐츠 타입 정의
interface AITrendContent {
  title: string
  summary: string
  content: string
  tags: string[]
  category: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  thumbnail?: string
}

// AI 서비스별 구성
interface AIServiceConfig {
  name: string
  apiKey: string
  endpoint: string
  model: string
  maxTokens: number
  temperature: number
}

// 트렌드 카테고리 정의
const TREND_CATEGORIES = [
  'AI 기술',
  'AI 도구', 
  'AI 활용',
  'AI 비즈니스',
  'AI 교육'
] as const

// 최신 AI 트렌드 키워드 (2025년 기준)
const TRENDING_KEYWORDS = [
  'AGI (Artificial General Intelligence)',
  '멀티모달 AI',
  'AI 에이전트',
  '로컬 AI 모델',
  'AI 코딩 어시스턴트',
  '생성형 AI 비즈니스',
  'AI 윤리 및 거버넌스',
  'AI 개인화 서비스',
  '엣지 AI',
  'AI 자동화 플랫폼',
  'AI 기반 콘텐츠 생성',
  'AI 개발자 도구',
  'AI 교육 플랫폼',
  'AI 스타트업 생태계'
]

// 콘텐츠 템플릿
const CONTENT_TEMPLATES = {
  기술분석: {
    sections: ['기술 개요', '핵심 기능', '기술적 장점', '활용 사례', '향후 전망'],
    tone: '전문적이고 기술적인',
    length: '상세한'
  },
  도구리뷰: {
    sections: ['도구 소개', '주요 기능', '사용법 가이드', '가격 정보', '경쟁사 비교'],
    tone: '실용적이고 객관적인',
    length: '중간 길이'
  },
  시장분석: {
    sections: ['시장 현황', '주요 동향', '투자 현황', '기업 분석', '시장 전망'],
    tone: '분석적이고 통찰력 있는',
    length: '종합적인'
  },
  교육가이드: {
    sections: ['학습 목표', '기본 개념', '실습 가이드', '추천 리소스', '다음 단계'],
    tone: '친근하고 교육적인',
    length: '단계별 상세한'
  }
}

export class AIContentGenerator {
  private services: Map<AIService, AIServiceConfig> = new Map()

  constructor() {
    this.initializeServices()
  }

  private initializeServices() {
    // OpenAI 설정
    if (env.openaiApiKey) {
      this.services.set('openai', {
        name: 'OpenAI GPT-4',
        apiKey: env.openaiApiKey,
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo-preview',
        maxTokens: 4000,
        temperature: 0.7
      })
    }

    // Claude 설정 (Anthropic)
    if (process.env.ANTHROPIC_API_KEY) {
      this.services.set('claude', {
        name: 'Anthropic Claude',
        apiKey: process.env.ANTHROPIC_API_KEY,
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4000,
        temperature: 0.7
      })
    }

    // Gemini 설정
    if (env.geminiApiKey) {
      this.services.set('gemini', {
        name: 'Google Gemini',
        apiKey: env.geminiApiKey,
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro',
        maxTokens: 4000,
        temperature: 0.7
      })
    }

    logger.info(`AI 서비스 초기화 완료: ${Array.from(this.services.keys()).join(', ')}`)
  }

  /**
   * AI 트렌드 콘텐츠 생성 메인 함수
   */
  async generateTrendContent(count: number = 3): Promise<AITrendContent[]> {
    const contents: AITrendContent[] = []
    
    // 사용 가능한 서비스 확인
    const availableServices = Array.from(this.services.keys())
    if (availableServices.length === 0) {
      throw new Error('사용 가능한 AI 서비스가 없습니다. API 키를 확인해주세요.')
    }

    // 최신 트렌드 키워드 선택
    const selectedKeywords = this.selectTrendingKeywords(count)
    
    for (let i = 0; i < count; i++) {
      try {
        // 서비스 로테이션으로 부하 분산
        const service = availableServices[i % availableServices.length]
        const keyword = selectedKeywords[i]
        
        if (!service || !keyword) {continue}
        const content = await this.generateSingleContent(service, keyword)
        if (content) {
          contents.push(content)
          logger.info(`AI 콘텐츠 생성 성공: ${content.title}`)
        }
        
        // API 레이트 리밋 방지
        await this.delay(2000)
        
      } catch (error) {
        logger.error(`콘텐츠 생성 실패 (${i + 1}/${count}):`, error)
      }
    }

    return contents
  }

  /**
   * 단일 콘텐츠 생성
   */
  private async generateSingleContent(service: AIService, keyword: string): Promise<AITrendContent | null> {
    const serviceConfig = this.services.get(service)
    if (!serviceConfig) {return null}

    const category = this.selectCategory(keyword)
    const template = this.selectTemplate(category)
    const prompt = this.buildPrompt(keyword, category, template)

    try {
      let generatedContent: string

      switch (service) {
        case 'openai':
          generatedContent = await this.callOpenAI(serviceConfig, prompt)
          break
        case 'claude':
          generatedContent = await this.callClaude(serviceConfig, prompt)
          break
        case 'gemini':
          generatedContent = await this.callGemini(serviceConfig, prompt)
          break
        default:
          throw new Error(`지원하지 않는 AI 서비스: ${service}`)
      }

      return this.parseAIResponse(generatedContent, category)

    } catch (error) {
      logger.error(`${service} API 호출 실패:`, error)
      return null
    }
  }

  /**
   * OpenAI API 호출
   */
  private async callOpenAI(config: AIServiceConfig, prompt: string): Promise<string> {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: '당신은 AI 트렌드 전문가입니다. 최신 기술 동향을 분석하고 고품질의 블로그 콘텐츠를 작성합니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.maxTokens,
        temperature: config.temperature
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API 오류: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  /**
   * Claude API 호출
   */
  private async callClaude(config: AIServiceConfig, prompt: string): Promise<string> {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API 오류: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.content[0].text
  }

  /**
   * Gemini API 호출
   */
  private async callGemini(config: AIServiceConfig, prompt: string): Promise<string> {
    const response = await fetch(`${config.endpoint}?key=${config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API 오류: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  /**
   * 트렌딩 키워드 선택
   */
  private selectTrendingKeywords(count: number): string[] {
    const shuffled = [...TRENDING_KEYWORDS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  /**
   * 카테고리 선택
   */
  private selectCategory(keyword: string): string {
    // 키워드 기반 카테고리 매핑
    const categoryMap: Record<string, string> = {
      'AGI': 'AI 기술',
      '멀티모달': 'AI 기술',
      '에이전트': 'AI 기술',
      '로컬': 'AI 도구',
      '코딩': 'AI 도구',
      '비즈니스': 'AI 비즈니스',
      '윤리': 'AI 기술',
      '개인화': 'AI 활용',
      '엣지': 'AI 기술',
      '자동화': 'AI 활용',
      '콘텐츠': 'AI 도구',
      '개발자': 'AI 도구',
      '교육': 'AI 교육',
      '스타트업': 'AI 비즈니스'
    }

    for (const [key, category] of Object.entries(categoryMap)) {
      if (keyword.includes(key)) {
        return category
      }
    }

    // 기본 카테고리 랜덤 선택
    return TREND_CATEGORIES[Math.floor(Math.random() * TREND_CATEGORIES.length)] ?? 'AI/ML'
  }

  /**
   * 템플릿 선택
   */
  private selectTemplate(category: string) {
    const templateMap: Record<string, keyof typeof CONTENT_TEMPLATES> = {
      'AI 기술': '기술분석',
      'AI 도구': '도구리뷰',
      'AI 비즈니스': '시장분석',
      'AI 활용': '도구리뷰',
      'AI 교육': '교육가이드'
    }

    return CONTENT_TEMPLATES[templateMap[category] ?? '기술분석']
  }

  /**
   * 프롬프트 구성
   */
  private buildPrompt(keyword: string, category: string, template: any): string {
    const currentDate = new Date().toLocaleDateString('ko-KR')
    
    return `
# AI 트렌드 블로그 콘텐츠 생성

## 요구사항
- 주제: ${keyword} (${category})
- 날짜: ${currentDate}
- 어조: ${template.tone}
- 길이: ${template.length}
- 섹션: ${template.sections.join(', ')}

## 출력 형식 (JSON)
다음 JSON 형식으로 정확히 출력해주세요:

{
  "title": "매력적이고 SEO 친화적인 제목 (50자 이내)",
  "summary": "핵심 내용을 요약한 설명 (150자 이내)",
  "content": "HTML 태그로 구조화된 상세 콘텐츠 (2000자 이상)",
  "tags": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "seoTitle": "SEO 최적화된 제목 (60자 이내)",
  "seoDescription": "메타 디스크립션 (160자 이내)",
  "seoKeywords": ["SEO키워드1", "SEO키워드2", "SEO키워드3"]
}

## 콘텐츠 작성 지침
1. 최신 정보와 실제 사례 포함
2. 독자가 실제로 활용할 수 있는 구체적인 정보 제공
3. 한국 독자를 위한 현지화된 내용
4. HTML 태그로 구조화 (h2, p, ul, li, strong, em 등)
5. 전문적이면서도 이해하기 쉬운 문체
6. 객관적이고 균형잡힌 관점

지금 ${keyword}에 대한 고품질 블로그 콘텐츠를 JSON 형식으로 생성해주세요.
`.trim()
  }

  /**
   * AI 응답 파싱
   */
  private parseAIResponse(response: string, category: string): AITrendContent {
    try {
      // JSON 추출
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('JSON 형식을 찾을 수 없습니다.')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        title: parsed.title ?? '제목 없음',
        summary: parsed.summary ?? '요약 없음',
        content: parsed.content ?? '<p>콘텐츠가 생성되지 않았습니다.</p>',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        category,
        seoTitle: parsed.seoTitle ?? parsed.title ?? '제목 없음',
        seoDescription: parsed.seoDescription ?? parsed.summary ?? '설명 없음',
        seoKeywords: Array.isArray(parsed.seoKeywords) ? parsed.seoKeywords : []
      }
    } catch (error) {
      logger.error('AI 응답 파싱 실패:', error)
      
      // 백업 파서 - 간단한 텍스트 분석
      return this.fallbackParsing(response, category)
    }
  }

  /**
   * 백업 파싱 (JSON 파싱 실패 시)
   */
  private fallbackParsing(response: string, category: string): AITrendContent {
    const lines = response.split('\n').filter(line => line.trim())
    const title = lines[0]?.replace(/^[#\-\*]\s*/, '') ?? '제목 없음'
    const summary = lines[1] ?? '요약 없음'
    
    return {
      title: title.substring(0, 100),
      summary: summary.substring(0, 200),
      content: `<p>${response.replace(/\n/g, '</p><p>')}</p>`,
      tags: ['AI', '트렌드', category.replace('AI ', '')],
      category,
      seoTitle: title.substring(0, 60),
      seoDescription: summary.substring(0, 160),
      seoKeywords: ['AI', '트렌드', '기술']
    }
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 사용 가능한 AI 서비스 목록
   */
  getAvailableServices(): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * 서비스 상태 확인
   */
  async checkServiceHealth(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {}
    
    for (const [service, _config] of this.services.entries()) {
      try {
        // 간단한 테스트 요청
        const testPrompt = '안녕하세요'
        await this.generateSingleContent(service, testPrompt)
        status[service] = true
      } catch (error) {
        status[service] = false
        logger.warn(`${service} 서비스 상태 확인 실패:`, error)
      }
    }
    
    return status
  }
}

// 싱글톤 인스턴스
export const aiContentGenerator = new AIContentGenerator()