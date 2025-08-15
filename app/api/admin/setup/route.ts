/**
 * 관리자 계정 설정 API 엔드포인트
 * POST /api/admin/setup
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service Role Key로 관리자 권한 클라이언트 생성
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const ADMIN_EMAIL = 'admin@dduksang.com';
const ADMIN_PASSWORD = 'dduksang2025!@#';

export async function POST(_request: NextRequest) {
  try {
    console.log('🚀 관리자 계정 설정 API 시작');

    // 1. 기존 사용자 확인
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ 사용자 목록 조회 실패:', listError);
      return NextResponse.json({ 
        success: false, 
        error: '사용자 목록 조회 실패',
        details: listError.message 
      }, { status: 500 });
    }

    let userId: string;
    let isNewUser = false;

    // 기존 관리자 계정 확인
    const existingAdmin = existingUsers.users.find(user => user.email === ADMIN_EMAIL);
    
    if (existingAdmin) {
      userId = existingAdmin.id;
      console.log('✅ 기존 관리자 계정 발견:', userId);
    } else {
      // 2. 새 관리자 계정 생성
      console.log('👤 새 관리자 계정 생성 중...');
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true, // 이메일 확인 건너뛰기
      });

      if (createError) {
        console.error('❌ 계정 생성 실패:', createError);
        return NextResponse.json({ 
          success: false, 
          error: '관리자 계정 생성 실패',
          details: createError.message 
        }, { status: 500 });
      }

      userId = newUser.user.id;
      isNewUser = true;
      console.log('✅ 새 관리자 계정 생성 완료:', userId);
    }

    // 3. 프로필 테이블에서 관리자 권한 설정
    console.log('🔧 관리자 프로필 설정 중...');
    
    // 기존 프로필 확인
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      // 기존 프로필 업데이트
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          is_admin: true,
          name: 'dduksangLAB 관리자',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ 프로필 업데이트 실패:', updateError);
        return NextResponse.json({ 
          success: false, 
          error: '프로필 업데이트 실패',
          details: updateError.message 
        }, { status: 500 });
      }

      console.log('✅ 기존 프로필 업데이트 완료');
    } else {
      // 새 프로필 생성
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          is_admin: true,
          name: 'dduksangLAB 관리자',
          email: ADMIN_EMAIL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('❌ 프로필 생성 실패:', insertError);
        return NextResponse.json({ 
          success: false, 
          error: '프로필 생성 실패',
          details: insertError.message 
        }, { status: 500 });
      }

      console.log('✅ 새 프로필 생성 완료');
    }

    // 4. 설정 검증
    console.log('🔍 설정 검증 중...');
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.is_admin) {
      console.error('❌ 관리자 권한 검증 실패');
      return NextResponse.json({ 
        success: false, 
        error: '관리자 권한 설정 검증 실패' 
      }, { status: 500 });
    }

    console.log('🎉 관리자 계정 설정 완료!');

    return NextResponse.json({
      success: true,
      message: '관리자 계정이 성공적으로 설정되었습니다',
      data: {
        userId,
        email: ADMIN_EMAIL,
        isNewUser,
        profile: {
          name: profile.name,
          isAdmin: profile.is_admin,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        }
      }
    });

  } catch (error) {
    console.error('❌ API 실행 중 오류:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'API 실행 중 오류 발생',
      details: error instanceof Error ? error.message : '알 수 없는 오류' 
    }, { status: 500 });
  }
}