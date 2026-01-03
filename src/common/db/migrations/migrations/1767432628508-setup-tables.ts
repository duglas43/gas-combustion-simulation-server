import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupTables1767432628508 implements MigrationInterface {
    name = 'SetupTables1767432628508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "observations" ("time" TIMESTAMP WITH TIME ZONE NOT NULL, "timestamp" bigint NOT NULL, "efficiency" double precision NOT NULL, "adiabatic_combustion_temperature" double precision NOT NULL, "furnace_exit_temperature" double precision NOT NULL, "first_convective_package_exit_temperature" double precision NOT NULL, "second_convective_package_exit_temperature" double precision NOT NULL, "economizer_exit_temperature" double precision NOT NULL, "flue_gas_temperature" double precision NOT NULL, "fuel_consumption" double precision NOT NULL, "losses_with_flue_gas_percentage" double precision NOT NULL, "losses_through_walls_percentage" double precision NOT NULL, "total_losses" double precision NOT NULL, "furnace_imbalance" double precision NOT NULL, "first_convective_package_imbalance" double precision NOT NULL, "second_convective_package_imbalance" double precision NOT NULL, "economizer_imbalance" double precision NOT NULL, CONSTRAINT "UQ_d25978474f6ba29221c54406ed4" UNIQUE ("timestamp"), CONSTRAINT "PK_5a7a902c471e40381918ceacf0d" PRIMARY KEY ("time"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "observations"`);
    }

}
