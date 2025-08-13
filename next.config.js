/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화 설정
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  
  // 실험적 기능 (성능 개선)
  experimental: {
    optimizeCss: false,
    serverComponentsExternalPackages: [],
  },
  
  // 이미지 최적화
  images: {
    domains: ['localhost', 'wpzvocfgfwvsxmpckdnu.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // 컴파일 최적화
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'lib', 'components'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // 번들 최적화
  webpack: (config, { dev, isServer }) => {
    // fallback 설정
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    // Tree shaking 강화 (개발 모드에서는 비활성화)
    if (!dev) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    // 청크 분할 최적화
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide',
            chunks: 'all',
            priority: 20,
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }
    
    return config;
  },

  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, nosnippet, noarchive',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

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
};

// 서버 시작 시 polyfill 로드
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  require('./polyfills.js');
}

module.exports = nextConfig;
