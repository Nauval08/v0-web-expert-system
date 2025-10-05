import { NextResponse } from "next/server"
import { getDbPool } from "@/lib/db"

export async function GET() {
  try {
    const pool = getDbPool()
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()

    return NextResponse.json({
      success: true,
      message: "Database connection is healthy",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Database health check failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
