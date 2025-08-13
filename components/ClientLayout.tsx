import dynamic from 'next/dynamic';

// 완전 클라이언트 전용 헤더 - SSR 우회
const HeaderSimple = dynamic(() => import('./HeaderSimple'), {
  ssr: false,
  loading: () => <div style={{ height: '64px', backgroundColor: '#0f0f0f' }} />
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#f5f5f5' }}>
      <HeaderSimple />
      <main style={{ paddingTop: '64px' }}>
        {children}
      </main>
    </div>
  );
}