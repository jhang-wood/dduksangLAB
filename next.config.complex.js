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
  
  // 이미지 최적화 (성능 개선)
  images: {
    domains: ['localhost', 'wpzvocfgfwvsxmpckdnu.supabase.co', 'placehold.co'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // 1시간으로 증가
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // 모바일 우선 반응형
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 아이콘 및 썸네일
    loader: 'default',
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wpzvocfgfwvsxmpckdnu.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
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
    
    // 청크 분할 최적화 (성능 개선)
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          // React 코어 번들
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          // Framer Motion 별도 번들
          'framer-motion': {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 35,
            enforce: true,
          },
          // Lucide 아이콘 번들
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide-icons',
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          // Supabase 번들
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 25,
            enforce: true,
          },
          // 차트 라이브러리
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3-)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 20,
          },
          // 공통 벤더 (나머지)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            minChunks: 2,
          },
          // 기본 청크
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    // CSS 최적화
    if (!dev) {
      config.optimization.minimize = true;
      config.optimization.minimizer = config.optimization.minimizer || [];
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
