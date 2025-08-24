import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccounts1710000000000 implements MigrationInterface {
  name = 'CreateAccounts1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "balance" numeric(12,2) NOT NULL DEFAULT '0.00',
        CONSTRAINT "CHK_balance_non_negative" CHECK ("balance" >= 0),
        CONSTRAINT "PK_accounts" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "accounts"`);
  }
}
