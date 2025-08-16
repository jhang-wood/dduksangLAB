-- Add likes column to community_posts table
-- Migration: Add likes functionality to community posts

-- Add likes column to community_posts
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Create community_post_likes table for tracking individual likes
CREATE TABLE IF NOT EXISTS public.community_post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one like per user per post
  UNIQUE(post_id, user_id)
);

-- Enable RLS for community_post_likes
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

-- Policies for community_post_likes
-- Allow all users to view likes
CREATE POLICY "Anyone can view likes" ON public.community_post_likes
  FOR SELECT USING (true);

-- Allow logged in users to like/unlike posts
CREATE POLICY "Logged in users can like posts" ON public.community_post_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Allow users to remove their own likes
CREATE POLICY "Users can remove own likes" ON public.community_post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Admin policies for likes
CREATE POLICY "Admins can manage all likes" ON public.community_post_likes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_post_likes_post_id ON public.community_post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON public.community_post_likes(user_id);
CREATE INDEX idx_post_likes_created_at ON public.community_post_likes(created_at DESC);

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts 
    SET likes = likes + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts 
    SET likes = likes - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically update likes count
CREATE TRIGGER trigger_update_likes_count_insert
  AFTER INSERT ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER trigger_update_likes_count_delete
  AFTER DELETE ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Update existing posts to have correct likes count (in case of data inconsistency)
UPDATE public.community_posts 
SET likes = (
  SELECT COUNT(*) 
  FROM public.community_post_likes 
  WHERE post_id = community_posts.id
);