import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 간단한 기본 미들웨어로 임시 교체
  const response = NextResponse.next();
  
  // 기본 보안 헤더만 설정
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: [
    '/((?\!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
