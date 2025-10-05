import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Stethoscope, FileText, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-balance">Sistem Pakar Diagnosis Batuk</h1>
          </div>
          <Link href="/diagnosis">
            <Button>Mulai Diagnosis</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Stethoscope className="h-4 w-4" />
            <span>Sistem Pakar Forward Chaining</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Diagnosis Jenis Batuk Berdasarkan Gejala</h2>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
            Sistem pakar berbasis web yang menggunakan metode Forward Chaining untuk mendiagnosis jenis batuk
            berdasarkan gejala yang Anda alami. Dapatkan hasil diagnosis dan rekomendasi penanganan dengan cepat.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/diagnosis">
              <Button size="lg" className="w-full sm:w-auto">
                Mulai Diagnosis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/info">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Informasi Lengkap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Forward Chaining</CardTitle>
              <CardDescription>
                Menggunakan metode inferensi forward chaining untuk memproses gejala dan menghasilkan diagnosis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>7 Jenis Diagnosis</CardTitle>
              <CardDescription>
                Mencakup batuk pilek, flu, bronkitis, asma, alergi, pneumonia, dan tuberkulosis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Rekomendasi Penanganan</CardTitle>
              <CardDescription>
                Setiap diagnosis dilengkapi dengan informasi detail dan rekomendasi penanganan
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-sky-500 to-cyan-500 border-0 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-balance">Siap untuk Mendapatkan Diagnosis?</h3>
            <p className="text-sky-50 mb-6 text-pretty">
              Pilih gejala yang Anda alami dan sistem akan memberikan diagnosis serta rekomendasi penanganan
            </p>
            <Link href="/diagnosis">
              <Button size="lg" variant="secondary">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Sistem Pakar Diagnosis Batuk - Forward Chaining Method</p>
          <p className="mt-2">Untuk tujuan edukasi. Konsultasikan dengan dokter untuk diagnosis medis yang akurat.</p>
        </div>
      </footer>
    </div>
  )
}
