# Deployment checklist (ãÎÊÕÑ)
- Docker images: backend, frontend ãÈäíÉ ãä Dockerfiles ÇáÍÇáíÉ.
- Kubernetes: ÑÇÌÚ `infra/k8s/backend.yaml` æ`infra/k8s/frontend.yaml`º ÃÖİ Ingress + TLS ÍÓÈ ÇáÓÍÇÈÉ (ALB/Nginx).
- ÃÓÑÇÑ: ÎÒøä POSTGRES_URL æJWT_SECRET æREDIS/MONGO İí Secret Manager Ãæ K8s Secrets.
- ãÑÇŞÈÉ: ÃÖİ Prometheus/Grafana charts¡ æÑÈØ Sentry DSN ÈÇáÎÏãÊíä.
- äÓÎ ÇÍÊíÇØí: Snapshot áŞÇÚÏÉ PostgreSQL + Mongo íæãíğÇ.
