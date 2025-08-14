import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(_request: Request) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 사용자의 사이트 목록 조회
    const { data: sites, error } = await supabase
      .from('user_sites')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('views_today', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Error fetching user sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, url, description, category } = body;

    // 사이트 등록
    const { data: site, error } = await supabase
      .from('user_sites')
      .insert({
        user_id: user.id,
        name,
        url,
        description,
        category
      })
      .select()
      .single();

    if (error) throw error;

    // 포인트 지급
    await supabase.rpc('award_points', {
      p_user_id: user.id,
      p_amount: 150,
      p_source: 'site_registration',
      p_description: '새 사이트 등록'
    });

    return NextResponse.json({ site });
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}