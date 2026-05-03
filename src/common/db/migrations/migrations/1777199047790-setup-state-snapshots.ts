import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupStateSnapshots1777199047790 implements MigrationInterface {
  name = 'SetupStateSnapshots1777199047790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "state_snapshots" ("time" TIMESTAMP NOT NULL, "timestamp" bigint NOT NULL, "state" jsonb NOT NULL, "laws" jsonb, CONSTRAINT "UQ_state_snapshots_timestamp" UNIQUE ("timestamp"), CONSTRAINT "PK_state_snapshots_time" PRIMARY KEY ("time"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "state_snapshots"`);
  }
}
