import { Metadata } from 'next';
import { generateLectureMetadata } from './metadata';
import LecturePreviewClient from './page-client';

// Metadata 생성
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return generateLectureMetadata(params.id);
}

export default function LecturePreviewPage({ params }: { params: { id: string } }) {
  return <LecturePreviewClient params={params} />;
}
