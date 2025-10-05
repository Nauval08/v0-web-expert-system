import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowLeft, BookOpen, Database, Cpu } from "lucide-react"

export default function InfoPage() {
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
              <h1 className="text-xl font-semibold">Informasi Sistem</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* About System */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Tentang Sistem</CardTitle>
            </div>
            <CardDescription>Sistem Pakar Diagnosis Batuk dengan Forward Chaining</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              Sistem pakar ini dirancang untuk membantu mendiagnosis jenis batuk berdasarkan gejala yang dialami
              pengguna. Menggunakan metode Forward Chaining, sistem akan memproses gejala input dan mencocokkannya
              dengan basis pengetahuan untuk menghasilkan diagnosis yang paling sesuai.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold mb-2">Fitur Utama:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>15 jenis gejala batuk yang dapat dipilih</li>
                <li>7 jenis diagnosis batuk (Pilek, Flu, Bronkitis, Asma, Alergi, Pneumonia, TBC)</li>
                <li>14 aturan forward chaining dengan confidence level</li>
                <li>Rekomendasi penanganan untuk setiap diagnosis</li>
                <li>Riwayat diagnosis tersimpan di database</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Forward Chaining Method */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="h-5 w-5 text-primary" />
              <CardTitle>Metode Forward Chaining</CardTitle>
            </div>
            <CardDescription>Cara kerja sistem inferensi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              Forward Chaining adalah metode inferensi yang bekerja dari fakta (gejala) menuju kesimpulan (diagnosis).
              Sistem akan:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Menerima input gejala dari pengguna</li>
              <li>Mencari aturan yang cocok dengan gejala tersebut</li>
              <li>Mengevaluasi semua aturan yang memenuhi syarat</li>
              <li>Menghitung confidence level untuk setiap diagnosis</li>
              <li>Mengurutkan hasil berdasarkan confidence tertinggi</li>
              <li>Menampilkan diagnosis utama dan kemungkinan diagnosis lainnya</li>
            </ol>
            <div className="bg-accent/50 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium">Contoh Aturan:</p>
              <p className="text-sm mt-2">
                <code className="bg-background px-2 py-1 rounded">
                  IF (Batuk Kering AND Pilek AND Sakit Tenggorokan) THEN Batuk Pilek (85% confidence)
                </code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Database Structure */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Struktur Database</CardTitle>
            </div>
            <CardDescription>Tabel dan relasi data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tabel Gejala</h4>
                <p className="text-sm text-muted-foreground">
                  Menyimpan data gejala batuk dengan kode, nama, dan deskripsi
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tabel Diagnosis</h4>
                <p className="text-sm text-muted-foreground">
                  Menyimpan jenis diagnosis dengan deskripsi dan rekomendasi penanganan
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tabel Aturan</h4>
                <p className="text-sm text-muted-foreground">
                  Menyimpan aturan forward chaining yang menghubungkan gejala dengan diagnosis
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tabel Riwayat Diagnosis</h4>
                <p className="text-sm text-muted-foreground">Menyimpan log diagnosis untuk tracking dan analisis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-warning">
          <CardHeader>
            <CardTitle className="text-warning">Disclaimer Medis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              Sistem pakar ini dibuat untuk tujuan edukasi dan informatif. Hasil diagnosis yang diberikan tidak dapat
              menggantikan konsultasi medis profesional. Untuk diagnosis yang akurat dan penanganan yang tepat, selalu
              konsultasikan kondisi kesehatan Anda dengan dokter atau tenaga medis profesional.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex justify-center pt-4">
          <Link href="/diagnosis">
            <Button size="lg">Mulai Diagnosis Sekarang</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
