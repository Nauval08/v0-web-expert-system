"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Info, RotateCcw } from "lucide-react"

interface DiagnosisResultsProps {
  data: {
    found: boolean
    message?: string
    results?: Array<{
      diagnosis: {
        kode_diagnosis: string
        nama_diagnosis: string
        deskripsi: string
        penanganan: string
      }
      confidence: number
      matched_rules: string[]
      matched_symptoms: string[]
    }>
    primary_diagnosis?: any
  }
  onReset: () => void
  selectedSymptoms: string[]
}

export function DiagnosisResults({ data, onReset, selectedSymptoms }: DiagnosisResultsProps) {
  if (!data.found) {
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Tidak Ditemukan Diagnosis</AlertTitle>
          <AlertDescription>{data.message}</AlertDescription>
        </Alert>

        <Button onClick={onReset} variant="outline" className="w-full bg-transparent">
          <RotateCcw className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    )
  }

  const primaryDiagnosis = data.primary_diagnosis || data.results?.[0]
  const otherDiagnoses = data.results?.slice(1) || []

  // Determine severity based on diagnosis code
  const getSeverityColor = (code: string) => {
    if (code === "D006" || code === "D007") return "destructive" // Pneumonia, TBC
    if (code === "D003" || code === "D004") return "warning" // Bronkitis, Asma
    return "default"
  }

  const getSeverityIcon = (code: string) => {
    if (code === "D006" || code === "D007") return <AlertTriangle className="h-5 w-5" />
    return <CheckCircle2 className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getSeverityIcon(primaryDiagnosis.diagnosis.kode_diagnosis)}
                <CardTitle className="text-2xl">Hasil Diagnosis Utama</CardTitle>
              </div>
              <CardDescription>Berdasarkan {selectedSymptoms.length} gejala yang Anda pilih</CardDescription>
            </div>
            <Badge variant={getSeverityColor(primaryDiagnosis.diagnosis.kode_diagnosis)} className="text-sm px-3 py-1">
              {Math.round(primaryDiagnosis.confidence * 100)}% Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{primaryDiagnosis.diagnosis.nama_diagnosis}</h3>
            <p className="text-muted-foreground leading-relaxed">{primaryDiagnosis.diagnosis.deskripsi}</p>
          </div>

          <div className="bg-accent/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Rekomendasi Penanganan
            </h4>
            <p className="text-sm leading-relaxed">{primaryDiagnosis.diagnosis.penanganan}</p>
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Aturan yang cocok: {primaryDiagnosis.matched_rules.join(", ")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Other Possible Diagnoses */}
      {otherDiagnoses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Kemungkinan Diagnosis Lainnya</h3>
          {otherDiagnoses.map((result: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg">{result.diagnosis.nama_diagnosis}</CardTitle>
                  <Badge variant="secondary">{Math.round(result.confidence * 100)}%</Badge>
                </div>
                <CardDescription>{result.diagnosis.deskripsi}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">{result.diagnosis.penanganan}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Warning for serious conditions */}
      {(primaryDiagnosis.diagnosis.kode_diagnosis === "D006" ||
        primaryDiagnosis.diagnosis.kode_diagnosis === "D007") && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Perhatian Penting</AlertTitle>
          <AlertDescription>
            Kondisi ini memerlukan penanganan medis segera. Harap segera konsultasi dengan dokter atau kunjungi
            fasilitas kesehatan terdekat.
          </AlertDescription>
        </Alert>
      )}

      {/* Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          Hasil diagnosis ini bersifat informatif dan tidak menggantikan konsultasi medis profesional. Untuk diagnosis
          yang akurat dan penanganan yang tepat, silakan berkonsultasi dengan dokter.
        </AlertDescription>
      </Alert>

      {/* Reset Button */}
      <Button onClick={onReset} variant="outline" className="w-full bg-transparent">
        <RotateCcw className="mr-2 h-4 w-4" />
        Diagnosis Baru
      </Button>
    </div>
  )
}
