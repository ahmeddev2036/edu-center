import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1710000000000 implements MigrationInterface {
  name = 'InitSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'admin',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "students" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fullName" character varying NOT NULL,
        "code" character varying NOT NULL,
        "groupName" character varying,
        "guardianPhone" character varying,
        "userId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_students_code" UNIQUE ("code"),
        CONSTRAINT "PK_students" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "staff" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'teacher',
        "salaryMode" character varying,
        "rate" numeric(10,2),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_staff" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "attendance_records" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sessionDate" date NOT NULL,
        "present" boolean NOT NULL DEFAULT true,
        "note" character varying,
        "studentId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_attendance_records" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "studentId" character varying NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "category" character varying NOT NULL DEFAULT 'tuition',
        "paidAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "reference" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exams" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "subject" character varying,
        "scheduledAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exams" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "questions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "text" character varying NOT NULL,
        "choices" jsonb,
        "correctAnswer" character varying,
        "type" character varying NOT NULL DEFAULT 'mcq',
        "examId" uuid NOT NULL,
        CONSTRAINT "PK_questions" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exam_results" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "score" numeric(5,2) NOT NULL,
        "grade" character varying,
        "examId" uuid NOT NULL,
        "studentId" uuid NOT NULL,
        CONSTRAINT "PK_exam_results" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "videos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "provider" character varying NOT NULL,
        "sourceUrl" character varying NOT NULL,
        "allowedGroup" character varying,
        "downloadable" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_videos" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "channel" character varying NOT NULL,
        "recipient" character varying NOT NULL,
        "template" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'queued',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);

    // Foreign keys
    await queryRunner.query(`
      ALTER TABLE "students" ADD CONSTRAINT "FK_students_user"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "attendance_records" ADD CONSTRAINT "FK_attendance_student"
      FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "questions" ADD CONSTRAINT "FK_questions_exam"
      FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "exam_results" ADD CONSTRAINT "FK_results_exam"
      FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "exam_results" ADD CONSTRAINT "FK_results_student"
      FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "videos"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exam_results"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "questions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exams"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "attendance_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "staff"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "students"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
