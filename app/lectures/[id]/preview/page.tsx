'use client';

// 전체 앱 CSR 전환으로 단순화
export const dynamic = 'force-dynamic';

import LecturePreviewClient from './page-client';

export default function LecturePreviewPage({ params }: { params: { id: string } }) {
  return <LecturePreviewClient params={params} />;
}
