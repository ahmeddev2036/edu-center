#!/usr/bin/env bash
set -euo pipefail
if [ -z "${1:-}" ] || [ -z "${2:-}" ]; then
  echo "Usage: $0 <email> <password>" >&2
  exit 1
fi
EMAIL=$1
PASSWORD=$2
HASH=$(node -e "const bcrypt=require('bcrypt');bcrypt.hash(process.argv[1],10).then(h=>console.log(h));" "$PASSWORD")
psql "$POSTGRES_URL" <<SQL
INSERT INTO users (email, "passwordHash", role)
VALUES ('$EMAIL', '$HASH', 'admin')
ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", role='admin';
SQL
