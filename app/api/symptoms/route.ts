import { NextResponse } from "next/server"
import { ForwardChainingEngine } from "@/lib/forward-chaining"

export async function GET() {
  try {
    const engine = new ForwardChainingEngine()
    const symptoms = await engine.getAllSymptoms()

    return NextResponse.json({
      success: true,
      data: symptoms,
    })
  } catch (error) {
    console.error("[v0] Error fetching symptoms:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data gejala",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
