import { NextResponse } from "next/server"
import { ForwardChainingEngine } from "@/lib/forward-chaining"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { symptoms } = body

    // Validasi input
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Gejala tidak valid. Pilih minimal 1 gejala.",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Processing diagnosis for symptoms:", symptoms)

    // Proses forward chaining
    const engine = new ForwardChainingEngine()
    const results = await engine.diagnose(symptoms)

    console.log("[v0] Diagnosis results:", results)

    // Simpan ke riwayat
    if (results.length > 0) {
      await engine.saveHistory(symptoms, results[0])
    } else {
      await engine.saveHistory(symptoms, null)
    }

    // Return hasil
    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          found: false,
          message: "Tidak ditemukan diagnosis yang cocok dengan gejala yang dipilih. Silakan konsultasi dengan dokter.",
          results: [],
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        found: true,
        results: results,
        primary_diagnosis: results[0],
      },
    })
  } catch (error) {
    console.error("[v0] Error processing diagnosis:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses diagnosis",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
