-- 카테고리별 게시 주기 업데이트 및 초기 게시일 엇갈리게 설정

-- 1. 클로드코드 Level UP 주기를 7일로 변경
UPDATE ai_trend_categories 
SET posting_interval_days = 7
WHERE slug = 'claude-levelup';

-- 2. 각 카테고리의 초기 게시일을 엇갈리게 설정
-- 이렇게 하면 매일 다른 카테고리의 콘텐츠가 게시됨

-- AI 부업정보 (3일 주기) - 오늘부터 시작
UPDATE ai_trend_categories 
SET last_posted_at = NOW() - INTERVAL '3 days'
WHERE slug = 'ai-side-income';

-- MCP 추천 (3일 주기) - 1일 후부터 시작
UPDATE ai_trend_categories 
SET last_posted_at = NOW() - INTERVAL '2 days'
WHERE slug = 'mcp-recommendation';

-- 바이브코딩 성공사례 (7일 주기) - 4일 후부터 시작
UPDATE ai_trend_categories 
SET last_posted_at = NOW() - INTERVAL '3 days'
WHERE slug = 'vibecoding-success';

-- 클로드코드 Level UP (7일 주기) - 2일 후부터 시작  
UPDATE ai_trend_categories 
SET last_posted_at = NOW() - INTERVAL '5 days'
WHERE slug = 'claude-levelup';

-- 3. 게시 스케줄 확인 뷰 생성 (다음 7일간 예상 게시 일정)
CREATE OR REPLACE VIEW upcoming_posting_schedule AS
WITH RECURSIVE dates AS (
  SELECT CURRENT_DATE as date
  UNION ALL
  SELECT date + 1
  FROM dates
  WHERE date < CURRENT_DATE + INTERVAL '14 days'
),
category_schedule AS (
  SELECT 
    c.name as category_name,
    c.slug,
    c.posting_interval_days,
    c.last_posted_at,
    c.theme_color,
    CASE 
      WHEN c.last_posted_at IS NULL THEN CURRENT_DATE
      ELSE DATE(c.last_posted_at + (c.posting_interval_days || ' days')::INTERVAL)
    END as next_post_date
  FROM ai_trend_categories c
  WHERE c.is_active = true
)
SELECT 
  d.date as posting_date,
  TO_CHAR(d.date, 'Day') as day_name,
  STRING_AGG(
    CASE 
      WHEN cs.next_post_date = d.date 
        OR (cs.next_post_date < d.date 
            AND MOD(d.date - cs.next_post_date, cs.posting_interval_days) = 0)
      THEN cs.category_name 
      ELSE NULL 
    END, 
    ', ' ORDER BY cs.category_name
  ) as categories_to_post
FROM dates d
CROSS JOIN category_schedule cs
WHERE d.date >= CURRENT_DATE
GROUP BY d.date
ORDER BY d.date
LIMIT 14;

-- 4. 실제 게시 일정 예시 출력 (향후 14일)
-- 이 쿼리는 실행하면 다음 2주간 어떤 카테고리가 언제 게시되는지 보여줍니다
SELECT * FROM upcoming_posting_schedule WHERE categories_to_post IS NOT NULL;

-- 5. 카테고리별 다음 게시 예정일 확인
SELECT 
  name as "카테고리",
  posting_interval_days as "주기(일)",
  last_posted_at::date as "마지막 게시일",
  CASE 
    WHEN last_posted_at IS NULL THEN CURRENT_DATE
    ELSE (last_posted_at + (posting_interval_days || ' days')::INTERVAL)::date
  END as "다음 게시 예정일",
  CASE 
    WHEN last_posted_at IS NULL THEN 0
    ELSE EXTRACT(DAY FROM NOW() - last_posted_at)::INTEGER
  END as "경과일"
FROM ai_trend_categories
WHERE is_active = true
ORDER BY "다음 게시 예정일";