-- Create user_sites table
CREATE TABLE IF NOT EXISTS user_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    thumbnail_url TEXT,
    tags TEXT[],
    views_today INTEGER DEFAULT 0,
    views_yesterday INTEGER DEFAULT 0,
    views_week INTEGER DEFAULT 0,
    views_month INTEGER DEFAULT 0,
    views_total INTEGER DEFAULT 0,
    rank_today INTEGER,
    rank_yesterday INTEGER,
    rank_change INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_hot BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, url)
);

-- Enable RLS
ALTER TABLE user_sites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all active sites" ON user_sites
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own sites" ON user_sites
    FOR ALL USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_sites_active ON user_sites(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sites_created_at ON user_sites(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sites_category ON user_sites(category);

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_site_views(site_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_sites
    SET views_today = views_today + 1,
        views_total = views_total + 1
    WHERE id = site_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment likes
CREATE OR REPLACE FUNCTION increment_site_likes(site_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_sites
    SET likes = likes + 1
    WHERE id = site_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;