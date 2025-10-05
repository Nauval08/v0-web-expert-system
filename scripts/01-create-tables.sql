-- Tabel untuk menyimpan data gejala
CREATE TABLE IF NOT EXISTS gejala (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_gejala VARCHAR(10) UNIQUE NOT NULL,
  nama_gejala VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan jenis diagnosis batuk
CREATE TABLE IF NOT EXISTS diagnosis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_diagnosis VARCHAR(10) UNIQUE NOT NULL,
  nama_diagnosis VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  penanganan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk menyimpan aturan forward chaining
-- Format: IF gejala1 AND gejala2 AND ... THEN diagnosis
CREATE TABLE IF NOT EXISTS aturan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_aturan VARCHAR(10) UNIQUE NOT NULL,
  kode_diagnosis VARCHAR(10) NOT NULL,
  gejala_required TEXT NOT NULL, -- JSON array of kode_gejala
  confidence_level DECIMAL(3,2) DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kode_diagnosis) REFERENCES diagnosis(kode_diagnosis) ON DELETE CASCADE
);

-- Tabel untuk log diagnosis (opsional, untuk tracking)
CREATE TABLE IF NOT EXISTS riwayat_diagnosis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gejala_input TEXT NOT NULL, -- JSON array of kode_gejala
  hasil_diagnosis VARCHAR(10),
  confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hasil_diagnosis) REFERENCES diagnosis(kode_diagnosis)
);
