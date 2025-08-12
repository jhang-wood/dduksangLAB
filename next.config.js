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
    // 서버 사이드에서 self 객체 정의 (가장 먼저 실행)
    if (isServer && typeof global !== 'undefined' && typeof global.self === 'undefined') {
      global.self = global;
    }
    
    // 서버/클라이언트 호환성 문제 해결
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        'ws': false,
        'websocket': false,
      };
    }
    
    // 프로덕션 빌드 최적화 (vendors.js 분할 비활성화)
    if (!dev && isServer) {
      // 서버사이드에서는 청크 분할을 하지 않음
      config.optimization.splitChunks = false;
    }
    
    // Tree shaking 개선
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;
    
    // 글로벌 객체 정의 (self is not defined 오류 해결)
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.DefinePlugin({
        'typeof self': JSON.stringify('object'),
        self: isServer 
          ? 'global' 
          : 'typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {}',
        'process.browser': JSON.stringify(!isServer),
      })
    );
    
    // 추가 webpack 설정으로 self 오류 방지 및 problematic 모듈 무시
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/realtime-js': require.resolve('./lib/mock-realtime.ts'),
    };

    // 클라이언트 사이드에서만 적용되는 fallback
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    
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
  require('./lib/server-polyfill.js');
}

module.exports = nextConfig;
