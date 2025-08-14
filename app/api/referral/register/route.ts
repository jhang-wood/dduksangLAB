import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { referral_code, referee_id } = await request.json();

    if (!referral_code || !referee_id) {
      return NextResponse.json(
        { success: false, error: '추천코드와 사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 먼저 추천코드 유효성 재확인
    const { data: referralCodeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('user_id, code, is_active, usage_count, max_usage')
      .eq('code', referral_code.toString().toUpperCase())
      .eq('is_active', true)
      .single();

    if (codeError || !referralCodeData) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 추천코드입니다.' },
        { status: 400 }
      );
    }

    const referrer_id = referralCodeData.user_id;

    // 자기 자신을 추천할 수 없음
    if (referrer_id === referee_id) {
      return NextResponse.json(
        { success: false, error: '자기 자신의 추천코드는 사용할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 이미 추천받은 사용자인지 확인
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referee_id', referee_id)
      .single();

    if (existingReferral) {
      return NextResponse.json(
        { success: false, error: '이미 추천을 받은 사용자입니다.' },
        { status: 400 }
      );
    }

    // Supabase 트랜잭션 시뮬레이션 (여러 작업을 순차 실행)
    
    // 1. 추천인 관계 생성
    const { data: referralData, error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id,
        referee_id,
        referral_code: referral_code.toUpperCase(),
        status: 'pending'
      })
      .select()
      .single();

    if (referralError) {
      console.error('추천인 관계 생성 오류:', referralError);
      return NextResponse.json(
        { success: false, error: '추천인 관계 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 2. 추천코드 사용 횟수 증가
    const { error: updateError } = await supabase
      .from('referral_codes')
      .update({ 
        usage_count: (referralCodeData.usage_count || 0) + 1 
      })
      .eq('code', referral_code.toUpperCase());

    if (updateError) {
      console.error('추천코드 사용 횟수 업데이트 오류:', updateError);
      // 추천 관계는 생성되었으므로 계속 진행
    }

    // 3. 피추천인에게 가입 보너스 지급 (500P)
    try {
      await supabase.rpc('update_user_points', {
        p_user_id: referee_id,
        p_amount: 500,
        p_transaction_type: 'earned',
        p_source: 'signup_bonus',
        p_reference_id: referralData.id,
        p_description: '추천코드 사용 가입 보너스'
      });
    } catch (pointsError) {
      console.error('가입 보너스 지급 오류:', pointsError);
      // 추천 관계는 생성되었으므로 계속 진행
    }

    // 4. 추천인 정보 조회
    const { data: referrerInfo } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', referrer_id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        referral_id: referralData.id,
        referrer_name: referrerInfo?.name || '추천인',
        bonus_points: 500,
        message: `${referrerInfo?.name || '추천인'}님의 추천으로 500P를 받았습니다!`
      }
    });

  } catch (error) {
    console.error('추천인 등록 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 사용자의 추천 현황 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자의 추천 현황 조회
    const { data: referralStats } = await supabase
      .from('referrals')
      .select(`
        id,
        status,
        points_awarded,
        created_at,
        completed_at,
        profiles:referee_id (
          name,
          email
        )
      `)
      .eq('referrer_id', user_id)
      .order('created_at', { ascending: false });

    // 추천코드 정보 조회
    const { data: referralCode } = await supabase
      .from('referral_codes')
      .select('code, usage_count, max_usage')
      .eq('user_id', user_id)
      .single();

    // 포인트 정보 조회
    const { data: pointsInfo } = await supabase
      .from('user_points')
      .select('total_points, cashable_points, lifetime_earned')
      .eq('user_id', user_id)
      .single();

    const totalReferrals = referralStats?.length || 0;
    const completedReferrals = referralStats?.filter(r => r.status === 'completed').length || 0;
    const totalEarned = referralStats?.reduce((sum, r) => sum + (r.points_awarded || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        referral_code: referralCode?.code,
        total_referrals: totalReferrals,
        completed_referrals: completedReferrals,
        total_points_earned: totalEarned,
        current_points: pointsInfo?.total_points || 0,
        cashable_points: pointsInfo?.cashable_points || 0,
        referrals: referralStats || []
      }
    });

  } catch (error) {
    console.error('추천 현황 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}