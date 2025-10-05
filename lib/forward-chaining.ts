import { query } from "./db"

export interface Gejala {
  id: number
  kode_gejala: string
  nama_gejala: string
  deskripsi: string
}

export interface Diagnosis {
  id: number
  kode_diagnosis: string
  nama_diagnosis: string
  deskripsi: string
  penanganan: string
}

export interface Aturan {
  id: number
  kode_aturan: string
  kode_diagnosis: string
  gejala_required: string[]
  confidence_level: number
}

export interface DiagnosisResult {
  diagnosis: Diagnosis
  confidence: number
  matched_rules: string[]
  matched_symptoms: string[]
}

/**
 * Forward Chaining Engine
 * Memproses gejala input dan mencocokkan dengan aturan untuk menghasilkan diagnosis
 */
export class ForwardChainingEngine {
  /**
   * Proses diagnosis berdasarkan gejala yang dipilih
   */
  async diagnose(selectedSymptoms: string[]): Promise<DiagnosisResult[]> {
    // Ambil semua aturan dari database
    const rules = await query<Aturan[]>("SELECT * FROM aturan ORDER BY confidence_level DESC")

    // Parse gejala_required dari JSON string ke array
    const parsedRules = rules.map((rule) => ({
      ...rule,
      gejala_required: JSON.parse(rule.gejala_required),
    }))

    // Cari aturan yang cocok dengan gejala input
    const matchedRules: Array<{
      rule: Aturan
      matchedSymptoms: string[]
    }> = []

    for (const rule of parsedRules) {
      // Cek apakah semua gejala yang diperlukan ada dalam input
      const allSymptomsMatch = rule.gejala_required.every((required) => selectedSymptoms.includes(required))

      if (allSymptomsMatch) {
        matchedRules.push({
          rule,
          matchedSymptoms: rule.gejala_required,
        })
      }
    }

    // Jika tidak ada aturan yang cocok
    if (matchedRules.length === 0) {
      return []
    }

    // Group by diagnosis dan hitung confidence
    const diagnosisMap = new Map<
      string,
      {
        diagnosis: Diagnosis | null
        totalConfidence: number
        ruleCount: number
        matchedRules: string[]
        matchedSymptoms: Set<string>
      }
    >()

    for (const { rule, matchedSymptoms } of matchedRules) {
      if (!diagnosisMap.has(rule.kode_diagnosis)) {
        diagnosisMap.set(rule.kode_diagnosis, {
          diagnosis: null,
          totalConfidence: 0,
          ruleCount: 0,
          matchedRules: [],
          matchedSymptoms: new Set(),
        })
      }

      const entry = diagnosisMap.get(rule.kode_diagnosis)!
      entry.totalConfidence += rule.confidence_level
      entry.ruleCount += 1
      entry.matchedRules.push(rule.kode_aturan)
      matchedSymptoms.forEach((s) => entry.matchedSymptoms.add(s))
    }

    // Ambil detail diagnosis dari database
    const diagnosisCodes = Array.from(diagnosisMap.keys())
    const diagnosisDetails = await query<Diagnosis[]>(
      `SELECT * FROM diagnosis WHERE kode_diagnosis IN (${diagnosisCodes.map(() => "?").join(",")})`,
      diagnosisCodes,
    )

    // Gabungkan hasil
    const results: DiagnosisResult[] = []

    for (const diagnosisDetail of diagnosisDetails) {
      const entry = diagnosisMap.get(diagnosisDetail.kode_diagnosis)!
      entry.diagnosis = diagnosisDetail

      // Hitung confidence rata-rata
      const avgConfidence = entry.totalConfidence / entry.ruleCount

      results.push({
        diagnosis: diagnosisDetail,
        confidence: Math.round(avgConfidence * 100) / 100,
        matched_rules: entry.matchedRules,
        matched_symptoms: Array.from(entry.matchedSymptoms),
      })
    }

    // Sort berdasarkan confidence tertinggi
    results.sort((a, b) => b.confidence - a.confidence)

    return results
  }

  /**
   * Ambil semua gejala dari database
   */
  async getAllSymptoms(): Promise<Gejala[]> {
    return await query<Gejala[]>("SELECT * FROM gejala ORDER BY kode_gejala")
  }

  /**
   * Ambil semua diagnosis dari database
   */
  async getAllDiagnosis(): Promise<Diagnosis[]> {
    return await query<Diagnosis[]>("SELECT * FROM diagnosis ORDER BY kode_diagnosis")
  }

  /**
   * Simpan riwayat diagnosis
   */
  async saveHistory(symptoms: string[], result: DiagnosisResult | null): Promise<void> {
    await query("INSERT INTO riwayat_diagnosis (gejala_input, hasil_diagnosis, confidence) VALUES (?, ?, ?)", [
      JSON.stringify(symptoms),
      result?.diagnosis.kode_diagnosis || null,
      result?.confidence || null,
    ])
  }
}
