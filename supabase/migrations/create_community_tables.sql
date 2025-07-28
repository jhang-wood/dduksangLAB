-- Create community_posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- 'free', 'study', 'qna', 'career'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Policies for community_posts
-- Allow all users to view posts
CREATE POLICY "Anyone can view posts" ON public.community_posts
  FOR SELECT USING (true);

-- Allow logged in users to create posts
CREATE POLICY "Logged in users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own posts
CREATE POLICY "Users can update own posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for community_comments
-- Allow all users to view comments
CREATE POLICY "Anyone can view comments" ON public.community_comments
  FOR SELECT USING (true);

-- Allow logged in users to create comments
CREATE POLICY "Logged in users can create comments" ON public.community_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own comments
CREATE POLICY "Users can update own comments" ON public.community_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete own comments" ON public.community_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can do everything with posts" ON public.community_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can do everything with comments" ON public.community_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX idx_posts_category ON public.community_posts(category);
CREATE INDEX idx_posts_user_id ON public.community_posts(user_id);
CREATE INDEX idx_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.community_comments(post_id);
CREATE INDEX idx_comments_user_id ON public.community_comments(user_id);

-- Create triggers for updated_at
CREATE OR REPLACE TRIGGER community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER community_comments_updated_at
  BEFORE UPDATE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();