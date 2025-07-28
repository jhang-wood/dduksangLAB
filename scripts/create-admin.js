const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase 클라이언트 생성 (Service Role Key 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('🚀 관리자 계정 생성을 시작합니다...\n');

  try {
    // 1. Auth 사용자 생성
    console.log('1️⃣ Auth 사용자 생성 중...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@dduksang.com',
      password: 'dduksang2025!@#',
      email_confirm: true,
      user_metadata: {
        name: '떡상연구소 관리자'
      }
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        console.log('ℹ️ 사용자가 이미 존재합니다. 기존 사용자 정보를 가져옵니다...');
        
        // 기존 사용자 정보 가져오기
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
          filter: `email.eq.admin@dduksang.com`
        });

        if (listError) throw listError;
        if (!users || users.length === 0) throw new Error('사용자를 찾을 수 없습니다.');

        const userId = users[0].id;
        console.log(`✅ 기존 사용자 ID: ${userId}\n`);

        // 2. Profile 업데이트
        await updateProfile(userId);
      } else {
        throw authError;
      }
    } else {
      console.log(`✅ Auth 사용자 생성 완료! ID: ${authData.user.id}\n`);
      
      // 2. Profile 생성
      await updateProfile(authData.user.id);
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

async function updateProfile(userId) {
  console.log('2️⃣ Profile 정보 업데이트 중...');
  
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: 'admin@dduksang.com',
      name: '떡상연구소 관리자',
      phone: '010-0000-0000',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    })
    .select();

  if (profileError) {
    throw profileError;
  }

  console.log('✅ Profile 업데이트 완료!\n');

  // 3. 생성된 관리자 정보 확인
  console.log('3️⃣ 생성된 관리자 정보 확인 중...');
  const { data: profile, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'admin@dduksang.com')
    .single();

  if (checkError) {
    throw checkError;
  }

  console.log('\n✨ 관리자 계정이 성공적으로 생성되었습니다!');
  console.log('================================');
  console.log('📧 Email:', profile.email);
  console.log('🔑 Password: dduksang2025!@#');
  console.log('👤 Name:', profile.name);
  console.log('🛡️ Role:', profile.role);
  console.log('📱 Phone:', profile.phone);
  console.log('📅 Created:', new Date(profile.created_at).toLocaleString('ko-KR'));
  console.log('================================\n');
  
  console.log('🎉 이제 admin@dduksang.com 계정으로 로그인할 수 있습니다!');
}

// 스크립트 실행
createAdminUser();