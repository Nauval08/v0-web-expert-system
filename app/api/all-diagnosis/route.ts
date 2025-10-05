import { NextResponse } from "next/server"
import { ForwardChainingEngine } from "@/lib/forward-chaining"

export async function GET() {
  try {
    const engine = new ForwardChainingEngine()
    const diagnosis = await engine.getAllDiagnosis()

    return NextResponse.json({
      success: true,
      data: diagnosis,
    })
  } catch (error) {
    console.error("[v0] Error fetching diagnosis:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data diagnosis",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
