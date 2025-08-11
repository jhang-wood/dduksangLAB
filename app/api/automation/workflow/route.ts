import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      orchestrator: { isRunning: true, uptime: 0 },
      components: { status: "healthy" }
    },
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const { action } = await request.json();
  
  return NextResponse.json({
    success: true,
    data: { message: `${action} 실행됨` },
    timestamp: new Date().toISOString()
  });
}
