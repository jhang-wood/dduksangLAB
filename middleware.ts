import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 기본 보안 헤더 설정
  const securityHeaders = {
    // XSS 보호
    'X-XSS-Protection': '1; mode=block',

    // MIME 타입 스니핑 방지
    'X-Content-Type-Options': 'nosniff',

    // 클릭재킹 방지
    'X-Frame-Options': 'DENY',

    // DNS 프리페칭 제어
    'X-DNS-Prefetch-Control': 'on',

    // 추천인 정책
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // 권한 정책 (카메라, 마이크, 위치 비활성화)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',

    // 스트릭트 전송 보안 (HTTPS 강제)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };

  // CSP 헤더 설정
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.tosspayments.com https://cdn.jsdelivr.net https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https: wss: *.supabase.co *.supabase.io;
    frame-src 'self' https://js.tosspayments.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  // 보안 헤더 적용
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // CSP 헤더 설정
  response.headers.set('Content-Security-Policy', cspHeader);

  // API 라우트에 대한 추가 보안
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // API 엔드포인트 검색 엔진 인덱싱 방지
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive');

    // CORS 기본 설정 - www 서브도메인 포함
    const origin = request.headers.get('origin');
    const allowedOrigins = ['https://dduksang.com', 'https://www.dduksang.com'];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', 'https://www.dduksang.com');
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
  }


  // 관리자 페이지 접근 제한
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 프로덕션에서는 IP 화이트리스트 체크 가능
    const adminAllowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') ?? [];
    const clientIP =
      request.ip ?? request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip');

    if (process.env.NODE_ENV === 'production' && adminAllowedIPs.length > 0) {
      if (!clientIP || !adminAllowedIPs.includes(clientIP)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
