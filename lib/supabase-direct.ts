/**
 * Supabase 직접 SDK 연결
 * MCP 서버 버그로 인한 대체 솔루션
 */

import { createClient } from '@supabase/supabase-js';

// 환경변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Supabase 클라이언트 생성 (Service Role Key 사용 - 전체 권한)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * 테이블 생성 테스트
 */
export async function createTestTable() {
  try {
    console.log('📊 테스트 테이블 생성 시작...');
    
    // SQL 쿼리로 테이블 생성
    const { data, error } = await supabaseAdmin.rpc('query', {
      query: `
        CREATE TABLE IF NOT EXISTS mcp_test_table (
          id SERIAL PRIMARY KEY,
          test_name VARCHAR(255) NOT NULL,
          test_value INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `
    }).single();

    if (error) {
      // RPC가 없는 경우 대체 방법
      console.log('⚠️ RPC 사용 불가, 대체 방법 시도...');
      return { success: false, error: error.message };
    }

    console.log('✅ 테스트 테이블 생성 완료');
    return { success: true, data };
  } catch (err) {
    console.error('❌ 테이블 생성 실패:', err);
    return { success: false, error: err };
  }
}

/**
 * 테스트 데이터 삽입
 */
export async function insertTestData() {
  try {
    console.log('📝 테스트 데이터 삽입 중...');
    
    // automation_logs 테이블에 테스트 데이터 삽입 (이미 존재하는 테이블)
    const { data, error } = await supabaseAdmin
      .from('automation_logs')
      .insert([
        {
          type: 'health_check',
          status: 'info',
          message: 'Supabase Direct SDK 테스트',
          metadata: { 
            test: true,
            source: 'supabase-direct.ts',
            timestamp: new Date().toISOString()
          }
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ 데이터 삽입 실패:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ 테스트 데이터 삽입 완료:', data.id);
    return { success: true, data };
  } catch (err) {
    console.error('❌ 예외 발생:', err);
    return { success: false, error: err };
  }
}

/**
 * 테스트 데이터 조회
 */
export async function selectTestData() {
  try {
    console.log('🔍 테스트 데이터 조회 중...');
    
    const { data, error } = await supabaseAdmin
      .from('automation_logs')
      .select('*')
      .eq('type', 'health_check')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ 데이터 조회 실패:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ ${data.length}개의 테스트 데이터 조회 완료`);
    return { success: true, data };
  } catch (err) {
    console.error('❌ 예외 발생:', err);
    return { success: false, error: err };
  }
}

/**
 * 테스트 데이터 삭제
 */
export async function deleteTestData(id: string) {
  try {
    console.log('🗑️ 테스트 데이터 삭제 중...');
    
    const { error } = await supabaseAdmin
      .from('automation_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ 데이터 삭제 실패:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ 테스트 데이터 삭제 완료');
    return { success: true };
  } catch (err) {
    console.error('❌ 예외 발생:', err);
    return { success: false, error: err };
  }
}

/**
 * 전체 테스트 실행
 */
export async function runFullTest() {
  console.log('🚀 Supabase Direct SDK 전체 테스트 시작\n');
  
  // 1. 데이터 삽입 테스트
  const insertResult = await insertTestData();
  if (!insertResult.success) {
    console.error('테스트 실패: 데이터 삽입 불가');
    return false;
  }
  
  const testId = insertResult.data?.id;
  console.log(`📌 테스트 ID: ${testId}\n`);
  
  // 2. 데이터 조회 테스트
  const selectResult = await selectTestData();
  if (!selectResult.success) {
    console.error('테스트 실패: 데이터 조회 불가');
    return false;
  }
  
  // 3. 데이터 삭제 테스트
  if (testId) {
    const deleteResult = await deleteTestData(testId);
    if (!deleteResult.success) {
      console.error('테스트 실패: 데이터 삭제 불가');
      return false;
    }
  }
  
  console.log('\n🎉 모든 테스트 통과!');
  console.log('✅ Supabase Direct SDK가 정상적으로 작동합니다.');
  return true;
}

/**
 * 연결 테스트
 */
export async function testConnection() {
  try {
    console.log('🔌 Supabase 연결 테스트 중...');
    
    const { count, error } = await supabaseAdmin
      .from('automation_logs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ 연결 실패:', error);
      return false;
    }

    console.log(`✅ 연결 성공! (테이블에 ${count}개의 레코드 존재)`);
    return true;
  } catch (err) {
    console.error('❌ 연결 테스트 실패:', err);
    return false;
  }
}