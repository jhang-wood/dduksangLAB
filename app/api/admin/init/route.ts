import { NextResponse } from 'next/server';
import { initializeAdminUser, checkAdminExists } from '@/lib/admin-utils';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    logger.log('[API] Admin initialization requested');

    // Check if admin already exists
    const adminExists = await checkAdminExists();
    
    if (adminExists) {
      return NextResponse.json(
        { success: false, message: '관리자가 이미 존재합니다.' },
        { status: 400 }
      );
    }

    // Initialize admin user
    const result = await initializeAdminUser();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '관리자 계정이 생성되었습니다.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'error' in result ? result.error : '알 수 없는 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('[API] Admin initialization error:', error);
    return NextResponse.json(
      { success: false, error: '관리자 초기화 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const adminExists = await checkAdminExists();
    
    return NextResponse.json({
      success: true,
      adminExists,
    });
  } catch (error) {
    logger.error('[API] Admin check error:', error);
    return NextResponse.json(
      { success: false, error: '관리자 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}