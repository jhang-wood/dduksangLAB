-- 강의 챕터 테이블 생성
CREATE TABLE IF NOT EXISTS lecture_chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT,
  duration INTEGER DEFAULT 0, -- 분 단위
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lecture_chapters_lecture_id ON lecture_chapters(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_chapters_order ON lecture_chapters(lecture_id, order_index);

-- Row Level Security 활성화
ALTER TABLE lecture_chapters ENABLE ROW LEVEL SECURITY;

-- 정책 설정
-- 모든 사용자가 강의 챕터를 읽을 수 있음
CREATE POLICY "Anyone can read lecture chapters" ON lecture_chapters
  FOR SELECT USING (true);

-- 관리자만 챕터를 생성할 수 있음
CREATE POLICY "Admins can insert chapters" ON lecture_chapters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 관리자만 챕터를 수정할 수 있음
CREATE POLICY "Admins can update chapters" ON lecture_chapters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 관리자만 챕터를 삭제할 수 있음
CREATE POLICY "Admins can delete chapters" ON lecture_chapters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_lecture_chapters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lecture_chapters_updated_at
  BEFORE UPDATE ON lecture_chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_lecture_chapters_updated_at();

-- 샘플 데이터 삽입 (lectures 테이블에 데이터가 있다면)
DO $$
DECLARE
  lecture_record RECORD;
BEGIN
  -- 기존 강의들에 샘플 챕터 추가
  FOR lecture_record IN SELECT id FROM lectures LIMIT 3 LOOP
    INSERT INTO lecture_chapters (lecture_id, title, description, duration, order_index, is_free)
    VALUES 
      (lecture_record.id, '챕터 1: 기초 이해', '기본 개념을 배우는 시간입니다.', 15, 1, true),
      (lecture_record.id, '챕터 2: 실습하기', '실제로 따라해보면서 익혀봅시다.', 25, 2, false),
      (lecture_record.id, '챕터 3: 응용하기', '배운 내용을 응용해봅시다.', 20, 3, false);
  END LOOP;
END $$;