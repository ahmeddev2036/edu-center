#!/usr/bin/env bash
set -euo pipefail
psql "$POSTGRES_URL" <<'SQL'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  "passwordHash" text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "fullName" text NOT NULL,
  code text UNIQUE NOT NULL,
  "groupName" text,
  "guardianPhone" text,
  "userId" uuid REFERENCES users(id),
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "studentId" uuid REFERENCES students(id),
  "sessionDate" date NOT NULL,
  present boolean DEFAULT true,
  note text,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "studentId" text NOT NULL,
  amount numeric(10,2) NOT NULL,
  category text DEFAULT 'tuition',
  "paidAt" timestamptz NOT NULL,
  reference text,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text DEFAULT 'teacher',
  "salaryMode" text,
  rate numeric(10,2),
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  provider text NOT NULL,
  "sourceUrl" text NOT NULL,
  "allowedGroup" text,
  downloadable boolean DEFAULT false,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  subject text,
  "scheduledAt" timestamptz,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "examId" uuid REFERENCES exams(id),
  text text NOT NULL,
  choices jsonb,
  "correctAnswer" text,
  type text DEFAULT 'mcq'
);
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "examId" uuid REFERENCES exams(id),
  "studentId" uuid REFERENCES students(id),
  score numeric(5,2) NOT NULL,
  grade text
);
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel text NOT NULL,
  recipient text NOT NULL,
  template text NOT NULL,
  status text DEFAULT 'queued',
  "createdAt" timestamptz DEFAULT now()
);
SQL
