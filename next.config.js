/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 최적화 설정
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  
  // 타입스크립트 & ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'lib', 'components'],
  },
  
  // 이미지 최적화
  images: {
    domains: ['localhost', 'wpzvocfgfwvsxmpckdnu.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 리다이렉트
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth/signup',
        permanent: false,
      },
    ];
  },
  
  // Webpack 기본 설정
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;