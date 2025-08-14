import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(_request: Request) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 오늘의 조회수 랭킹 TOP 10
    const { data: topSites, error } = await supabase
      .from('user_sites')
      .select(`
        *,
        user:profiles!user_id(name)
      `)
      .eq('is_active', true)
      .order('views_today', { ascending: false })
      .limit(10);

    if (error) throw error;

    // 내 사이트의 순위 찾기
    const { data: mySites } = await supabase
      .from('user_sites')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('views_today', { ascending: false })
      .limit(1);

    let myRank = null;
    if (mySites && mySites.length > 0) {
      const { count } = await supabase
        .from('user_sites')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gt('views_today', mySites[0].views_today);
      
      myRank = {
        rank: (count || 0) + 1,
        site: mySites[0]
      };
    }

    // 랭킹 데이터 포맷팅
    const rankings = topSites?.map((site, index) => ({
      rank: index + 1,
      name: site.user?.name || 'Unknown',
      siteName: site.name,
      views: site.views_today,
      isMe: site.user_id === user.id
    })) || [];

    // 내가 TOP 10 밖이면 내 순위 추가
    if (myRank && myRank.rank > 10) {
      rankings.push({
        rank: myRank.rank,
        name: 'Me',
        siteName: myRank.site.name,
        views: myRank.site.views_today,
        isMe: true
      });
    }

    return NextResponse.json({ rankings });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}