// Next.js 14 프리렌더링 완전 비활성화 - Context 에러 방지
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

import nextDynamic from 'next/dynamic';

// 완전 클라이언트 전용 로딩 - SSR 우회
const SignupPageClient = nextDynamic(() => import('./page-client'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ color: '#ffd700' }}>회원가입 페이지 로딩 중...</div>
    </div>
  )
});

export default function SignupPage() {
  return <SignupPageClient />;
}