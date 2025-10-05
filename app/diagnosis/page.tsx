"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { DiagnosisResults } from "@/components/diagnosis-results"

interface Symptom {
  id: number
  kode_gejala: string
  nama_gejala: string
  deskripsi: string
}

interface DiagnosisData {
  found: boolean
  message?: string
  results?: any[]
  primary_diagnosis?: any
}

export default function DiagnosisPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSymptoms, setLoadingSymptoms] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisData | null>(null)

  useEffect(() => {
    fetchSymptoms()
  }, [])

  async function fetchSymptoms() {
    try {
      setLoadingSymptoms(true)
      const response = await fetch("/api/symptoms")
      const data = await response.json()

      if (data.success) {
        setSymptoms(data.data)
      } else {
        setError(data.error || "Gagal memuat data gejala")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data gejala")
      console.error(err)
    } finally {
      setLoadingSymptoms(false)
    }
  }

  function toggleSymptom(kodeGejala: string) {
    setSelectedSymptoms((prev) =>
      prev.includes(kodeGejala) ? prev.filter((s) => s !== kodeGejala) : [...prev, kodeGejala],
    )
    setError(null)
  }

  async function handleDiagnosis() {
    if (selectedSymptoms.length === 0) {
      setError("Pilih minimal 1 gejala untuk melakukan diagnosis")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setDiagnosisResult(null)

      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDiagnosisResult(data.data)
      } else {
        setError(data.error || "Gagal memproses diagnosis")
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memproses diagnosis")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function resetDiagnosis() {
    setSelectedSymptoms([])
    setDiagnosisResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Diagnosis Batuk</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!diagnosisResult ? (
          <>
            {/* Symptom Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Pilih Gejala yang Anda Alami</CardTitle>
                <CardDescription>
                  Centang semua gejala yang sesuai dengan kondisi Anda saat ini. Semakin lengkap informasi yang
                  diberikan, semakin akurat hasil diagnosis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSymptoms ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {symptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={symptom.kode_gejala}
                          checked={selectedSymptoms.includes(symptom.kode_gejala)}
                          onCheckedChange={() => toggleSymptom(symptom.kode_gejala)}
                          className="mt-1"
                        />
                        <label htmlFor={symptom.kode_gejala} className="flex-1 cursor-pointer">
                          <div className="font-medium">{symptom.nama_gejala}</div>
                          <div className="text-sm text-muted-foreground">{symptom.deskripsi}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleDiagnosis} disabled={loading || selectedSymptoms.length === 0} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  `Proses Diagnosis (${selectedSymptoms.length} gejala)`
                )}
              </Button>
              <Button variant="outline" onClick={resetDiagnosis} disabled={loading}>
                Reset
              </Button>
            </div>
          </>
        ) : (
          <DiagnosisResults data={diagnosisResult} onReset={resetDiagnosis} selectedSymptoms={selectedSymptoms} />
        )}
      </div>
    </div>
  )
}
