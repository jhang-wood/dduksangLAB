-- Sample data for testing
-- Note: You'll need to replace the instructor_id with an actual user ID from your profiles table

-- Insert sample lectures
INSERT INTO lectures (
  title, 
  description, 
  instructor_name,
  duration, 
  price, 
  category, 
  level, 
  is_published,
  tags,
  preview_url,
  thumbnail_url,
  objectives,
  requirements,
  target_audience
) VALUES
(
  'ChatGPT로 시작하는 AI 비즈니스 자동화',
  'ChatGPT와 다양한 AI 도구를 활용하여 비즈니스 프로세스를 자동화하고 생산성을 극대화하는 방법을 배웁니다.',
  'AI 전문가',
  180,
  99000,
  'AI',
  'beginner',
  true,
  ARRAY['ChatGPT', 'AI', '자동화', '생산성'],
  'https://example.com/preview1.mp4',
  'https://example.com/thumb1.jpg',
  ARRAY[
    'ChatGPT를 비즈니스에 활용하는 방법 습득',
    'AI 도구를 통한 업무 자동화 구현',
    '생산성 향상을 위한 AI 워크플로우 설계',
    '실무에 바로 적용 가능한 프롬프트 작성법'
  ],
  ARRAY[
    '컴퓨터 기본 사용 능력',
    'ChatGPT 계정 (무료 버전도 가능)',
    '업무 자동화에 대한 관심'
  ],
  ARRAY[
    '업무 효율성을 높이고 싶은 직장인',
    'AI 도구를 처음 사용하는 초보자',
    '비즈니스 자동화에 관심 있는 창업가'
  ]
),
(
  'Zapier로 만드는 노코드 자동화 시스템',
  'Zapier를 활용하여 프로그래밍 없이 다양한 서비스를 연결하고 자동화하는 방법을 배웁니다.',
  '노코드 전문가',
  120,
  79000,
  '노코드',
  'intermediate',
  true,
  ARRAY['Zapier', '노코드', '자동화', 'API'],
  'https://example.com/preview2.mp4',
  'https://example.com/thumb2.jpg',
  ARRAY[
    'Zapier의 핵심 기능과 개념 이해',
    '다양한 앱 연동 및 자동화 워크플로우 구축',
    '복잡한 비즈니스 프로세스 자동화',
    'API 연동을 통한 고급 자동화'
  ],
  ARRAY[
    '기본적인 웹 서비스 사용 경험',
    'Zapier 무료 계정',
    '자동화하고 싶은 업무 프로세스'
  ],
  ARRAY[
    '반복 업무에 시간을 낭비하는 직장인',
    '개발 지식 없이 자동화를 원하는 사업가',
    '업무 프로세스 최적화를 담당하는 매니저'
  ]
),
(
  'Webflow로 구축하는 프로페셔널 웹사이트',
  '코딩 없이 Webflow를 사용하여 전문적인 웹사이트를 디자인하고 배포하는 방법을 배웁니다.',
  '웹 디자이너',
  240,
  149000,
  '노코드',
  'advanced',
  true,
  ARRAY['Webflow', '웹디자인', '노코드', 'CMS'],
  'https://example.com/preview3.mp4',
  'https://example.com/thumb3.jpg',
  ARRAY[
    'Webflow의 고급 기능 완벽 마스터',
    '반응형 웹사이트 디자인 및 개발',
    'CMS를 활용한 동적 콘텐츠 관리',
    'SEO 최적화 및 성능 향상 기법'
  ],
  ARRAY[
    '기본적인 웹 디자인 이해',
    'HTML/CSS 기초 지식 (선택사항)',
    'Webflow 계정'
  ],
  ARRAY[
    '프리랜서 웹 디자이너',
    '스타트업 창업자',
    '마케팅 담당자'
  ]
);

-- Get the first lecture ID for sample chapters
DO $$
DECLARE
  lecture_id UUID;
BEGIN
  SELECT id INTO lecture_id FROM lectures WHERE title = 'ChatGPT로 시작하는 AI 비즈니스 자동화' LIMIT 1;
  
  -- Insert sample chapters for the first lecture
  INSERT INTO lecture_chapters (lecture_id, title, description, video_url, duration, order_index, is_preview) VALUES
  (lecture_id, '강의 소개 및 AI 비즈니스 트렌드', 'AI가 비즈니스에 미치는 영향과 ChatGPT의 가능성을 알아봅니다.', 'https://example.com/video1.mp4', 600, 1, true),
  (lecture_id, 'ChatGPT 기초: 계정 생성부터 기본 사용법까지', 'ChatGPT 계정 생성 방법과 인터페이스 사용법을 배웁니다.', 'https://example.com/video2.mp4', 900, 2, true),
  (lecture_id, '효과적인 프롬프트 작성법', '원하는 결과를 얻기 위한 프롬프트 작성 기법을 학습합니다.', 'https://example.com/video3.mp4', 1200, 3, false),
  (lecture_id, '비즈니스 문서 자동화', '보고서, 이메일, 제안서 등을 AI로 작성하는 방법을 배웁니다.', 'https://example.com/video4.mp4', 1500, 4, false),
  (lecture_id, '마케팅 콘텐츠 생성 자동화', 'SNS 콘텐츠, 블로그 포스트, 광고 카피를 AI로 생성합니다.', 'https://example.com/video5.mp4', 1800, 5, false),
  (lecture_id, '고객 서비스 자동화', 'ChatGPT를 활용한 고객 응대 자동화 시스템을 구축합니다.', 'https://example.com/video6.mp4', 1200, 6, false),
  (lecture_id, '데이터 분석 및 인사이트 도출', 'AI를 활용한 데이터 분석과 비즈니스 인사이트 발굴 방법을 배웁니다.', 'https://example.com/video7.mp4', 1500, 7, false),
  (lecture_id, '실전 프로젝트: 나만의 AI 비즈니스 어시스턴트 만들기', '학습한 내용을 종합하여 실무에 적용 가능한 AI 어시스턴트를 구축합니다.', 'https://example.com/video8.mp4', 2400, 8, false);
END $$;

-- Get the second lecture ID for sample chapters
DO $$
DECLARE
  lecture_id UUID;
BEGIN
  SELECT id INTO lecture_id FROM lectures WHERE title = 'Zapier로 만드는 노코드 자동화 시스템' LIMIT 1;
  
  -- Insert sample chapters for the second lecture
  INSERT INTO lecture_chapters (lecture_id, title, description, video_url, duration, order_index, is_preview) VALUES
  (lecture_id, 'Zapier 소개 및 기본 개념', 'Zapier의 작동 원리와 핵심 개념을 이해합니다.', 'https://example.com/video9.mp4', 600, 1, true),
  (lecture_id, '첫 번째 Zap 만들기', '간단한 자동화 워크플로우를 직접 만들어봅니다.', 'https://example.com/video10.mp4', 900, 2, false),
  (lecture_id, '트리거와 액션 이해하기', 'Zapier의 핵심 구성 요소인 트리거와 액션을 깊이 있게 학습합니다.', 'https://example.com/video11.mp4', 1200, 3, false),
  (lecture_id, '필터와 포맷터 활용하기', '데이터를 가공하고 조건부 로직을 구현하는 방법을 배웁니다.', 'https://example.com/video12.mp4', 1500, 4, false),
  (lecture_id, '멀티 스텝 Zap 구축하기', '복잡한 워크플로우를 구현하는 고급 기법을 학습합니다.', 'https://example.com/video13.mp4', 1800, 5, false),
  (lecture_id, '실전 프로젝트: 영업 자동화 시스템', 'CRM, 이메일, 캘린더를 연동한 영업 자동화 시스템을 구축합니다.', 'https://example.com/video14.mp4', 2100, 6, false);
END $$;

-- Update lectures with instructor_name since instructor_id might not exist
UPDATE lectures SET instructor_name = 'AI 전문가' WHERE category = 'AI';
UPDATE lectures SET instructor_name = '노코드 전문가' WHERE category = '노코드';

-- Add some sample community posts (you'll need to replace author_id with actual user IDs)
-- These are commented out since they require actual user IDs
/*
INSERT INTO community_posts (title, content, author_id, category, tags) VALUES
('ChatGPT로 이메일 자동 답장 시스템 만들기', 'ChatGPT API를 활용하여 이메일 자동 답장 시스템을 구축한 경험을 공유합니다...', 'USER_ID_HERE', 'AI활용', ARRAY['ChatGPT', 'API', '자동화']),
('Zapier로 소셜미디어 포스팅 자동화하기', 'Instagram, Twitter, LinkedIn을 한 번에 관리하는 방법...', 'USER_ID_HERE', '노코드', ARRAY['Zapier', '소셜미디어', '마케팅']);
*/