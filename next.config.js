/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental.appDir 제거 - Next.js 14에서는 불필요
  images: {
    domains: ['localhost', 'wpzvocfgfwvsxmpckdnu.supabase.co'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}