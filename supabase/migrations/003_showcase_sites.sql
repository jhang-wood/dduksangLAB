-- Create showcase_sites table for site promotion
CREATE TABLE IF NOT EXISTS showcase_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  creator_name TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_showcase_sites_category ON showcase_sites(category);
CREATE INDEX IF NOT EXISTS idx_showcase_sites_creator ON showcase_sites(creator_id);
CREATE INDEX IF NOT EXISTS idx_showcase_sites_approved ON showcase_sites(is_approved);
CREATE INDEX IF NOT EXISTS idx_showcase_sites_featured ON showcase_sites(is_featured);
CREATE INDEX IF NOT EXISTS idx_showcase_sites_trending ON showcase_sites(is_trending);

-- Enable RLS
ALTER TABLE showcase_sites ENABLE ROW LEVEL SECURITY;

-- RLS policies for showcase_sites
CREATE POLICY "Anyone can view approved sites"
  ON showcase_sites FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Users can create their own sites"
  ON showcase_sites FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own sites"
  ON showcase_sites FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own sites"
  ON showcase_sites FOR DELETE
  USING (auth.uid() = creator_id);

CREATE POLICY "Admins can do everything"
  ON showcase_sites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to increment site views
CREATE OR REPLACE FUNCTION increment_site_views(site_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE showcase_sites
  SET views = views + 1
  WHERE id = site_id;
END;
$$;

-- Function to increment site likes
CREATE OR REPLACE FUNCTION increment_site_likes(site_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE showcase_sites
  SET likes = likes + 1
  WHERE id = site_id;
END;
$$;

-- Function to update trending status based on views and likes
CREATE OR REPLACE FUNCTION update_trending_sites()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Reset all trending status
  UPDATE showcase_sites SET is_trending = false;
  
  -- Set trending for top 10 sites based on combined score
  UPDATE showcase_sites
  SET is_trending = true
  WHERE id IN (
    SELECT id
    FROM showcase_sites
    WHERE is_approved = true
    ORDER BY (views * 0.3 + likes * 0.7) DESC
    LIMIT 10
  );
END;
$$;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_showcase_sites_updated_at
BEFORE UPDATE ON showcase_sites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();