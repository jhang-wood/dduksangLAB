/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화 설정
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  
  // 실험적 기능 (성능 개선)
  experimental: {
    optimizeCss: false, // critters 모듈 오류로 인해 비활성화
    serverComponentsExternalPackages: [],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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
    ignoreDuringBuilds: false, // ESLint 오류 검사 활성화
    dirs: ['app', 'lib', 'components'],
  },
  typescript: {
    ignoreBuildErrors: false, // TypeScript 오류 검사 활성화
  },
  
  // 번들 최적화
  webpack: (config, { dev, isServer }) => {
    // fallback 설정 통합
    const fallbackConfig = {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    if (isServer) {
      fallbackConfig['ws'] = false;
      fallbackConfig['websocket'] = false;
    }
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...fallbackConfig,
    };
    
    // Tree shaking 개선
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;
    
    return config;
  },

  async headers() {
    return [
      {
        source: '/((?\!api/).*)',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, nosnippet, noarchive',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
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
