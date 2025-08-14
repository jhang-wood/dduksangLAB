import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 오늘의 미션 조회
    const today = new Date().toISOString().split('T')[0];
    
    const { data: missions, error } = await supabase
      .from('user_missions')
      .select(`
        *,
        mission:mission_definitions(*)
      `)
      .eq('user_id', user.id)
      .gte('created_at', today)
      .lt('created_at', `${today}T23:59:59`);

    if (error) throw error;

    // 미션이 없으면 생성
    if (!missions || missions.length === 0) {
      // 일일 미션 정의 가져오기
      const { data: definitions } = await supabase
        .from('mission_definitions')
        .select('*')
        .eq('mission_type', 'daily')
        .eq('is_active', true);

      if (definitions && definitions.length > 0) {
        // 미션 생성
        const newMissions = definitions.map(def => ({
          user_id: user.id,
          mission_id: def.id,
          expires_at: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
        }));

        const { data: created } = await supabase
          .from('user_missions')
          .insert(newMissions)
          .select(`
            *,
            mission:mission_definitions(*)
          `);

        return NextResponse.json({ missions: created || [] });
      }
    }

    return NextResponse.json({ missions: missions || [] });
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { missionId, progress } = body;

    // 미션 진행도 업데이트
    const { data: mission, error } = await supabase
      .from('user_missions')
      .update({ 
        progress,
        is_completed: progress >= body.target,
        completed_at: progress >= body.target ? new Date().toISOString() : null
      })
      .eq('id', missionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ mission });
  } catch (error) {
    console.error('Error updating mission:', error);
    return NextResponse.json(
      { error: 'Failed to update mission' },
      { status: 500 }
    );
  }
}