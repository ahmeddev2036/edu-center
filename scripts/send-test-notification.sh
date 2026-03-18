#!/usr/bin/env bash
set -euo pipefail
API=${API:-http://localhost:3000}
TOKEN=${TOKEN:-}
if [ -z "$TOKEN" ]; then
  echo "Set TOKEN=... (Bearer)" >&2
  exit 1
fi
RECIPIENT=${1:-01113955198}
curl -s -X POST "$API/notifications/whatsapp" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"recipient\":\"$RECIPIENT\",\"template\":\"absence_alert\",\"payload\":{\"student\":\"Test Student\",\"session\":\"Math\"}}"
