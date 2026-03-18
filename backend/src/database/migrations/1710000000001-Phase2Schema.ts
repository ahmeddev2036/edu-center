import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase2Schema1710000000001 implements MigrationInterface {
  name = 'Phase2Schema1710000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "groups" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "subject" character varying,
        "teacherName" character varying,
        "schedule" character varying,
        "maxStudents" integer NOT NULL DEFAULT 0,
        "monthlyFee" numeric(10,2),
        "active" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_groups" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "schedules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "groupName" character varying NOT NULL,
        "teacherName" character varying NOT NULL,
        "dayOfWeek" character varying NOT NULL,
        "startTime" time NOT NULL,
        "endTime" time NOT NULL,
        "room" character varying,
        "active" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_schedules" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "senderName" character varying NOT NULL,
        "senderRole" character varying NOT NULL,
        "recipientId" character varying,
        "recipientGroup" character varying,
        "content" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "centerName" character varying NOT NULL DEFAULT 'مركز التعليم',
        "logoUrl" character varying,
        "phone" character varying,
        "address" character varying,
        "currency" character varying,
        "language" character varying NOT NULL DEFAULT 'ar',
        "notificationSettings" jsonb,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_settings" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "settings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "schedules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "groups"`);
  }
}
