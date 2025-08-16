/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  images: {
    domains: ['localhost', 'wpzvocfgfwvsxmpckdnu.supabase.co', 'placehold.co', 'picsum.photos', 'source.unsplash.com', 'images.unsplash.com'],
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable webpack cache to avoid memory issues
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
