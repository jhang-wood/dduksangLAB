-- Fix lecture_enrollments table
CREATE TABLE IF NOT EXISTS public.lecture_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lecture_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, lecture_id)
);

-- Fix lectures table reference
CREATE TABLE IF NOT EXISTS public.lectures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES auth.users(id),
  instructor_name TEXT,
  duration INTEGER, -- in minutes
  price DECIMAL(10, 2),
  thumbnail_url TEXT,
  preview_url TEXT,
  category TEXT,
  level TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the AI Agent Master course if not exists
INSERT INTO public.lectures (
  id,
  title,
  description,
  instructor_name,
  duration,
  price,
  category,
  level,
  status
) VALUES (
  'ai-agent-master',
  'AI Agent 마스터과정',
  'AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 압도적인 방법을 알려드립니다.',
  '떡상연구소 대표',
  480,
  990000,
  'AI',
  'all',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.lecture_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Policies for lecture_enrollments
CREATE POLICY "Users can view own enrollments" ON public.lecture_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.lecture_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment" ON public.lecture_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for lectures
CREATE POLICY "Anyone can view active lectures" ON public.lectures
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage lectures" ON public.lectures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fix payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lecture_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );