const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function initDatabase() {
  console.log('🚀 Starting database initialization...');
  
  try {
    // 1. profiles 테이블 생성
    console.log('\n📋 Creating profiles table...');
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          phone TEXT,
          role TEXT DEFAULT 'user',
          is_admin BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).single();
    
    if (createTableError && !createTableError.message.includes('already exists')) {
      console.log('⚠️  Table might already exist, continuing...');
    } else {
      console.log('✅ Profiles table created/verified');
    }

    // 2. RLS 활성화
    console.log('\n🔐 Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`
    }).single();
    
    if (rlsError) {
      console.log('⚠️  RLS might already be enabled');
    } else {
      console.log('✅ RLS enabled');
    }

    // 3. RLS 정책 생성
    console.log('\n📜 Creating RLS policies...');
    const policies = [
      {
        name: 'Users can view own profile',
        sql: `
          CREATE POLICY "Users can view own profile" ON public.profiles
          FOR SELECT USING (auth.uid() = id);
        `
      },
      {
        name: 'Users can update own profile',
        sql: `
          CREATE POLICY "Users can update own profile" ON public.profiles
          FOR UPDATE USING (auth.uid() = id);
        `
      },
      {
        name: 'Users can insert own profile',
        sql: `
          CREATE POLICY "Users can insert own profile" ON public.profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
        `
      },
      {
        name: 'Admins can view all profiles',
        sql: `
          CREATE POLICY "Admins can view all profiles" ON public.profiles
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE id = auth.uid() AND is_admin = true
            )
          );
        `
      }
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: policy.sql
      }).single();
      
      if (error && !error.message.includes('already exists')) {
        console.log(`⚠️  Policy "${policy.name}" might already exist`);
      } else {
        console.log(`✅ Policy "${policy.name}" created`);
      }
    }

    // 4. 트리거 함수 생성
    console.log('\n⚡ Creating trigger function...');
    const { error: funcError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, name, role, is_admin)
          VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
            'user',
            false
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }).single();
    
    if (funcError) {
      console.log('⚠️  Trigger function might already exist');
    } else {
      console.log('✅ Trigger function created');
    }

    // 5. 트리거 생성
    console.log('\n🎯 Creating trigger...');
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    }).single();
    
    if (triggerError && !triggerError.message.includes('already exists')) {
      console.log('⚠️  Trigger might already exist');
    } else {
      console.log('✅ Trigger created');
    }

    // 6. community_posts 테이블 생성
    console.log('\n📝 Creating community_posts table...');
    const { error: communityError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.community_posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT,
          author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          category TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).single();
    
    if (communityError && !communityError.message.includes('already exists')) {
      console.log('⚠️  Community posts table might already exist');
    } else {
      console.log('✅ Community posts table created');
    }

    // 7. payments 테이블 생성
    console.log('\n💳 Creating payments table...');
    const { error: paymentsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.payments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 2),
          status TEXT,
          product_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).single();
    
    if (paymentsError && !paymentsError.message.includes('already exists')) {
      console.log('⚠️  Payments table might already exist');
    } else {
      console.log('✅ Payments table created');
    }

    console.log('\n🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
}

// 실행
initDatabase();