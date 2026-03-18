import { MigrationInterface, QueryRunner } from 'typeorm';

export class SaaSSchema1710000000002 implements MigrationInterface {
  name = 'SaaSSchema1710000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" character varying NOT NULL,
        "name" character varying NOT NULL,
        "logoUrl" character varying,
        "primaryColor" character varying,
        "plan" character varying NOT NULL DEFAULT 'trial',
        "active" boolean NOT NULL DEFAULT true,
        "ownerEmail" character varying,
        "phone" character varying,
        "address" character varying,
        "trialEndsAt" TIMESTAMP,
        "subscriptionEndsAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_tenants_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL,
        "plan" character varying NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "billingCycle" character varying NOT NULL DEFAULT 'monthly',
        "status" character varying NOT NULL DEFAULT 'active',
        "startsAt" TIMESTAMP,
        "endsAt" TIMESTAMP,
        "paymentRef" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "subscriptions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);
  }
}
