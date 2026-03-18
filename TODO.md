# TODO — EduFlow: أساسيات اللغة والإرشادات والتعليمات

## ✅ المنجز (21 تحديث / 64 sub-feature)

### المرحلة 2 — تحديثات السنتر الأساسية
- [x] 2.1 Analytics Dashboard — رسوم بيانية حقيقية (Recharts)
- [x] 2.2 جدول الحصص — CRUD كامل
- [x] 2.3 تذكيرات تلقائية — Cron Jobs (يومي + شهري)
- [x] 2.4 QR Code حضور — scan endpoint + صفحة kiosk
- [x] 2.5 بوابة ولي الأمر — public endpoint بكود الطالب
- [x] 2.6 إدارة المجموعات — CRUD كامل
- [x] 2.7 نظام الرسائل — إرسال + قراءة + حذف
- [x] 2.8 تقارير PDF — طباعة من المتصفح
- [x] 2.9 إعدادات السنتر — اسم، شعار، عملة، لغة

### المرحلة 3 — SaaS Infrastructure
- [x] 3.1 Multi-tenant — Tenant entity + slug
- [x] 3.2 Landing Page — Hero + Features + Pricing
- [x] 3.3 خطط الاشتراك — basic/pro/enterprise
- [x] 3.4 نظام الدفع — Subscription entity + endpoints
- [x] 3.5 Super Admin Dashboard — إحصائيات + قائمة السنترات
- [x] 3.6 White Label — primaryColor + logoUrl per tenant
- [x] 3.7 Onboarding — صفحة تسجيل السنتر الجديد

### المرحلة 4 — AI Features
- [x] 4.1 تحليل أداء الطالب — attendance rate + avg score + risk level
- [x] 4.2 توليد أسئلة امتحان — حسب المادة والمستوى
- [x] 4.3 تقرير ذكي شامل — insights + recommendations
- [x] 4.4 مساعد AI — صفحة /dashboard/ai

---

## 🔜 TODO — أساسيات اللغة والإرشادات

### أ) i18n — دعم متعدد اللغات
```
TODO: تثبيت next-intl أو react-i18next
npm install next-intl

الملفات المطلوبة:
- frontend/messages/ar.json  ← النصوص العربية
- frontend/messages/en.json  ← النصوص الإنجليزية
- frontend/i18n.ts           ← إعداد اللغات
- تحديث next.config.js بـ i18n routing

مثال ar.json:
{
  "dashboard": "لوحة التحكم",
  "students": "الطلاب",
  "attendance": "الحضور",
  "exams": "الامتحانات",
  "finance": "المالية",
  "reports": "التقارير",
  "settings": "الإعدادات",
  "logout": "تسجيل الخروج",
  "save": "حفظ",
  "cancel": "إلغاء",
  "delete": "حذف",
  "edit": "تعديل",
  "add": "إضافة",
  "search": "بحث",
  "loading": "جاري التحميل...",
  "noData": "لا توجد بيانات بعد"
}
```

### ب) RTL/LTR Support
```
TODO: تحديث globals.css لدعم LTR عند اختيار الإنجليزية
- إضافة [dir="ltr"] styles
- استخدام CSS logical properties (margin-inline-start بدل margin-right)
- تحديث Sidebar ليكون على اليسار في LTR
```

### ج) Validation Messages بالعربي
```
TODO: تحديث backend DTOs لإضافة رسائل خطأ عربية
مثال:
@IsString({ message: 'يجب أن يكون نصاً' })
@IsNotEmpty({ message: 'هذا الحقل مطلوب' })
@MinLength(8, { message: 'يجب أن يكون 8 أحرف على الأقل' })
@IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
```

### د) Error Messages موحدة
```
TODO: إنشاء frontend/lib/errors.ts
const ERRORS: Record<string, string> = {
  'Unauthorized': 'غير مصرح لك بالدخول',
  'Not Found': 'العنصر غير موجود',
  'Conflict': 'هذا العنصر موجود بالفعل',
  'Bad Request': 'البيانات المدخلة غير صحيحة',
  'Internal Server Error': 'خطأ في الخادم، حاول مرة أخرى',
};
```

---

## 🔜 TODO — تحسينات تقنية مهمة

### 1. OpenAI Integration (4.4 WhatsApp Chatbot)
```
TODO: تثبيت openai package
npm install openai

في backend/src/modules/ai/ai.service.ts:
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// توليد أسئلة حقيقية
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: `اكتب ${count} سؤال ${level} في مادة ${subject}` }]
});

متغيرات البيئة المطلوبة:
OPENAI_API_KEY=sk-...
```

### 2. WhatsApp Integration (Twilio / Meta API)
```
TODO: في backend/src/infra/notification-dispatcher.ts
- تفعيل Twilio WhatsApp API
- إضافة TWILIO_ACCOUNT_SID و TWILIO_AUTH_TOKEN في .env
- تفعيل إرسال الرسائل الفعلي بدل mock
```

### 3. Payment Gateway (Stripe / Paymob)
```
TODO: دمج بوابة دفع حقيقية للاشتراكات
npm install stripe

في backend/src/modules/tenants/tenants.service.ts:
- إضافة createPaymentIntent
- إضافة webhook handler
- تحديث subscription status بعد الدفع

متغيرات البيئة:
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. File Upload (Cloudinary / S3)
```
TODO: رفع الشعارات والملفات
npm install @nestjs/platform-express multer cloudinary

في backend/src/modules/settings/settings.controller.ts:
@Post('upload-logo')
@UseInterceptors(FileInterceptor('file'))
uploadLogo(@UploadedFile() file: Express.Multer.File) { ... }
```

### 5. Real-time (WebSockets)
```
TODO: إضافة WebSocket للرسائل الفورية
npm install @nestjs/websockets @nestjs/platform-socket.io

في backend/src/modules/messages/messages.gateway.ts:
@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: any) { ... }
}
```

### 6. Redis Caching
```
TODO: تفعيل caching للـ analytics
في backend/src/modules/reports/reports.service.ts:
@Cacheable({ ttl: 300 }) // 5 دقائق
async getAnalytics() { ... }
```

---

## 🔜 TODO — أمان وحماية

### 1. Rate Limiting محسّن
```
TODO: تخصيص rate limits لكل endpoint
@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 طلبات/دقيقة للـ login
@Post('login')
```

### 2. CORS محدد
```
TODO: في backend/src/main.ts
app.enableCors({
  origin: [process.env.FRONTEND_URL, 'https://eduflow.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});
```

### 3. Helmet Security Headers
```
TODO: npm install helmet
app.use(helmet());
```

### 4. Input Sanitization
```
TODO: npm install class-sanitizer
إضافة @Sanitize() decorators في DTOs
```

---

## 🔜 TODO — اختبارات

### Unit Tests
```
TODO: إضافة tests لكل service جديد
- groups.service.spec.ts
- schedule.service.spec.ts
- messages.service.spec.ts
- settings.service.spec.ts
- ai.service.spec.ts
- tenants.service.spec.ts
```

### E2E Tests
```
TODO: في backend/test/
- groups.e2e-spec.ts
- schedule.e2e-spec.ts
- ai.e2e-spec.ts
```

---

## 🔜 TODO — DevOps

### Docker Compose محدث
```
TODO: تحديث docker-compose.yml بإضافة:
- redis service
- nginx reverse proxy
- ssl termination
```

### CI/CD
```
TODO: إضافة .github/workflows/deploy.yml
- run tests on PR
- build and push Docker image
- deploy to Railway on merge to main
```

### Monitoring
```
TODO: إضافة monitoring
- Sentry للـ error tracking
- Datadog أو Grafana للـ metrics
- Uptime monitoring
```

---

## 📋 ترتيب التنفيذ المقترح

1. **أولاً**: i18n + validation messages بالعربي (أسبوع 1)
2. **ثانياً**: OpenAI integration + WhatsApp real (أسبوع 2)
3. **ثالثاً**: Payment gateway (Stripe/Paymob) (أسبوع 3)
4. **رابعاً**: File upload + WebSockets (أسبوع 4)
5. **خامساً**: Tests + CI/CD (أسبوع 5)
6. **سادساً**: Monitoring + Security hardening (أسبوع 6)

---

*آخر تحديث: مارس 2026*
