# Panduan Menambah Aturan Baru

Dokumen ini menjelaskan cara menambahkan aturan forward chaining baru ke dalam sistem pakar diagnosis batuk.

## Struktur Aturan

Setiap aturan forward chaining memiliki format:

\`\`\`
IF (Gejala1 AND Gejala2 AND ... AND GejalaN) THEN Diagnosis (Confidence Level)
\`\`\`

## Langkah-langkah

### 1. Identifikasi Kebutuhan

Tentukan:
- Gejala apa yang menjadi indikator diagnosis?
- Diagnosis apa yang akan dihasilkan?
- Seberapa yakin aturan ini? (confidence level)

### 2. Cek Data yang Ada

#### Cek Gejala yang Tersedia

\`\`\`sql
SELECT * FROM gejala ORDER BY kode_gejala;
\`\`\`

Jika gejala belum ada, tambahkan terlebih dahulu (lihat langkah 3).

#### Cek Diagnosis yang Tersedia

\`\`\`sql
SELECT * FROM diagnosis ORDER BY kode_diagnosis;
\`\`\`

Jika diagnosis belum ada, tambahkan terlebih dahulu (lihat langkah 4).

### 3. Tambah Gejala Baru (Jika Diperlukan)

\`\`\`sql
INSERT INTO gejala (kode_gejala, nama_gejala, deskripsi) 
VALUES (
  'G016',  -- Kode gejala baru (increment dari yang terakhir)
  'Nama Gejala',
  'Deskripsi lengkap gejala'
);
\`\`\`

**Contoh:**

\`\`\`sql
INSERT INTO gejala (kode_gejala, nama_gejala, deskripsi) 
VALUES (
  'G016', 
  'Suara Serak', 
  'Perubahan suara menjadi parau atau serak'
);
\`\`\`

### 4. Tambah Diagnosis Baru (Jika Diperlukan)

\`\`\`sql
INSERT INTO diagnosis (kode_diagnosis, nama_diagnosis, deskripsi, penanganan) 
VALUES (
  'D008',  -- Kode diagnosis baru
  'Nama Diagnosis',
  'Deskripsi lengkap diagnosis',
  'Rekomendasi penanganan dan pengobatan'
);
\`\`\`

**Contoh:**

\`\`\`sql
INSERT INTO diagnosis (kode_diagnosis, nama_diagnosis, deskripsi, penanganan) 
VALUES (
  'D008', 
  'Laringitis', 
  'Peradangan pada laring (pita suara) yang menyebabkan suara serak dan batuk kering.',
  'Istirahat suara, minum air hangat, hindari berbisik, gunakan humidifier. Konsultasi dokter jika berlangsung lebih dari 2 minggu.'
);
\`\`\`

### 5. Tambah Aturan Forward Chaining

\`\`\`sql
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R015',  -- Kode aturan baru (increment dari yang terakhir)
  'D001',  -- Kode diagnosis yang akan dihasilkan
  '["G001", "G004", "G005"]',  -- Array JSON berisi kode gejala
  0.85  -- Confidence level (0.00 - 1.00)
);
\`\`\`

**Contoh Aturan Sederhana:**

\`\`\`sql
-- Aturan: Batuk kering + Suara serak + Sakit tenggorokan = Laringitis
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R015', 
  'D008', 
  '["G001", "G016", "G005"]', 
  0.90
);
\`\`\`

**Contoh Aturan Kompleks:**

\`\`\`sql
-- Aturan: Batuk berdahak + Demam + Sesak napas + Nyeri dada + Dahak kuning/hijau = Pneumonia
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R016', 
  'D006', 
  '["G002", "G003", "G006", "G007", "G008"]', 
  0.95
);
\`\`\`

## Panduan Confidence Level

Tentukan confidence level berdasarkan seberapa spesifik dan akurat aturan tersebut:

| Range | Kategori | Keterangan | Contoh |
|-------|----------|------------|--------|
| 0.95 - 1.00 | Sangat Yakin | Gejala sangat spesifik dan khas | Batuk darah + Batuk >3 minggu = TBC |
| 0.85 - 0.94 | Yakin | Kombinasi gejala yang kuat | Batuk kering + Mengi + Sesak napas = Asma |
| 0.75 - 0.84 | Cukup Yakin | Gejala umum tapi cukup spesifik | Batuk + Pilek + Sakit tenggorokan = Pilek |
| 0.60 - 0.74 | Kurang Yakin | Gejala terlalu umum | Batuk kering + Kelelahan = ? |

## Tips Membuat Aturan yang Baik

### 1. Spesifik dan Relevan
- Pilih gejala yang benar-benar khas untuk diagnosis
- Hindari gejala yang terlalu umum

**Buruk:**
\`\`\`sql
-- Terlalu umum
'["G001"]'  -- Hanya batuk kering
\`\`\`

**Baik:**
\`\`\`sql
-- Lebih spesifik
'["G001", "G011", "G010"]'  -- Batuk kering + Mengi + Batuk malam hari
\`\`\`

### 2. Jumlah Gejala yang Tepat
- Minimal 2-3 gejala untuk diagnosis yang akurat
- Maksimal 5-6 gejala agar tidak terlalu ketat

### 3. Hindari Duplikasi
- Cek aturan yang sudah ada sebelum menambah
- Jika mirip, pertimbangkan untuk memodifikasi aturan yang ada

\`\`\`sql
-- Cek aturan untuk diagnosis tertentu
SELECT * FROM aturan WHERE kode_diagnosis = 'D001';
\`\`\`

### 4. Buat Variasi Aturan
- Satu diagnosis bisa memiliki beberapa aturan
- Ini memungkinkan diagnosis dari kombinasi gejala yang berbeda

**Contoh:**

\`\`\`sql
-- Aturan 1: Batuk Pilek dengan gejala A, B, C
INSERT INTO aturan VALUES ('R001', 'D001', '["G001", "G004", "G005"]', 0.85);

-- Aturan 2: Batuk Pilek dengan gejala B, C, D (variasi lain)
INSERT INTO aturan VALUES ('R002', 'D001', '["G002", "G004", "G012"]', 0.80);
\`\`\`

## Contoh Kasus Lengkap

### Skenario: Menambah Diagnosis "Batuk Rejan (Pertusis)"

#### 1. Tambah Gejala Baru

\`\`\`sql
INSERT INTO gejala (kode_gejala, nama_gejala, deskripsi) VALUES
('G016', 'Batuk Paroksismal', 'Batuk yang terjadi dalam serangan beruntun'),
('G017', 'Suara Whoop', 'Suara tarikan napas yang khas setelah batuk'),
('G018', 'Muntah Setelah Batuk', 'Muntah yang dipicu oleh batuk hebat');
\`\`\`

#### 2. Tambah Diagnosis

\`\`\`sql
INSERT INTO diagnosis (kode_diagnosis, nama_diagnosis, deskripsi, penanganan) 
VALUES (
  'D008', 
  'Batuk Rejan (Pertusis)', 
  'Infeksi bakteri pada saluran pernapasan yang menyebabkan batuk hebat dan berkepanjangan dengan suara khas.',
  'SEGERA KONSULTASI DOKTER. Memerlukan antibiotik dan isolasi. Vaksinasi DPT dapat mencegah penyakit ini.'
);
\`\`\`

#### 3. Tambah Aturan

\`\`\`sql
-- Aturan 1: Gejala klasik pertusis
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R015', 
  'D008', 
  '["G016", "G017"]', 
  0.95
);

-- Aturan 2: Pertusis dengan komplikasi
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R016', 
  'D008', 
  '["G016", "G017", "G018"]', 
  0.98
);

-- Aturan 3: Pertusis tanpa suara whoop (pada dewasa)
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) 
VALUES (
  'R017', 
  'D008', 
  '["G016", "G009"]', 
  0.80
);
\`\`\`

## Verifikasi Aturan

Setelah menambah aturan, lakukan verifikasi:

### 1. Cek Data Tersimpan

\`\`\`sql
-- Cek aturan baru
SELECT a.*, d.nama_diagnosis 
FROM aturan a
JOIN diagnosis d ON a.kode_diagnosis = d.kode_diagnosis
WHERE a.kode_aturan = 'R015';
\`\`\`

### 2. Test Melalui API

\`\`\`bash
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["G016", "G017"]}'
\`\`\`

### 3. Test Melalui UI

1. Buka halaman diagnosis
2. Pilih gejala sesuai aturan baru
3. Klik "Proses Diagnosis"
4. Verifikasi hasil sesuai ekspektasi

## Troubleshooting

### Aturan Tidak Cocok

**Problem:** Aturan tidak menghasilkan diagnosis meskipun gejala sudah dipilih.

**Solusi:**
1. Cek format JSON gejala_required
2. Pastikan semua kode_gejala valid
3. Pastikan kode_diagnosis valid

\`\`\`sql
-- Cek format JSON
SELECT kode_aturan, gejala_required, 
       JSON_VALID(gejala_required) as is_valid_json
FROM aturan;
\`\`\`

### Confidence Level Tidak Sesuai

**Problem:** Hasil diagnosis memiliki confidence yang tidak diharapkan.

**Solusi:**
- Jika ada multiple aturan untuk satu diagnosis, confidence akan di-rata-rata
- Sesuaikan confidence_level di setiap aturan

### Foreign Key Error

**Problem:** Error saat insert aturan: "Cannot add or update a child row"

**Solusi:**
- Pastikan kode_diagnosis sudah ada di tabel diagnosis
- Cek typo pada kode_diagnosis

\`\`\`sql
-- Cek diagnosis yang ada
SELECT kode_diagnosis FROM diagnosis;
\`\`\`

## Best Practices

1. **Dokumentasi**: Catat alasan medis di balik setiap aturan
2. **Konsistensi**: Gunakan pola penamaan yang konsisten (R001, R002, ...)
3. **Testing**: Selalu test aturan baru sebelum production
4. **Review**: Minta review dari ahli medis jika memungkinkan
5. **Versioning**: Buat script SQL baru untuk setiap perubahan (05-new-rules.sql, 06-update-rules.sql)

## Referensi

- [Forward Chaining Algorithm](https://en.wikipedia.org/wiki/Forward_chaining)
- [Expert Systems in Medical Diagnosis](https://www.ncbi.nlm.nih.gov/pmc/articles/)
- Konsultasi dengan tenaga medis profesional untuk validasi aturan

---

**Catatan:** Sistem ini untuk tujuan edukasi. Aturan medis harus divalidasi oleh profesional kesehatan sebelum digunakan dalam konteks klinis.
