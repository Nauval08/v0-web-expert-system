# Sistem Pakar Diagnosis Batuk

Sistem pakar berbasis web untuk mendiagnosis jenis batuk berdasarkan gejala menggunakan metode Forward Chaining.

## Fitur

- **Frontend**: React.js dengan Next.js 15
- **Backend**: Node.js + Express (Next.js API Routes)
- **Database**: MySQL
- **Metode**: Forward Chaining
- **15 Gejala Batuk**
- **7 Jenis Diagnosis**
- **14 Aturan Forward Chaining**

## Teknologi

- Next.js 15
- TypeScript
- Tailwind CSS v4
- MySQL 2
- shadcn/ui components

## Setup Database

### 1. Buat Database MySQL

\`\`\`sql
CREATE DATABASE cough_diagnosis;
\`\`\`

### 2. Konfigurasi Environment Variables

Buat file `.env.local` di root project:

\`\`\`env
DB_HOST=your-mysql-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=cough_diagnosis
\`\`\`

### 3. Jalankan SQL Scripts

Jalankan script SQL secara berurutan dari folder `scripts/`:

\`\`\`bash
# Di v0.app, script akan otomatis dijalankan
# Untuk local development, jalankan manual:
mysql -u username -p cough_diagnosis < scripts/01-create-tables.sql
mysql -u username -p cough_diagnosis < scripts/02-seed-gejala.sql
mysql -u username -p cough_diagnosis < scripts/03-seed-diagnosis.sql
mysql -u username -p cough_diagnosis < scripts/04-seed-aturan.sql
\`\`\`

## Instalasi

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## API Endpoints

### GET /api/symptoms
Mengambil semua data gejala

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode_gejala": "G001",
      "nama_gejala": "Batuk Kering",
      "deskripsi": "Batuk tanpa dahak atau lendir"
    }
  ]
}
\`\`\`

### POST /api/diagnosis
Memproses diagnosis berdasarkan gejala

**Request:**
\`\`\`json
{
  "symptoms": ["G001", "G004", "G005"]
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "found": true,
    "results": [
      {
        "diagnosis": {
          "kode_diagnosis": "D001",
          "nama_diagnosis": "Batuk Pilek",
          "deskripsi": "...",
          "penanganan": "..."
        },
        "confidence": 0.85,
        "matched_rules": ["R001"],
        "matched_symptoms": ["G001", "G004", "G005"]
      }
    ],
    "primary_diagnosis": {...}
  }
}
\`\`\`

### GET /api/all-diagnosis
Mengambil semua jenis diagnosis

### GET /api/health
Health check untuk koneksi database

## Struktur Database

### Tabel: gejala
- `id` (INT, PRIMARY KEY)
- `kode_gejala` (VARCHAR, UNIQUE)
- `nama_gejala` (VARCHAR)
- `deskripsi` (TEXT)
- `created_at` (TIMESTAMP)

### Tabel: diagnosis
- `id` (INT, PRIMARY KEY)
- `kode_diagnosis` (VARCHAR, UNIQUE)
- `nama_diagnosis` (VARCHAR)
- `deskripsi` (TEXT)
- `penanganan` (TEXT)
- `created_at` (TIMESTAMP)

### Tabel: aturan
- `id` (INT, PRIMARY KEY)
- `kode_aturan` (VARCHAR, UNIQUE)
- `kode_diagnosis` (VARCHAR, FOREIGN KEY)
- `gejala_required` (TEXT, JSON array)
- `confidence_level` (DECIMAL)
- `created_at` (TIMESTAMP)

### Tabel: riwayat_diagnosis
- `id` (INT, PRIMARY KEY)
- `gejala_input` (TEXT, JSON array)
- `hasil_diagnosis` (VARCHAR, FOREIGN KEY)
- `confidence` (DECIMAL)
- `created_at` (TIMESTAMP)

## Cara Menambah Aturan Baru

### 1. Tambah Gejala Baru (Opsional)

\`\`\`sql
INSERT INTO gejala (kode_gejala, nama_gejala, deskripsi) 
VALUES ('G016', 'Nama Gejala', 'Deskripsi gejala');
\`\`\`

### 2. Tambah Diagnosis Baru (Opsional)

\`\`\`sql
INSERT INTO diagnosis (kode_diagnosis, nama_diagnosis, deskripsi, penanganan) 
VALUES ('D008', 'Nama Diagnosis', 'Deskripsi diagnosis', 'Rekomendasi penanganan');
\`\`\`

### 3. Tambah Aturan Forward Chaining

\`\`\`sql
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R015', 
  'D001', 
  '["G001", "G004", "G012"]', 
  0.80
);
\`\`\`

**Format gejala_required:**
- Harus berupa JSON array
- Berisi kode_gejala yang diperlukan
- Semua gejala dalam array harus ada untuk aturan cocok

**Confidence Level:**
- Nilai antara 0.00 - 1.00
- 0.90 - 1.00: Sangat yakin
- 0.80 - 0.89: Yakin
- 0.70 - 0.79: Cukup yakin
- < 0.70: Kurang yakin

### 4. Contoh Aturan Kompleks

\`\`\`sql
-- Aturan untuk diagnosis baru dengan 4 gejala
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R016', 
  'D002', 
  '["G001", "G003", "G005", "G014"]', 
  0.95
);
\`\`\`

## Forward Chaining Logic

Sistem menggunakan algoritma Forward Chaining:

1. **Input**: User memilih gejala yang dialami
2. **Matching**: Sistem mencari aturan yang cocok dengan gejala
3. **Evaluation**: Menghitung confidence level untuk setiap diagnosis
4. **Ranking**: Mengurutkan hasil berdasarkan confidence tertinggi
5. **Output**: Menampilkan diagnosis utama dan alternatif

### Contoh Proses:

\`\`\`
Input: ["G001", "G004", "G005"]
↓
Cari aturan yang cocok:
- R001: IF ["G001", "G004", "G005"] THEN D001 (0.85)
↓
Hasil: Batuk Pilek (85% confidence)
\`\`\`

## Deploy ke v0.app

1. Push code ke GitHub
2. Connect repository di v0.app
3. Set environment variables di Project Settings
4. Deploy otomatis

## Catatan Penting

- Sistem ini untuk tujuan edukasi
- Tidak menggantikan konsultasi medis profesional
- Selalu konsultasi dengan dokter untuk diagnosis akurat

## License

MIT
