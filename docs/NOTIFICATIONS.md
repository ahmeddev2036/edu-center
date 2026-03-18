# ÅÔÚÇÑÇÊ / Notifications

## ÇáÅÚÏÇÏ
- ÇáãÊÛíÑÇÊ İí backend/.env.example:
  - REDIS_URL Ãæ REDIS_HOST/REDIS_PORT
  - WHATSAPP_WEBHOOK_URL / EMAIL_WEBHOOK_URL / SMS_WEBHOOK_URL
  - NOTIFY_API_KEY (íÑÓá İí ÇáåíÏÑ X-API-KEY)

## ÇáÊÏİŞ
1) ÇÓÊÏÚÇÁ API `POST /notifications/whatsapp` (Ãæ email/sms) ? íÏÎá job İí ØÇÈæÑ BullMQ.
2) ÇáÜ Worker İí `QueueModule` íáÊŞØ ÇáÜ job æíÑÓá Webhook. áæ áã ÊÖÈØ ÇáÑæÇÈØ ÓíØÈÚ ÇáÍãæáÉ İí ÇááæÌ.

## ÇÎÊÈÇÑ ÓÑíÚ
- ÔÛøá ÇáÎÏãÇÊ (docker compose up) æÇÖÈØ Redis/Postgres.
- ÒÑÚ ÃÏãä¡ ÇÍÕá Úáì Token ãä `/auth/login`.
- Ëã ÔÛøá ÇáÓßÑÈÊ:
  ```bash
  TOKEN=... ./scripts/send-test-notification.sh 01113955198
  ```
- ÑÇŞÈ ÇááæÌ İí backend áÊÑì ÇáÍãæáÉ Ãæ ÑÏ ÇáãÒæÏ.

## äãÇĞÌ ŞæÇáÈ
- absence_alert: { student, session }
- payment_due: { student, amount, due_date }
- exam_result: { student, exam, score, grade }
