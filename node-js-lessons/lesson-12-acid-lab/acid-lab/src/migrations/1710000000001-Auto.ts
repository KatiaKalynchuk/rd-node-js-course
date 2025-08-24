import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMovements1710000000001 implements MigrationInterface {
  name = 'CreateMovements1710000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "movements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "from_id" uuid,
        "to_id" uuid,
        "amount" numeric(12,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_amount_positive" CHECK ("amount" > 0),
        CONSTRAINT "PK_movements" PRIMARY KEY ("id"),
        CONSTRAINT "FK_movements_from" FOREIGN KEY ("from_id") REFERENCES "accounts" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_movements_to" FOREIGN KEY ("to_id") REFERENCES "accounts" ("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movements"`);
  }
}
