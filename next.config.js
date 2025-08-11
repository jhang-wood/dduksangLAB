/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental.appDir 제거 - Next.js 14에서는 불필요
  images: {
    domains: ['localhost', 'wpzvocfgfwvsxmpckdnu.supabase.co'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: false, // ESLint는 계속 검사 (코드 품질 유지)
    dirs: ['app', 'lib', 'components'],
  },
  typescript: {
    // TODO: TYPESCRIPT_DEBT.md 참조 - 점진적 개선 중
    ignoreBuildErrors: true,  // 임시: 60개+ 오류 해결 중
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
    ]
  },
}

module.exports = nextConfig