import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: '추천코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 추천코드 유효성 검증
    const { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select(`
        id,
        user_id,
        code,
        is_active,
        usage_count,
        max_usage,
        expires_at,
        profiles:user_id (
          id,
          name,
          email
        )
      `)
      .eq('code', code.toString().toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !referralCode) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 추천코드입니다.' },
        { status: 404 }
      );
    }

    // 만료일 확인
    if (referralCode.expires_at && new Date(referralCode.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: '만료된 추천코드입니다.' },
        { status: 400 }
      );
    }

    // 사용 횟수 확인
    if (referralCode.max_usage && referralCode.usage_count >= referralCode.max_usage) {
      return NextResponse.json(
        { success: false, error: '사용 한도를 초과한 추천코드입니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        code: referralCode.code,
        referrer_id: referralCode.user_id,
        referrer_name: (referralCode.profiles as any)?.name || '추천인',
        usage_count: referralCode.usage_count,
        max_usage: referralCode.max_usage
      }
    });

  } catch (error) {
    console.error('추천코드 검증 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, error: '추천코드가 필요합니다.' },
        { status: 400 }
      );
    }

    // GET 방식으로도 검증 가능하도록
    const { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select(`
        code,
        is_active,
        usage_count,
        max_usage,
        expires_at,
        profiles:user_id (
          name
        )
      `)
      .eq('code', code.toString().toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !referralCode) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 추천코드입니다.' },
        { status: 404 }
      );
    }

    // 간단한 검증 정보만 반환
    return NextResponse.json({
      success: true,
      data: {
        code: referralCode.code,
        referrer_name: (referralCode.profiles as any)?.name || '추천인',
        is_valid: true
      }
    });

  } catch (error) {
    console.error('추천코드 검증 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}