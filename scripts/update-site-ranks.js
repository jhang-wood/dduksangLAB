const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSiteRanks() {
  console.log('🏆 사이트 순위 업데이트 시작...');

  try {
    // 모든 활성 사이트를 조회수 순으로 정렬
    const { data: sites, error: fetchError } = await supabase
      .from('user_sites')
      .select('id, name, views_today, views_total')
      .eq('is_active', true)
      .order('views_today', { ascending: false });

    if (fetchError) {
      console.error('❌ 사이트 데이터 조회 오류:', fetchError);
      return;
    }

    if (!sites || sites.length === 0) {
      console.log('⚠️ 업데이트할 사이트가 없습니다.');
      return;
    }

    console.log(`📊 총 ${sites.length}개 사이트의 순위를 업데이트합니다...`);

    // 각 사이트에 순위 부여
    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];
      const newRank = i + 1;

      const { error: updateError } = await supabase
        .from('user_sites')
        .update({ rank_today: newRank })
        .eq('id', site.id);

      if (updateError) {
        console.error(`❌ 사이트 "${site.name}" 순위 업데이트 오류:`, updateError);
      } else {
        console.log(`✅ ${newRank}위: ${site.name} (조회수: ${site.views_today})`);
      }
    }

    console.log('🎉 모든 사이트 순위 업데이트 완료!');

    // 결과 확인
    const { data: updatedSites } = await supabase
      .from('user_sites')
      .select('name, views_today, rank_today')
      .eq('is_active', true)
      .order('rank_today');

    console.log('\n📈 최종 순위:');
    updatedSites?.forEach((site, index) => {
      console.log(`${site.rank_today}위: ${site.name} (${site.views_today} 조회)`);
    });

  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error);
  }
}

updateSiteRanks();