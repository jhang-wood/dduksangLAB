import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 사용자 게임 통계 조회
    let { data: stats, error } = await supabase
      .from('user_game_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 통계가 없으면 생성
    if (!stats) {
      const { data: newStats } = await supabase
        .from('user_game_stats')
        .insert({ user_id: user.id })
        .select()
        .single();
      
      stats = newStats;
    }

    // 레벨 정보 조회
    const { data: levelInfo } = await supabase
      .from('level_definitions')
      .select('*')
      .eq('level', stats?.level || 1)
      .single();

    // 프로필 정보 조회
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, email, avatar_url')
      .eq('id', user.id)
      .single();

    return NextResponse.json({ 
      stats: {
        ...stats,
        levelInfo,
        profile
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}