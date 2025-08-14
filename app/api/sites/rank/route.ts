import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('🏆 사이트 순위 업데이트 시작...');

    // 모든 활성 사이트를 조회수 순으로 정렬
    const { data: sites, error: fetchError } = await supabase
      .from('user_sites')
      .select('id, views_today')
      .eq('is_active', true)
      .order('views_today', { ascending: false });

    if (fetchError) {
      console.error('사이트 데이터 조회 오류:', fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    if (!sites || sites.length === 0) {
      return NextResponse.json({ success: true, message: '업데이트할 사이트가 없습니다.' });
    }

    console.log(`📊 총 ${sites.length}개 사이트의 순위를 업데이트합니다...`);

    // 각 사이트에 순위 부여 (1위부터)
    const updatePromises = sites.map(async (site, index) => {
      const newRank = index + 1;
      
      const { error: updateError } = await supabase
        .from('user_sites')
        .update({ rank_today: newRank })
        .eq('id', site.id);

      if (updateError) {
        console.error(`사이트 ${site.id} 순위 업데이트 오류:`, updateError);
        return { id: site.id, success: false, error: updateError.message };
      }

      return { id: site.id, rank: newRank, success: true };
    });

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`✅ 순위 업데이트 완료: 성공 ${successCount}개, 실패 ${errorCount}개`);

    return NextResponse.json({
      success: true,
      message: `순위 업데이트 완료`,
      results: {
        total: sites.length,
        success: successCount,
        errors: errorCount
      }
    });

  } catch (error) {
    console.error('순위 업데이트 중 예상치 못한 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}