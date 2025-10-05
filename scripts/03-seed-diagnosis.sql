-- Insert jenis-jenis batuk
INSERT INTO diagnosis (kode_diagnosis, nama_diagnosis, deskripsi, penanganan) VALUES
('D001', 'Batuk Pilek (Common Cold)', 
  'Infeksi virus pada saluran pernapasan atas yang menyebabkan batuk, pilek, dan sakit tenggorokan.',
  'Istirahat cukup, minum air hangat, konsumsi vitamin C, dan obat pereda gejala. Biasanya sembuh dalam 7-10 hari.'),

('D002', 'Batuk Flu (Influenza)', 
  'Infeksi virus influenza yang menyebabkan batuk, demam tinggi, dan kelelahan.',
  'Istirahat total, minum banyak cairan, obat antivirus (jika diresepkan), dan obat penurun demam. Konsultasi dokter jika gejala berat.'),

('D003', 'Bronkitis Akut', 
  'Peradangan pada bronkus yang menyebabkan batuk berdahak, sesak napas, dan nyeri dada.',
  'Istirahat, minum air hangat, hindari asap rokok, obat pereda batuk. Antibiotik jika disebabkan bakteri (konsultasi dokter).'),

('D004', 'Asma', 
  'Penyakit kronis yang menyebabkan penyempitan saluran napas dengan gejala batuk, mengi, dan sesak napas.',
  'Gunakan inhaler sesuai resep dokter, hindari pemicu (debu, asap, udara dingin), konsultasi rutin dengan dokter.'),

('D005', 'Alergi Pernapasan', 
  'Reaksi alergi yang menyebabkan batuk, bersin, pilek, dan mata berair.',
  'Hindari alergen (debu, serbuk sari, bulu hewan), gunakan antihistamin, jaga kebersihan lingkungan.'),

('D006', 'Pneumonia', 
  'Infeksi paru-paru yang serius dengan gejala batuk berdahak, demam tinggi, sesak napas, dan nyeri dada.',
  'SEGERA KONSULTASI DOKTER. Memerlukan antibiotik dan perawatan medis. Dapat memerlukan rawat inap.'),

('D007', 'Tuberkulosis (TBC)', 
  'Infeksi bakteri pada paru-paru dengan batuk lama (>3 minggu), batuk darah, dan penurunan berat badan.',
  'SEGERA KONSULTASI DOKTER. Memerlukan pengobatan jangka panjang (6-9 bulan) dengan obat anti-TBC.');
