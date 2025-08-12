import { NextResponse } from 'next/server';

// Simplified AI trends API without Supabase realtime issues
export async function GET() {
  try {
    // Mock data for immediate 404 fix
    const mockData = [
      {
        id: '1',
        title: 'ChatGPT-4의 새로운 멀티모달 기능',
        slug: 'chatgpt-4-multimodal-features',
        summary: 'OpenAI가 발표한 ChatGPT-4의 새로운 멀티모달 기능에 대해 알아보세요.',
        thumbnail_url: '/images/default-ai-thumbnail.jpg',
        category: 'AI 기술',
        tags: ['ChatGPT', 'OpenAI', '멀티모달'],
        published_at: new Date().toISOString(),
        view_count: 1234,
        is_featured: true,
      },
      {
        id: '2',
        title: 'GitHub Copilot Chat의 새로운 업데이트',
        slug: 'github-copilot-chat-update',
        summary: 'GitHub Copilot Chat의 최신 업데이트 기능을 살펴보고 개발 생산성을 높여보세요.',
        thumbnail_url: '/images/default-ai-thumbnail.jpg',
        category: 'AI 도구',
        tags: ['GitHub', 'Copilot', '개발도구'],
        published_at: new Date().toISOString(),
        view_count: 856,
        is_featured: false,
      },
    ];

    return NextResponse.json({
      data: mockData,
      pagination: {
        page: 1,
        limit: 12,
        total: mockData.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('Error fetching AI trends:', error);
    return NextResponse.json({ error: 'Failed to fetch AI trends' }, { status: 500 });
  }
}