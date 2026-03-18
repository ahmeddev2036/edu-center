# نظام إدارة المراكز التعليمية

منصة متكاملة لإدارة المراكز التعليمية — NestJS (Backend) + Next.js (Frontend)

---

## 🚀 روابط النشر

| الخدمة | الرابط |
|--------|--------|
| Frontend (Vercel) | https://frontend-two-drab-22.vercel.app |
| Backend API (Railway) | https://backend-production-bdafc.up.railway.app |
| API Docs (Swagger) | https://backend-production-bdafc.up.railway.app/docs |
| Health Check | https://backend-production-bdafc.up.railway.app/health |
| GitHub Repo | https://github.com/ahmeddev2036/edu-center |

## بيانات الدخول الافتراضية
```
Email: admin@edu.com
Password: Admin@123
```

---

## المتطلبات

- Node.js >= 20
- Docker Desktop (للتشغيل الكامل)
- أو: PostgreSQL 16 + Redis 7 محلياً

---

## التشغيل السريع بـ Docker (موصى به)

```bash
# تشغيل كل الـ services
cd infra && docker compose up -d --build

# أو باستخدام Makefile
make docker-up
```

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/docs

---

## التشغيل المحلي (بدون Docker)

### 1. تشغيل Postgres و Redis فقط بـ Docker

```bash
make docker-db
# أو
cd infra && docker compose up -d db redis
```

### 2. تثبيت الـ dependencies

```bash
make install
# أو
cd backend && npm install
cd frontend && npm install
```

### 3. إعداد ملفات البيئة

```bash
# backend/.env موجود بالفعل — تحقق من القيم
# frontend/.env.local موجود بالفعل
```

### 4. تشغيل الـ backend

```bash
cd backend && npm run start:dev
```

### 5. تشغيل الـ frontend

```bash
cd frontend && npm run dev
```

---

## أول تسجيل دخول

```
البريد: admin@edu.com
كلمة المرور: Admin@123
```

لإنشاء الـ admin يدوياً (إذا لم يكن موجوداً):

```bash
make seed
# أو
cd backend && npm run seed:admin
```

---

## البناء والاختبارات

```bash
# بناء كل شيء
make build

# تشغيل الاختبارات
make test

# بناء backend فقط
make build-backend

# بناء frontend فقط
make build-frontend
```

---

## API Endpoints الرئيسية

| الوحدة | Endpoint | الوصف |
|--------|----------|-------|
| Auth | `POST /auth/login` | تسجيل الدخول |
| Auth | `GET /auth/me` | بيانات المستخدم الحالي |
| Students | `GET/POST /students` | قائمة / إضافة طلاب |
| Students | `PUT/DELETE /students/:id` | تعديل / حذف طالب |
| Attendance | `POST /attendance` | تسجيل حضور |
| Attendance | `GET /attendance/session/:date` | حضور جلسة |
| Exams | `GET/POST /exams` | قائمة / إضافة امتحانات |
| Exams | `POST /exams/:id/results` | إضافة نتيجة |
| Finance | `GET/POST /finance/payments` | المدفوعات |
| Finance | `GET /finance/summary/daily` | ملخص يومي |
| Staff | `GET/POST /staff` | الموظفون |
| Media | `GET/POST /media/videos` | الفيديوهات |
| Reports | `GET /reports/attendance/daily` | تقرير الحضور |
| Reports | `GET /reports/finance/monthly` | التقرير المالي |
| Notifications | `POST /notifications/whatsapp` | إرسال واتساب |
| Certificates | `POST /certificates/generate` | توليد شهادة PDF |
| Health | `GET /health` | فحص الـ services |

---

## الإشعارات

اضبط في `backend/.env`:

```env
WHATSAPP_WEBHOOK_URL=https://...
EMAIL_WEBHOOK_URL=https://...
SMS_WEBHOOK_URL=https://...
NOTIFY_API_KEY=your-key
```

---

## Swagger

متاح على: http://localhost:3000/docs

استخدم `POST /auth/login` للحصول على token ثم اضغط "Authorize" في Swagger.

---

## هيكل المشروع

```
├── backend/          # NestJS API
│   ├── src/
│   │   ├── entities/     # TypeORM entities
│   │   ├── modules/      # Feature modules
│   │   ├── infra/        # Redis / Queue
│   │   └── database/     # Migrations / Seed
│   └── Dockerfile
├── frontend/         # Next.js 14 App Router
│   ├── app/
│   │   ├── login/
│   │   └── dashboard/    # كل الصفحات
│   ├── components/
│   ├── lib/api.ts        # API client موحد
│   └── Dockerfile
├── infra/
│   └── docker-compose.yml
└── Makefile
```
