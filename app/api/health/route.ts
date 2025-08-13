import { NextResponse } from "next/server";
import { dataSourceMode } from "@/lib/data/provider";

/**
 * Health check endpoint
 * Returns current system status and data source mode
 */
export async function GET() {
  try {
    const healthData = {
      ok: true,
      mode: dataSourceMode,
      timestamp: new Date().toISOString(),
      status: "healthy"
    };

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        mode: "ERROR",
        timestamp: new Date().toISOString(),
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}