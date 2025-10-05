# Deployment Guide

Panduan lengkap untuk deploy sistem pakar diagnosis batuk ke berbagai platform.

## Deploy ke Vercel (Recommended)

### Prerequisites

- Akun Vercel
- Repository GitHub
- Database MySQL eksternal (PlanetScale, Railway, atau lainnya)

### Langkah-langkah

#### 1. Setup Database Eksternal

**Option A: PlanetScale (Recommended)**

1. Buat akun di [planetscale.com](https://planetscale.com)
2. Buat database baru
3. Jalankan SQL scripts:
   \`\`\`bash
   pscale shell <database-name> <branch-name> < scripts/01-create-tables.sql
   pscale shell <database-name> <branch-name> < scripts/02-seed-gejala.sql
   pscale shell <database-name> <branch-name> < scripts/03-seed-diagnosis.sql
   pscale shell <database-name> <branch-name> < scripts/04-seed-aturan.sql
   \`\`\`
4. Dapatkan connection string

**Option B: Railway**

1. Buat akun di [railway.app](https://railway.app)
2. Deploy MySQL database
3. Connect dan jalankan SQL scripts
4. Copy connection details

#### 2. Push ke GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
\`\`\`

#### 3. Deploy ke Vercel

1. Login ke [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import repository dari GitHub
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: \`npm run build\`
   - Output Directory: .next

#### 4. Set Environment Variables

Di Vercel Dashboard → Settings → Environment Variables:

\`\`\`
DB_HOST=your-mysql-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=cough_diagnosis
\`\`\`

#### 5. Deploy

Click "Deploy" dan tunggu proses selesai.

---

## Deploy ke v0.app

### Langkah-langkah

1. **Setup Database**
   - Gunakan MySQL eksternal (PlanetScale/Railway)
   - Jalankan SQL scripts untuk setup schema dan data

2. **Set Environment Variables**
   - Buka Project Settings (gear icon)
   - Tambahkan environment variables:
     \`\`\`
     DB_HOST=your-host
     DB_USER=your-user
     DB_PASSWORD=your-password
     DB_NAME=cough_diagnosis
     \`\`\`

3. **Deploy**
   - Click "Publish" button
   - Sistem akan otomatis deploy

---

## Deploy ke VPS (Ubuntu)

### Prerequisites

- VPS dengan Ubuntu 20.04+
- Node.js 18+
- MySQL 8.0+
- Nginx
- Domain (opsional)

### Langkah-langkah

#### 1. Setup Server

\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
\`\`\`

#### 2. Setup Database

\`\`\`bash
# Login ke MySQL
sudo mysql -u root -p

# Buat database dan user
CREATE DATABASE cough_diagnosis;
CREATE USER 'cough_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON cough_diagnosis.* TO 'cough_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import SQL scripts
mysql -u cough_user -p cough_diagnosis < scripts/01-create-tables.sql
mysql -u cough_user -p cough_diagnosis < scripts/02-seed-gejala.sql
mysql -u cough_user -p cough_diagnosis < scripts/03-seed-diagnosis.sql
mysql -u cough_user -p cough_diagnosis < scripts/04-seed-aturan.sql
\`\`\`

#### 3. Deploy Application

\`\`\`bash
# Clone repository
cd /var/www
sudo git clone https://github.com/username/repo.git cough-diagnosis
cd cough-diagnosis

# Install dependencies
sudo npm install

# Create .env.local
sudo nano .env.local
# Add:
# DB_HOST=localhost
# DB_USER=cough_user
# DB_PASSWORD=strong_password
# DB_NAME=cough_diagnosis

# Build application
sudo npm run build

# Start with PM2
sudo pm2 start npm --name "cough-diagnosis" -- start
sudo pm2 save
sudo pm2 startup
\`\`\`

#### 4. Configure Nginx

\`\`\`bash
sudo nano /etc/nginx/sites-available/cough-diagnosis
\`\`\`

Add configuration:

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

Enable site:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/cough-diagnosis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

#### 5. Setup SSL (Optional)

\`\`\`bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
\`\`\`

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | MySQL host | localhost or mysql.example.com |
| DB_USER | MySQL username | cough_user |
| DB_PASSWORD | MySQL password | strong_password_123 |
| DB_NAME | Database name | cough_diagnosis |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Application port | 3000 |
| NODE_ENV | Environment | production |

---

## Database Providers

### PlanetScale

**Pros:**
- Serverless MySQL
- Free tier available
- Auto-scaling
- Built-in branching

**Setup:**
\`\`\`bash
# Install CLI
brew install planetscale/tap/pscale

# Login
pscale auth login

# Create database
pscale database create cough-diagnosis

# Connect
pscale connect cough-diagnosis main --port 3309
\`\`\`

### Railway

**Pros:**
- Easy setup
- Free tier
- Automatic backups

**Setup:**
1. Create account at railway.app
2. New Project → MySQL
3. Copy connection details
4. Use in environment variables

### AWS RDS

**Pros:**
- Enterprise-grade
- High availability
- Automated backups

**Setup:**
1. Create RDS MySQL instance
2. Configure security groups
3. Get endpoint URL
4. Use in environment variables

---

## Monitoring

### PM2 Monitoring (VPS)

\`\`\`bash
# View logs
pm2 logs cough-diagnosis

# Monitor resources
pm2 monit

# Restart application
pm2 restart cough-diagnosis
\`\`\`

### Vercel Analytics

Enable in Vercel Dashboard:
- Analytics → Enable
- View real-time metrics

---

## Troubleshooting

### Database Connection Failed

**Problem:** Cannot connect to database

**Solutions:**
1. Check environment variables
2. Verify database credentials
3. Check firewall rules
4. Test connection:
   \`\`\`bash
   mysql -h DB_HOST -u DB_USER -p
   \`\`\`

### Build Failed

**Problem:** Build fails on deployment

**Solutions:**
1. Check Node.js version (18+)
2. Clear cache: \`npm cache clean --force\`
3. Delete node_modules and reinstall
4. Check for TypeScript errors

### 502 Bad Gateway (Nginx)

**Problem:** Nginx shows 502 error

**Solutions:**
1. Check if app is running: \`pm2 status\`
2. Check port configuration
3. Restart services:
   \`\`\`bash
   pm2 restart cough-diagnosis
   sudo systemctl restart nginx
   \`\`\`

---

## Performance Optimization

### Database

\`\`\`sql
-- Add indexes for better performance
CREATE INDEX idx_gejala_kode ON gejala(kode_gejala);
CREATE INDEX idx_diagnosis_kode ON diagnosis(kode_diagnosis);
CREATE INDEX idx_aturan_diagnosis ON aturan(kode_diagnosis);
\`\`\`

### Next.js

\`\`\`javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}
\`\`\`

### Caching

Consider adding Redis for caching:
\`\`\`typescript
// Cache symptoms and diagnosis data
// Reduce database queries
\`\`\`

---

## Backup Strategy

### Database Backup

\`\`\`bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mysqldump -u cough_user -p cough_diagnosis > backup_$DATE.sql
\`\`\`

### Automated Backups

\`\`\`bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
\`\`\`

---

## Security Checklist

- [ ] Use strong database passwords
- [ ] Enable SSL/HTTPS
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Environment variables not in code
- [ ] SQL injection prevention (using parameterized queries)
- [ ] Rate limiting on API endpoints
- [ ] Regular backups

---

## Support

For deployment issues:
- Check logs first
- Review environment variables
- Test database connection
- Consult platform documentation

---

**Last Updated:** January 2025
