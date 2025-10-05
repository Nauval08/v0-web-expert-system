-- Insert aturan forward chaining
-- Format gejala_required: JSON array berisi kode_gejala yang harus ada

-- Aturan untuk Batuk Pilek
INSERT INTO aturan (kode_aturan, kode_diagnosis, gejala_required, confidence_level) VALUES
('R001', 'D001', '["G001", "G004", "G005"]', 0.85),
('R002', 'D001', '["G002", "G004", "G012"]', 0.80),

-- Aturan untuk Flu
('R003', 'D002', '["G001", "G003", "G014"]', 0.85),
('R004', 'D002', '["G002", "G003", "G005", "G014"]', 0.90),

-- Aturan untuk Bronkitis
('R005', 'D003', '["G002", "G007", "G008"]', 0.85),
('R006', 'D003', '["G002", "G006", "G008"]', 0.90),

-- Aturan untuk Asma
('R007', 'D004', '["G001", "G006", "G011"]', 0.90),
('R008', 'D004', '["G010", "G011", "G006"]', 0.85),

-- Aturan untuk Alergi
('R009', 'D005', '["G001", "G012", "G013"]', 0.85),
('R010', 'D005', '["G004", "G012", "G013", "G010"]', 0.90),

-- Aturan untuk Pneumonia (gejala serius)
('R011', 'D006', '["G002", "G003", "G006", "G007", "G008"]', 0.95),
('R012', 'D006', '["G002", "G003", "G006", "G014"]', 0.85),

-- Aturan untuk TBC
('R013', 'D007', '["G009", "G015"]', 0.95),
('R014', 'D007', '["G009", "G002", "G014"]', 0.80);
