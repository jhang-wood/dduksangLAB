-- Create sites table for 사이트홍보관
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow all users to view approved sites
CREATE POLICY "Anyone can view approved sites" ON public.sites
  FOR SELECT USING (is_approved = true);

-- Allow logged in users to insert their own sites
CREATE POLICY "Logged in users can insert own sites" ON public.sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own sites
CREATE POLICY "Users can update own sites" ON public.sites
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own sites
CREATE POLICY "Users can delete own sites" ON public.sites
  FOR DELETE USING (auth.uid() = user_id);

-- Allow admins to do everything
CREATE POLICY "Admins can do everything with sites" ON public.sites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_sites_user_id ON public.sites(user_id);
CREATE INDEX idx_sites_is_approved ON public.sites(is_approved);
CREATE INDEX idx_sites_created_at ON public.sites(created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();