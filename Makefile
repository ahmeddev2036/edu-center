.PHONY: help dev build test seed clean docker-up docker-down docker-logs

help: ## عرض المساعدة
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── تثبيت الـ dependencies ───────────────────────────────────────────────────
install: ## تثبيت كل الـ dependencies
	cd backend && npm install
	cd frontend && npm install

# ─── بناء المشروع ─────────────────────────────────────────────────────────────
build: ## بناء backend و frontend
	cd backend && npm run build
	cd frontend && npm run build

build-backend: ## بناء backend فقط
	cd backend && npm run build

build-frontend: ## بناء frontend فقط
	cd frontend && npm run build

# ─── الاختبارات ───────────────────────────────────────────────────────────────
test: ## تشغيل كل الاختبارات
	cd backend && npm test -- --runInBand

test-watch: ## تشغيل الاختبارات في watch mode
	cd backend && npm test -- --watch

# ─── التشغيل المحلي (يحتاج Postgres و Redis) ─────────────────────────────────
dev-backend: ## تشغيل backend في dev mode
	cd backend && npm run start:dev

dev-frontend: ## تشغيل frontend في dev mode
	cd frontend && npm run dev

# ─── قاعدة البيانات ───────────────────────────────────────────────────────────
migrate: ## تشغيل الـ migrations
	cd backend && npm run migration:run

seed: ## إنشاء أول admin
	cd backend && npm run seed:admin

# ─── Docker ───────────────────────────────────────────────────────────────────
docker-up: ## تشغيل كل الـ services بـ Docker
	cd infra && docker compose up -d --build

docker-down: ## إيقاف كل الـ services
	cd infra && docker compose down

docker-logs: ## عرض الـ logs
	cd infra && docker compose logs -f

docker-db: ## تشغيل Postgres و Redis فقط (للتطوير المحلي)
	cd infra && docker compose up -d db redis

docker-clean: ## حذف كل الـ containers والـ volumes
	cd infra && docker compose down -v --remove-orphans

# ─── تنظيف ────────────────────────────────────────────────────────────────────
clean: ## حذف ملفات البناء
	rm -rf backend/dist
	rm -rf frontend/.next
