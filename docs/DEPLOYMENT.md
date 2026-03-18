# دليل النشر الكامل

## الخيار 1: Railway (Backend) + Vercel (Frontend) — موصى به

### المتطلبات
- حساب GitHub: https://github.com
- حساب Railway: https://railway.app
- حساب Vercel: https://vercel.com

---

## الخطوة 1: رفع الكود على GitHub

افتح Terminal في مجلد المشروع ونفذ:

```bash
# إضافة git للـ PATH (Windows)
$env:PATH = "C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;" + $env:PATH

# تسجيل الدخول في GitHub (سيفتح المتصفح)
gh auth login

# إنشاء repo جديد ورفع الكود
gh repo create edu-center --public --source=. --remote=origin --push
```

---

## الخطوة 2: نشر Backend على Railway

1. اذهب إلى https://railway.app وسجل دخول بـ GitHub
2. اضغط "New Project" → "Deploy from GitHub repo"
3. اختر repo: `edu-center`
4. اضبط Root Directory: `backend`
5. أضف هذه الـ Services:
   - **PostgreSQL**: اضغط "+ New" → "Database" → "PostgreSQL"
   - **Redis**: اضغط "+ New" → "Database" → "Redis"
6. في إعدادات Backend service، أضف هذه المتغيرات:

```
NODE_ENV=production
POSTGRES_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<اختر كلمة سر طويلة عشوائية>
PORT=3000
ADMIN_EMAIL=admin@edu.com
ADMIN_PASSWORD=Admin@123
```

7. Railway سيبني ويشغل التطبيق تلقائياً
8. انسخ الـ URL من Railway (مثل: `https://edu-center-backend.up.railway.app`)

---

## الخطوة 3: نشر Frontend على Vercel

```bash
# من مجلد المشروع الرئيسي
cd frontend
npx vercel --prod
```

أو عبر الموقع:
1. اذهب إلى https://vercel.com وسجل دخول بـ GitHub
2. اضغط "New Project" → اختر repo `edu-center`
3. اضبط Root Directory: `frontend`
4. أضف متغير البيئة:
   ```
   NEXT_PUBLIC_API_URL=https://edu-center-backend.up.railway.app
   ```
5. اضغط Deploy

---

## الخطوة 4: تشغيل Migration وSeed

بعد نشر Backend على Railway، افتح Railway Shell أو نفذ:

```bash
# عبر Railway CLI
railway run --service backend npm run migration:run
railway run --service backend npm run seed:admin
```

أو من Railway Dashboard → Service → Shell:
```bash
npm run migration:run
npm run seed:admin
```

---

## الخيار 2: Docker Compose (Self-hosted)

```bash
# نسخ ملف البيئة
cp backend/.env.example backend/.env
# عدّل القيم في backend/.env

# تشغيل كل الخدمات
cd infra
docker-compose up -d

# تشغيل migrations
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed:admin
```

الموقع سيكون متاحاً على:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api

---

## بيانات الدخول الافتراضية

```
Email: admin@edu.com
Password: Admin@123
```

---

## متغيرات البيئة المطلوبة

| المتغير | الوصف | مثال |
|---------|-------|------|
| `POSTGRES_URL` | رابط قاعدة البيانات | `postgres://user:pass@host:5432/db` |
| `REDIS_URL` | رابط Redis | `redis://host:6379` |
| `JWT_SECRET` | مفتاح JWT (32+ حرف) | `my-super-secret-key-32chars` |
| `NODE_ENV` | بيئة التشغيل | `production` |
| `NEXT_PUBLIC_API_URL` | رابط Backend للـ Frontend | `https://api.example.com` |
