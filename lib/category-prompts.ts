/**
 * 카테고리별 콘텐츠 생성 프롬프트
 * 각 카테고리의 특성에 맞는 구체적인 프롬프트 제공
 */

export const CATEGORY_PROMPTS: Record<string, (keywords: string[]) => string> = {
  'AI 부업정보': (keywords: string[]) => `
당신은 실전 부업 전문가입니다. 검증된 AI 부업 정보를 제공해주세요.

주제: ${keywords[0]}
관련 키워드: ${keywords.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "title": "월 10-50만원 현실적인 부업 제목 (숫자 포함, 60자 이내)",
  "summary": "구체적인 수익 모델과 실행 방법 요약 (200자 이내)",
  "sections": [
    {
      "heading": "1. 시작하기 전 준비사항",
      "content": "<p>필요한 초기 투자, 시간, 기술 수준 등 구체적으로 설명</p>"
    },
    {
      "heading": "2. 단계별 실행 방법", 
      "content": "<p>Step 1: 구체적 실행 단계...</p><p>Step 2: ...</p>"
    },
    {
      "heading": "3. 실제 수익 사례",
      "content": "<p>월 10만원: 하루 1시간 투자 시...</p><p>월 30만원: 하루 2-3시간...</p>"
    },
    {
      "heading": "4. 주의사항과 팁",
      "content": "<ul><li>흔한 실수들</li><li>수익 극대화 방법</li></ul>"
    }
  ],
  "tags": ["AI부업", "재택근무", "부수입", "${keywords[0]}", "2025"],
  "practical_info": {
    "initial_investment": "0-10만원",
    "monthly_income": "10-50만원",
    "time_required": "일 1-3시간",
    "difficulty": "초급-중급"
  }
}

핵심 원칙:
- 절대 과장 금지 (월 천만원 등 비현실적 수치 언급 금지)
- 구체적인 플랫폼명과 도구명 언급
- 실제 가능한 수익 범위만 제시
- 초보자도 따라할 수 있는 상세한 가이드`,

  '바이브코딩 성공사례': (keywords: string[]) => `
당신은 글로벌 스타트업 분석가입니다. 바이브코딩 성공 사례를 한국 상황에 맞게 소개하세요.

주제: ${keywords[0]}
관련 키워드: ${keywords.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "title": "🚀 [글로벌 사례] 제목 - 한국 적용 방법 포함",
  "summary": "핵심 성공 요인과 한국 시장 적용 가능성",
  "sections": [
    {
      "heading": "1. 프로젝트 소개",
      "content": "<p>창업자, 아이디어, 초기 자본, 기술 스택 등</p>"
    },
    {
      "heading": "2. 성장 과정",
      "content": "<p>MVP → 초기 고객 → 수익화 → 스케일업 과정</p>"
    },
    {
      "heading": "3. 핵심 성공 요인",
      "content": "<ul><li>차별화 포인트</li><li>기술적 우위</li><li>마케팅 전략</li></ul>"
    },
    {
      "heading": "4. 한국 시장 적용 방법",
      "content": "<p>한국의 특수성 고려한 현지화 전략...</p>"
    },
    {
      "heading": "5. 실행 가능한 액션 플랜",
      "content": "<p>당장 시작할 수 있는 구체적 단계들...</p>"
    }
  ],
  "tags": ["바이브코딩", "스타트업", "SaaS", "${keywords[0]}", "성공사례"],
  "metrics": {
    "mrr": "실제 MRR 수치 (달러)",
    "users": "사용자 수",
    "timeline": "성장 기간",
    "tech_stack": "사용 기술"
  }
}

핵심 원칙:
- 실제 존재하는 서비스/회사만 언급
- Product Hunt, Hacker News 등에서 검증된 사례
- 한국 시장 특성 반영한 현실적 조언
- 기술 스택과 구현 방법 구체적 제시`,

  'MCP 추천': (keywords: string[]) => `
당신은 MCP(Model Context Protocol) 전문가입니다. 실용적인 MCP 서버를 소개하세요.

주제: ${keywords[0]}
관련 키워드: ${keywords.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "title": "⚡ [MCP] ${keywords[0]} - 실전 활용법",
  "summary": "이 MCP로 해결할 수 있는 실제 문제와 사용 시나리오",
  "sections": [
    {
      "heading": "1. MCP 소개",
      "content": "<p>기능, 목적, 제작자, GitHub 스타 수 등</p>"
    },
    {
      "heading": "2. 설치 방법",
      "content": "<pre><code>npm install @modelcontextprotocol/server-${keywords[0].toLowerCase()}</code></pre><p>상세 설치 가이드...</p>"
    },
    {
      "heading": "3. 설정 방법",
      "content": "<pre><code>// claude_desktop_config.json\n{\n  \"mcpServers\": {\n    \"${keywords[0].toLowerCase()}\": {\n      \"command\": \"npx\",\n      \"args\": [...]\n    }\n  }\n}</code></pre>"
    },
    {
      "heading": "4. 실전 활용 예시",
      "content": "<p>실제 워크플로우에서 사용하는 구체적 시나리오 3가지...</p>"
    },
    {
      "heading": "5. 팁과 주의사항",
      "content": "<ul><li>성능 최적화 방법</li><li>보안 고려사항</li><li>트러블슈팅</li></ul>"
    }
  ],
  "tags": ["MCP", "Claude", "${keywords[0]}", "자동화", "생산성"],
  "github_info": {
    "repo_url": "https://github.com/...",
    "stars": "스타 수",
    "last_updated": "최근 업데이트",
    "license": "라이선스"
  }
}

핵심 원칙:
- GitHub에 실제 존재하는 MCP만 소개
- 설치부터 활용까지 완전한 가이드
- 코드 예시는 복사해서 바로 사용 가능하게
- 실제 업무에 적용 가능한 시나리오 제시`,

  '클로드코드 Level UP': (keywords: string[]) => `
당신은 Claude Code 파워유저입니다. 고급 활용법을 소개하세요.

주제: ${keywords[0]}
관련 키워드: ${keywords.join(', ')}

다음 JSON 형식으로 응답하세요:
{
  "title": "🔥 [클로드코드] ${keywords[0]} 완벽 가이드",
  "summary": "이 기능/도구로 생산성 10배 높이는 방법",
  "sections": [
    {
      "heading": "1. 기능 소개",
      "content": "<p>Anthropic 공식 기능 또는 커뮤니티 도구 상세 설명</p>"
    },
    {
      "heading": "2. 설정 방법",
      "content": "<pre><code>// 구체적인 설정 코드나 명령어\nclaude install ${keywords[0].toLowerCase()}</code></pre>"
    },
    {
      "heading": "3. 기본 사용법",
      "content": "<p>초보자를 위한 단계별 가이드...</p>"
    },
    {
      "heading": "4. 고급 활용법",
      "content": "<p>파워유저를 위한 숨겨진 기능들...</p>"
    },
    {
      "heading": "5. 실전 워크플로우",
      "content": "<p>실제 프로젝트에서 활용하는 구체적 예시...</p>"
    },
    {
      "heading": "6. 트러블슈팅",
      "content": "<ul><li>자주 발생하는 문제</li><li>해결 방법</li></ul>"
    }
  ],
  "tags": ["ClaudeCode", "${keywords[0]}", "생산성", "자동화", "AI코딩"],
  "resources": {
    "official_docs": "공식 문서 링크",
    "github_repo": "GitHub 저장소",
    "community": "커뮤니티 링크",
    "version": "최신 버전 정보"
  }
}

핵심 원칙:
- Anthropic 공식 또는 검증된 커뮤니티 도구만 소개
- 코드 예시는 실제 동작하는 것만
- 버전별 차이점 명시
- 실무에서 바로 적용 가능한 팁 위주`
};

/**
 * 카테고리에 맞는 프롬프트 선택
 */
export function getCategoryPrompt(category: string, keywords: string[]): string {
  const promptGenerator = CATEGORY_PROMPTS[category];
  if (!promptGenerator) {
    // 기본 프롬프트 반환
    return `당신은 AI 트렌드 전문가입니다. ${keywords[0]}에 대해 실전 위주의 콘텐츠를 작성해주세요.`;
  }
  return promptGenerator(keywords);
}