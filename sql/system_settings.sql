-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL DEFAULT '떡상연구소',
  site_description TEXT DEFAULT 'AI 시대를 선도하는 No-Code 교육 플랫폼',
  admin_email VARCHAR(255) NOT NULL DEFAULT 'admin@dduksanglab.com',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  allow_registration BOOLEAN DEFAULT TRUE,
  require_email_verification BOOLEAN DEFAULT TRUE,
  max_file_size INTEGER DEFAULT 5, -- MB
  allowed_file_types TEXT[] DEFAULT ARRAY['jpg', 'jpeg', 'png', 'webp'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO system_settings (id, site_name, site_description, admin_email)
SELECT 
  '00000000-0000-0000-0000-000000000001'::UUID,
  '떡상연구소',
  'AI 시대를 선도하는 No-Code 교육 플랫폼',
  'admin@dduksanglab.com'
WHERE NOT EXISTS (SELECT 1 FROM system_settings LIMIT 1);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read settings
CREATE POLICY "Anyone can read system settings" ON system_settings FOR SELECT USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update system settings" ON system_settings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);