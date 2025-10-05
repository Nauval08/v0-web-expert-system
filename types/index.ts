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

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
