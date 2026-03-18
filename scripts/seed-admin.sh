#!/usr/bin/env bash
set -euo pipefail
psql "$POSTGRES_URL" <<'SQL'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  passwordHash text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
SQL
