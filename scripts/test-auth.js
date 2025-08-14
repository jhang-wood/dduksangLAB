const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('🧪 Testing Supabase authentication...\n');
  
  // 테스트 사용자 정보
  const testEmail = 'test@dduksang.com';
  const testPassword = 'TestPassword123!';
  
  try {
    // 1. 회원가입 시도
    console.log('📝 Attempting to sign up test user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User'
        }
      }
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('⚠️  User already exists, attempting login...');
      } else {
        console.error('❌ Sign up error:', signUpError.message);
      }
    } else {
      console.log('✅ User created successfully!');
      console.log('   User ID:', signUpData.user?.id);
    }
    
    // 2. 로그인 시도
    console.log('\n🔐 Attempting to log in...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.error('❌ Login error:', loginError.message);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('   User ID:', loginData.user?.id);
    console.log('   Email:', loginData.user?.email);
    
    // 3. 프로필 조회
    console.log('\n👤 Fetching user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loginData.user?.id)
      .single();
    
    if (profileError) {
      console.log('⚠️  Profile not found:', profileError.message);
      console.log('   Creating profile...');
      
      // 프로필 생성
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: loginData.user?.id,
          email: loginData.user?.email,
          name: 'Test User',
          role: 'user',
          is_admin: false
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating profile:', createError.message);
      } else {
        console.log('✅ Profile created successfully!');
        console.log('   Profile:', newProfile);
      }
    } else {
      console.log('✅ Profile found!');
      console.log('   Profile:', profile);
    }
    
    // 4. 로그아웃
    console.log('\n🚪 Logging out...');
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      console.error('❌ Logout error:', logoutError.message);
    } else {
      console.log('✅ Logged out successfully!');
    }
    
    console.log('\n🎉 Authentication test completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// 실행
testAuth();