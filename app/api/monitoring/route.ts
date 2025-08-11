/**
 * 모니터링 API 엔드포인트 (기본 상태 응답)
 * TODO: 향후 완전한 모니터링 시스템 구현
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        api: 'healthy',
        frontend: 'healthy'
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Monitoring system unavailable',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'POST method not implemented' },
    { status: 501 }
  );
}