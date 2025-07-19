-- Add missing columns to lectures table
ALTER TABLE lectures
ADD COLUMN IF NOT EXISTS preview_url TEXT,
ADD COLUMN IF NOT EXISTS instructor_name TEXT,
ADD COLUMN IF NOT EXISTS objectives TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_audience TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2);

-- Update instructor_name from profiles table if not set
UPDATE lectures l
SET instructor_name = p.name
FROM profiles p
WHERE l.instructor_id = p.id
AND l.instructor_name IS NULL;

-- Create lecture_progress table (for tracking user progress per chapter)
CREATE TABLE IF NOT EXISTS lecture_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES lecture_chapters(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  watch_time INTEGER DEFAULT 0, -- in seconds
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lecture_id, chapter_id)
);

-- Add resources column to lecture_chapters
ALTER TABLE lecture_chapters
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]';

-- Update duration to be in seconds instead of minutes for more precise tracking
-- First, convert existing minutes to seconds
UPDATE lecture_chapters
SET duration = duration * 60
WHERE duration < 3600; -- Only update if value seems to be in minutes

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lecture_progress_user_lecture ON lecture_progress(user_id, lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_enrollments_user ON lecture_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lectures_category ON lectures(category);
CREATE INDEX IF NOT EXISTS idx_lectures_level ON lectures(level);
CREATE INDEX IF NOT EXISTS idx_lectures_published ON lectures(is_published);

-- Enable RLS on lecture_progress
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for lecture_progress
CREATE POLICY "Users can view own progress"
  ON lecture_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON lecture_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON lecture_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON lecture_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update student count
CREATE OR REPLACE FUNCTION update_lecture_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE lectures
    SET student_count = (
      SELECT COUNT(DISTINCT user_id)
      FROM lecture_enrollments
      WHERE lecture_id = NEW.lecture_id
      AND status = 'active'
    )
    WHERE id = NEW.lecture_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE lectures
    SET student_count = (
      SELECT COUNT(DISTINCT user_id)
      FROM lecture_enrollments
      WHERE lecture_id = OLD.lecture_id
      AND status = 'active'
    )
    WHERE id = OLD.lecture_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update both old and new lecture if lecture_id changed
    IF OLD.lecture_id != NEW.lecture_id THEN
      UPDATE lectures
      SET student_count = (
        SELECT COUNT(DISTINCT user_id)
        FROM lecture_enrollments
        WHERE lecture_id = OLD.lecture_id
        AND status = 'active'
      )
      WHERE id = OLD.lecture_id;
    END IF;
    
    UPDATE lectures
    SET student_count = (
      SELECT COUNT(DISTINCT user_id)
      FROM lecture_enrollments
      WHERE lecture_id = NEW.lecture_id
      AND status = 'active'
    )
    WHERE id = NEW.lecture_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for student count
DROP TRIGGER IF EXISTS update_lecture_student_count_trigger ON lecture_enrollments;
CREATE TRIGGER update_lecture_student_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON lecture_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_lecture_student_count();

-- Function to calculate lecture progress percentage
CREATE OR REPLACE FUNCTION calculate_lecture_progress(p_user_id UUID, p_lecture_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_chapters INTEGER;
  completed_chapters INTEGER;
  progress_percentage NUMERIC;
BEGIN
  -- Get total chapters
  SELECT COUNT(*)
  INTO total_chapters
  FROM lecture_chapters
  WHERE lecture_id = p_lecture_id;
  
  -- Get completed chapters
  SELECT COUNT(*)
  INTO completed_chapters
  FROM lecture_progress lp
  JOIN lecture_chapters lc ON lp.chapter_id = lc.id
  WHERE lp.user_id = p_user_id
  AND lc.lecture_id = p_lecture_id
  AND lp.completed = true;
  
  -- Calculate percentage
  IF total_chapters > 0 THEN
    progress_percentage := (completed_chapters::NUMERIC / total_chapters::NUMERIC) * 100;
  ELSE
    progress_percentage := 0;
  END IF;
  
  RETURN ROUND(progress_percentage, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_lecture_id UUID;
  v_progress NUMERIC;
BEGIN
  -- Get lecture_id from chapter
  SELECT lecture_id INTO v_lecture_id
  FROM lecture_chapters
  WHERE id = NEW.chapter_id;
  
  -- Calculate progress
  v_progress := calculate_lecture_progress(NEW.user_id, v_lecture_id);
  
  -- Update enrollment
  UPDATE lecture_enrollments
  SET 
    progress_percentage = v_progress,
    last_watched_at = NEW.last_watched_at,
    completed_at = CASE 
      WHEN v_progress = 100 THEN NOW()
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE user_id = NEW.user_id
  AND lecture_id = v_lecture_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for progress updates
DROP TRIGGER IF EXISTS update_enrollment_progress_trigger ON lecture_progress;
CREATE TRIGGER update_enrollment_progress_trigger
AFTER INSERT OR UPDATE ON lecture_progress
FOR EACH ROW
EXECUTE FUNCTION update_enrollment_progress();