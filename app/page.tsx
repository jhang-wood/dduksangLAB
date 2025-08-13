// Next.js 14 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import ClientHomePage from './client-page';

export default function HomePage() {
  return <ClientHomePage />;
}