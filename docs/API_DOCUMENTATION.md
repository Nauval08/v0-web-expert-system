# API Documentation

Dokumentasi lengkap untuk semua endpoint API sistem pakar diagnosis batuk.

## Base URL

\`\`\`
Development: http://localhost:3000
Production: https://your-domain.vercel.app
\`\`\`

## Endpoints

### 1. Health Check

Memeriksa status koneksi database.

**Endpoint:** \`GET /api/health\`

**Response Success (200):**

\`\`\`json
{
  "success": true,
  "message": "Database connection is healthy",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
\`\`\`

**Response Error (500):**

\`\`\`json
{
  "success": false,
  "error": "Database connection failed",
  "message": "Connection timeout"
}
\`\`\`

---

### 2. Get All Symptoms

Mengambil semua data gejala dari database.

**Endpoint:** \`GET /api/symptoms\`

**Response Success (200):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode_gejala": "G001",
      "nama_gejala": "Batuk Kering",
      "deskripsi": "Batuk tanpa dahak atau lendir"
    },
    {
      "id": 2,
      "kode_gejala": "G002",
      "nama_gejala": "Batuk Berdahak",
      "deskripsi": "Batuk yang mengeluarkan dahak atau lendir"
    }
  ]
}
\`\`\`

**Response Error (500):**

\`\`\`json
{
  "success": false,
  "error": "Gagal mengambil data gejala",
  "message": "Database query failed"
}
\`\`\`

---

### 3. Process Diagnosis

Memproses diagnosis berdasarkan gejala yang dipilih menggunakan Forward Chaining.

**Endpoint:** \`POST /api/diagnosis\`

**Request Body:**

\`\`\`json
{
  "symptoms": ["G001", "G004", "G005"]
}
\`\`\`

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| symptoms | string[] | Yes | Array of symptom codes (kode_gejala) |

**Response Success - Diagnosis Found (200):**

\`\`\`json
{
  "success": true,
  "data": {
    "found": true,
    "results": [
      {
        "diagnosis": {
          "id": 1,
          "kode_diagnosis": "D001",
          "nama_diagnosis": "Batuk Pilek (Common Cold)",
          "deskripsi": "Infeksi virus pada saluran pernapasan atas...",
          "penanganan": "Istirahat cukup, minum air hangat..."
        },
        "confidence": 0.85,
        "matched_rules": ["R001"],
        "matched_symptoms": ["G001", "G004", "G005"]
      },
      {
        "diagnosis": {
          "id": 5,
          "kode_diagnosis": "D005",
          "nama_diagnosis": "Alergi Pernapasan",
          "deskripsi": "Reaksi alergi yang menyebabkan batuk...",
          "penanganan": "Hindari alergen..."
        },
        "confidence": 0.75,
        "matched_rules": ["R009"],
        "matched_symptoms": ["G001", "G004"]
      }
    ],
    "primary_diagnosis": {
      "diagnosis": {...},
      "confidence": 0.85,
      "matched_rules": ["R001"],
      "matched_symptoms": ["G001", "G004", "G005"]
    }
  }
}
\`\`\`

**Response Success - No Diagnosis Found (200):**

\`\`\`json
{
  "success": true,
  "data": {
    "found": false,
    "message": "Tidak ditemukan diagnosis yang cocok dengan gejala yang dipilih. Silakan konsultasi dengan dokter.",
    "results": []
  }
}
\`\`\`

**Response Error - Invalid Input (400):**

\`\`\`json
{
  "success": false,
  "error": "Gejala tidak valid. Pilih minimal 1 gejala."
}
\`\`\`

**Response Error - Server Error (500):**

\`\`\`json
{
  "success": false,
  "error": "Gagal memproses diagnosis",
  "message": "Database connection failed"
}
\`\`\`

---

### 4. Get All Diagnosis

Mengambil semua jenis diagnosis dari database.

**Endpoint:** \`GET /api/all-diagnosis\`

**Response Success (200):**

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kode_diagnosis": "D001",
      "nama_diagnosis": "Batuk Pilek (Common Cold)",
      "deskripsi": "Infeksi virus pada saluran pernapasan atas...",
      "penanganan": "Istirahat cukup, minum air hangat..."
    },
    {
      "id": 2,
      "kode_diagnosis": "D002",
      "nama_diagnosis": "Batuk Flu (Influenza)",
      "deskripsi": "Infeksi virus influenza...",
      "penanganan": "Istirahat total, minum banyak cairan..."
    }
  ]
}
\`\`\`

**Response Error (500):**

\`\`\`json
{
  "success": false,
  "error": "Gagal mengambil data diagnosis",
  "message": "Database query failed"
}
\`\`\`

---

## Forward Chaining Algorithm

### How It Works

1. **Input Processing**: Menerima array kode gejala dari user
2. **Rule Matching**: Mencari semua aturan yang cocok dengan gejala
3. **Confidence Calculation**: Menghitung confidence level untuk setiap diagnosis
4. **Result Ranking**: Mengurutkan hasil berdasarkan confidence tertinggi
5. **History Logging**: Menyimpan hasil diagnosis ke database

### Matching Logic

Aturan dianggap cocok jika **SEMUA** gejala yang diperlukan ada dalam input:

\`\`\`typescript
// Contoh aturan
{
  kode_aturan: "R001",
  gejala_required: ["G001", "G004", "G005"],
  confidence_level: 0.85
}

// Input user
symptoms: ["G001", "G004", "G005", "G012"]

// Result: MATCH ✓
// Karena semua gejala required (G001, G004, G005) ada dalam input
\`\`\`

### Confidence Calculation

Jika ada multiple aturan untuk satu diagnosis:

\`\`\`
Average Confidence = (Sum of all matched rules confidence) / (Number of matched rules)
\`\`\`

**Contoh:**

\`\`\`
Aturan R001: D001 → 0.85
Aturan R002: D001 → 0.80

Average = (0.85 + 0.80) / 2 = 0.825
\`\`\`

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 500 | Internal Server Error - Database or server error |

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding rate limiting for production:

\`\`\`typescript
// Recommended: 100 requests per 15 minutes per IP
\`\`\`

---

## CORS

API supports CORS for all origins in development. Configure for production:

\`\`\`typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://your-domain.com" }
        ]
      }
    ]
  }
}
\`\`\`

---

## Testing Examples

### cURL

\`\`\`bash
# Get symptoms
curl http://localhost:3000/api/symptoms

# Process diagnosis
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["G001", "G004", "G005"]}'

# Health check
curl http://localhost:3000/api/health
\`\`\`

### JavaScript (Fetch)

\`\`\`javascript
// Get symptoms
const symptoms = await fetch('/api/symptoms')
  .then(res => res.json())

// Process diagnosis
const diagnosis = await fetch('/api/diagnosis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ symptoms: ['G001', 'G004', 'G005'] })
}).then(res => res.json())
\`\`\`

### Python (Requests)

\`\`\`python
import requests

# Get symptoms
response = requests.get('http://localhost:3000/api/symptoms')
symptoms = response.json()

# Process diagnosis
response = requests.post(
    'http://localhost:3000/api/diagnosis',
    json={'symptoms': ['G001', 'G004', 'G005']}
)
diagnosis = response.json()
\`\`\`

---

## Changelog

### v1.0.0 (2025-01-15)
- Initial API release
- 4 endpoints: health, symptoms, diagnosis, all-diagnosis
- Forward chaining implementation
- History logging

---

**Note:** API ini untuk tujuan edukasi. Tidak untuk penggunaan medis profesional.
