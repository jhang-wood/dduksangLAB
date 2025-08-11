/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental.appDir 제거 - Next.js 14에서는 불필요
  images: {
    domains: ['localhost', 'wpzvocfgfwvsxmpckdnu.supabase.co'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: false, // ESLint 검사 활성화
    dirs: ['app', 'lib', 'components'],
  },
  typescript: {
    ignoreBuildErrors: false, // TypeScript 검사 활성화
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