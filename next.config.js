/** @type {import('next').NextConfig} */
const nextConfig = {
  // 최대한 단순화 - 성능 최적화
  poweredByHeader: false,
  compress: true,  // 압축 활성화로 성능 향상
  reactStrictMode: false,  // strict mode 완전 비활성화
  swcMinify: true,  // SWC minify 활성화로 최적화
  
  // 완전 무음 빌드 설정
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // 경고 완전 차단
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  
  // ESLint 출력 최소화
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'lib', 'components'],
  },
  
  // 동적 빌드 ID로 캐싱 이슈 방지
  async generateBuildId() {
    return 'dynamic-' + Date.now();
  },
  
  // 동적 렌더링 강제 설정 - useContext 에러 해결
  // output: 'standalone', // Remove to avoid error page issues
  experimental: {
    serverComponentsExternalPackages: [],
    // 완전 동적 렌더링 활성화
    esmExternals: 'loose',
  },
  
  // 동적 렌더링 설정
  skipTrailingSlashRedirect: true,
  
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
  
  // Webpack 최적화 설정 - Supabase 경고 해결 포함
  webpack: (config, { dev, isServer }) => {
    // 기본 fallback 설정
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    // Supabase realtime-js 경고 완전 제거
    config.module.exprContextCritical = false;
    
    // 모든 동적 import 경고 제거 (성능 최적화)
    config.module.unknownContextCritical = false;
    config.module.unknownContextRegExp = /^\.\/.*$/;
    config.module.unknownContextRequest = '.';
    
    // 빌드 출력 최적화
    if (!dev) {
      config.stats = 'errors-only';
      // Supabase 관련 경고 완전 무시
      config.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /Critical dependency: require function is used in a way/,
        /Module not found: Can't resolve 'bufferutil'/,
        /Module not found: Can't resolve 'utf-8-validate'/,
      ];
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
