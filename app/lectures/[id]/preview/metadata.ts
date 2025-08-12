import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateLectureMetadata(id: string): Promise<Metadata> {
  try {
    const { data: lecture } = await supabase.from('lectures').select('*').eq('id', id).single();

    if (!lecture) {
      return {
        title: '강의를 찾을 수 없습니다 | dduksangLAB',
        description: 'dduksangLAB에서 제공하는 강의 정보를 찾을 수 없습니다.',
      };
    }

    const title = `${lecture.title} | dduksangLAB`;
    const description =
      lecture.description ??
      `${lecture.title} 강의를 dduksangLAB에서 만나보세요. ${lecture.instructor_name} 강사님의 전문적인 강의로 실무 역량을 키워보세요.`;

    return {
      title,
      description,
      keywords: [
        lecture.title,
        lecture.category,
        lecture.instructor_name,
        'dduksangLAB',
        '온라인 강의',
        '실무 교육',
        ...(lecture.tags ?? []),
      ],
      authors: [{ name: lecture.instructor_name }],
      creator: lecture.instructor_name,
      publisher: 'dduksangLAB',
      openGraph: {
        title,
        description,
        url: `https://dduksanglab.com/lectures/${id}/preview`,
        siteName: 'dduksangLAB',
        images: lecture.thumbnail_url
          ? [
              {
                url: lecture.thumbnail_url,
                width: 1200,
                height: 630,
                alt: lecture.title,
              },
            ]
          : [
              {
                url: 'https://dduksanglab.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'dduksangLAB - 실무 중심 온라인 교육 플랫폼',
              },
            ],
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: lecture.thumbnail_url
          ? [lecture.thumbnail_url]
          : ['https://dduksanglab.com/og-image.jpg'],
        creator: '@dduksangLAB',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: `https://dduksanglab.com/lectures/${id}/preview`,
      },
      other: {
        'price:amount': lecture.price.toString(),
        'price:currency': 'KRW',
        'course:duration': Math.ceil(lecture.duration / 60).toString(),
        'course:level': lecture.level,
        'course:category': lecture.category,
        'course:instructor': lecture.instructor_name,
      },
    };
  } catch (error) {
    console.error('Error generating lecture metadata:', error);
    return {
      title: 'dduksangLAB - 실무 중심 온라인 교육',
      description: '실무에 바로 적용할 수 있는 고품질 온라인 강의를 제공합니다.',
    };
  }
}
