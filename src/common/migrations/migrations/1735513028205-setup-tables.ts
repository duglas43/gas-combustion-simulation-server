import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupTables1735513028205 implements MigrationInterface {
  name = 'SetupTables1735513028205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fuel_composition" ("id" SERIAL NOT NULL, "methane_percentage" double precision NOT NULL, "methane_heat_capacity" double precision NOT NULL, "ethane_percentage" double precision NOT NULL, "ethane_heat_capacity" double precision NOT NULL, "propane_percentage" double precision NOT NULL, "propane_heat_capacity" double precision NOT NULL, "n_butane_percentage" double precision NOT NULL, "n_butane_heat_capacity" double precision NOT NULL, "iso_butane_percentage" double precision NOT NULL, "iso_butane_heat_capacity" double precision NOT NULL, "pentane_percentage" double precision NOT NULL, "pentane_heat_capacity" double precision NOT NULL, "hydrogen_percentage" double precision NOT NULL, "hydrogen_heat_capacity" double precision NOT NULL, "ethylene_percentage" double precision NOT NULL, "ethylene_heat_capacity" double precision NOT NULL, "propylene_percentage" double precision NOT NULL, "propylene_heat_capacity" double precision NOT NULL, "butylene_percentage" double precision NOT NULL, "butylene_heat_capacity" double precision NOT NULL, "acetylene_percentage" double precision NOT NULL, "acetylene_heat_capacity" double precision NOT NULL, "hydrogen_sulfide_percentage" double precision NOT NULL, "hydrogen_sulfide_heat_capacity" double precision NOT NULL, "carbon_monoxide_percentage" double precision NOT NULL, "carbon_monoxide_heat_capacity" double precision NOT NULL, "carbon_dioxide_percentage" double precision NOT NULL, "carbon_dioxide_heat_capacity" double precision NOT NULL, "nitrogen_percentage" double precision NOT NULL, "nitrogen_heat_capacity" double precision NOT NULL, "oxygen_percentage" double precision NOT NULL, "oxygen_heat_capacity" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1af9bb2ffc5b602cb02aea4dc30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temperature_characteristic" ("id" SERIAL NOT NULL, "recirculation_rate" integer NOT NULL, "combustion_air_temperature" integer NOT NULL, "gas_mixture_heat_capacity" integer NOT NULL, "boiler_room_air_heat_capacity" integer NOT NULL, "combustion_air_heat_capacity" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bc3de6af2341728b2e4fcb2aa79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "heat_balance" ("id" SERIAL NOT NULL, "heat_loss_due_to_chemical_incomplete_combustion_percentage" double precision NOT NULL, "heat_input_from_fuel" double precision NOT NULL, "heat_input_from_air" double precision NOT NULL, "available_heat_input_to_boiler" double precision NOT NULL, "flue_gas_temperature" double precision NOT NULL, "flue_gas_enthalpy" double precision NOT NULL, "surrounding_air_enthalpy" double precision NOT NULL, "heat_loss_with_flue_gases" double precision NOT NULL, "heat_loss_with_flue_gases_percentage" double precision NOT NULL, "heat_loss_due_to_chemical_incomplete_combustion" double precision NOT NULL, "heat_loss_through_outer_walls_percentage" double precision NOT NULL, "heat_loss_through_outer_walls" double precision NOT NULL, "boiler_efficiency_gross" double precision NOT NULL, "total_heat_loss" double precision NOT NULL, "blowdown_water_flow" double precision NOT NULL, "useful_heat_utilized" double precision NOT NULL, "calculated_hourly_fuel_consumption" double precision NOT NULL, "heated_heat_carrier_flow" double precision NOT NULL, "heat_retention_coefficient" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d3cc719818cf5a168efc24e4d8c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "economizer_characteristic" ("id" SERIAL NOT NULL, "economizer_type" character varying NOT NULL, "tube_arrangement_scheme" character varying NOT NULL, "fin_shape" character varying NOT NULL, "outer_casing_tube_diameter" double precision NOT NULL, "fin_thickness" double precision NOT NULL, "fin_pitch" double precision NOT NULL, "fin_size" double precision NOT NULL, "tube_pitch_in_row" double precision NOT NULL, "row_pitch" double precision NOT NULL, "tubes_per_row" integer NOT NULL, "number_of_rows" integer NOT NULL, "average_tube_length" double precision NOT NULL, "heat_transfer_surface_area_per_tube" double precision NOT NULL, "fin_height" double precision NOT NULL, "relative_tube_pitch_in_row" double precision NOT NULL, "relative_row_pitch" double precision NOT NULL, "total_economizer_tubes" integer NOT NULL, "number_of_columns" integer NOT NULL, "total_heat_transfer_surface_area" double precision NOT NULL, "channel_cross_section_area" double precision NOT NULL, "equivalent_channel_diameter" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eb07c856a368f8d925fc0ef5e7c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "furnace_characteristic" ("id" SERIAL NOT NULL, "first_screen_area" double precision NOT NULL, "first_screen_angle_coefficient" double precision NOT NULL, "second_screen_area" double precision NOT NULL, "second_screen_angle_coefficient" double precision NOT NULL, "third_screen_area" double precision NOT NULL, "third_screen_angle_coefficient" double precision NOT NULL, "fourth_screen_area" double precision NOT NULL, "fourth_screen_angle_coefficient" double precision NOT NULL, "fifth_screen_area" double precision NOT NULL, "fifth_screen_angle_coefficient" double precision NOT NULL, "non_screened_furnace_area" double precision NOT NULL, "furnace_volume" double precision NOT NULL, "furnace_height" double precision NOT NULL, "first_burner_row_height" double precision NOT NULL, "burners_in_first_row" integer NOT NULL, "second_burner_row_height" double precision NOT NULL, "burners_in_second_row" integer NOT NULL, "first_screen_radiant_heat_surface" double precision NOT NULL, "second_screen_radiant_heat_surface" double precision NOT NULL, "third_screen_radiant_heat_surface" double precision NOT NULL, "fourth_screen_radiant_heat_surface" double precision NOT NULL, "fifth_screen_radiant_heat_surface" double precision NOT NULL, "total_radiant_heat_surface_area" double precision NOT NULL, "total_wall_surface_area" double precision NOT NULL, "furnace_screening_degree" double precision NOT NULL, "effective_radiating_layer_thickness" double precision NOT NULL, "total_burners_in_boiler" integer NOT NULL, "screen_contamination_factor" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_16481113263099fdbaf86f45acd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "convective_package" ("id" SERIAL NOT NULL, "package_number" integer NOT NULL, "outer_tube_diameter" double precision NOT NULL, "inner_tube_diameter" double precision NOT NULL, "tube_pitch_in_row" double precision NOT NULL, "row_pitch" double precision NOT NULL, "tubes_per_row" integer NOT NULL, "number_of_rows" integer NOT NULL, "min_cross_section_dimension" double precision NOT NULL, "max_cross_section_dimension" double precision NOT NULL, "average_tube_length" double precision NOT NULL, "relative_tube_pitch_in_row" double precision NOT NULL, "relative_row_pitch" double precision NOT NULL, "effective_radiating_layer_thickness" double precision NOT NULL, "convective_package_heat_surface_area" double precision NOT NULL, "total_number_of_tubes" integer NOT NULL, "channel_cross_section_area" double precision NOT NULL, "equivalent_channel_diameter" double precision NOT NULL, "wall_blackness_degree" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dfbf2f56ae384dea1683a932e60" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "furnace_heat_balance" ("id" SERIAL NOT NULL, "black_body_radiation_coefficient" double precision NOT NULL, "screen_pollution_coefficient" double precision NOT NULL, "parameter_m0" double precision NOT NULL, "luminous_flame_filling_coefficient" double precision NOT NULL, "furnace_exit_temperature_set" double precision NOT NULL, "combustion_product_enthalpy_exit" double precision NOT NULL, "combustion_air_enthalpy" double precision NOT NULL, "air_fraction_from_air_preheater" double precision NOT NULL, "heat_input_to_furnace_from_air" double precision NOT NULL, "useful_heat_release_in_furnace" double precision NOT NULL, "assumed_adiabatic_combustion_temperature" double precision NOT NULL, "actual_adiabatic_combustion_temperature" double precision NOT NULL, "imbalance_percentage" double precision NOT NULL, "average_heat_capacity_products_in_furnace" double precision NOT NULL, "average_thermal_efficiency_coefficient" double precision NOT NULL, "boltzmann_criterion" double precision NOT NULL, "max_temperature_zone_height" double precision NOT NULL, "relative_max_temperature_zone_position" double precision NOT NULL, "furnace_gas_dilution_coefficient" double precision NOT NULL, "calculated_parameter_m" double precision NOT NULL, "ray_attenuation_coefficient_three_atom_gases" double precision NOT NULL, "carbon_to_hydrogen_mass_ratio" double precision NOT NULL, "soot_ray_attenuation_coefficient" double precision NOT NULL, "furnace_medium_absorption_coefficient" double precision NOT NULL, "buger_criterion" double precision NOT NULL, "effective_buger_criterion" double precision NOT NULL, "combustion_product_exit_temperature" double precision NOT NULL, "calculated_imbalance" double precision NOT NULL, "heat_absorbed_by_radiative_screens" double precision NOT NULL, "specific_heat_load_radiative_screens" double precision NOT NULL, "specific_heat_tension_furnace_volume" double precision NOT NULL, "enthalpy_increment_heated_heat_carrier" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9f259d1f7a77e56132b6346b2d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "boiler_characteristic" ("id" SERIAL NOT NULL, "nominal_steam_production" double precision NOT NULL, "actual_steam_production" double precision NOT NULL, "load_percentage" double precision NOT NULL, "blowdown_percentage" double precision NOT NULL, "excess_pressure_in_boiler" double precision NOT NULL, "air_humidity_for_combustion" double precision NOT NULL, "gas_humidity_for_combustion" double precision NOT NULL, "feed_water_temperature" double precision NOT NULL, "room_air_temperature" double precision NOT NULL, "gas_inlet_temperature" double precision NOT NULL, "excess_air_coefficient" double precision NOT NULL, "flue_gas_absolute_pressure" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1aaa1b9e8ed0171246ae0a2dc47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "convective_package_heat_balance" ("id" SERIAL NOT NULL, "convective_package_id" integer NOT NULL, "average_heat_absorption_coefficient" double precision NOT NULL, "sum_angular_coefficients" double precision NOT NULL, "furnace_exit_window_area" double precision NOT NULL, "geometric_adjustment_factor" double precision NOT NULL, "screen_wall_blackness_degree" double precision NOT NULL, "heat_efficiency_coefficient" double precision NOT NULL, "heat_utilization_coefficient" double precision NOT NULL, "package_exit_temperature" double precision NOT NULL, "combustion_product_enthalpy_exit" double precision NOT NULL, "heat_balance_absorption" double precision NOT NULL, "radiative_heat_load" double precision NOT NULL, "heat_received_by_radiation" double precision NOT NULL, "enthalpy_increase" double precision NOT NULL, "heated_medium_temperature" double precision NOT NULL, "logarithmic_temperature_difference" double precision NOT NULL, "average_combustion_temperature" double precision NOT NULL, "average_combustion_velocity" double precision NOT NULL, "reynolds_criterion" double precision NOT NULL, "prandtl_criterion" double precision NOT NULL, "correction_coefficient_cs" double precision NOT NULL, "correction_coefficient_cz" double precision NOT NULL, "convective_heat_transfer_coefficient" double precision NOT NULL, "three_atom_gas_ray_attenuation_coefficient" double precision NOT NULL, "radiative_layer_optical_thickness" double precision NOT NULL, "effective_blackness_degree" double precision NOT NULL, "average_wall_temperature" double precision NOT NULL, "radiative_heat_transfer_coefficient" double precision NOT NULL, "heat_transfer_coefficient" double precision NOT NULL, "heat_transfer_by_equation" double precision NOT NULL, "exit_temperature_control_value" double precision NOT NULL, "heat_balance_imbalance" double precision NOT NULL, "specific_heat_transferred" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3987ecbc99dcb8733b26c43e64a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "air_excess_coefficient" ("id" SERIAL NOT NULL, "alpha" double precision NOT NULL, "alpha_burner" double precision NOT NULL, "alpha_furnace_avg" double precision NOT NULL, "alpha_furnace" double precision NOT NULL, "alpha_convective_package1_avg" double precision NOT NULL, "alpha_convective_package1" double precision NOT NULL, "alpha_convective_package2_avg" double precision NOT NULL, "alpha_convective_package2" double precision NOT NULL, "alpha_economizer_avg" double precision NOT NULL, "alpha_flue_gas" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69cef44a64626d71b700842552f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "combustion_material_balance" ("id" SERIAL NOT NULL, "air_excess_coefficient_id" integer NOT NULL, "actual_wet_air_consumption" double precision NOT NULL, "theoretical_co2_volume" double precision NOT NULL, "theoretical_so2_volume" double precision NOT NULL, "theoretical_water_vapor_volume" double precision NOT NULL, "theoretical_nitrogen_volume" double precision NOT NULL, "theoretical_oxygen_volume" double precision NOT NULL, "total_wet_combustion_products_volume" double precision NOT NULL, "specific_volume_fraction_ro2" double precision NOT NULL, "specific_volume_fraction_water_vapor" double precision NOT NULL, "specific_volume_fraction_triatomic_gases" double precision NOT NULL, "partial_pressure_ro2" double precision NOT NULL, "partial_pressure_water_vapor" double precision NOT NULL, "partial_pressure_triatomic_gases" double precision NOT NULL, "recirculation_rate" double precision NOT NULL, "specific_mass_of_combustion_products" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aabccc7586720adb3125f44a675" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "economizer_heat_balance" ("id" SERIAL NOT NULL, "geometric_adjustment_factor" double precision NOT NULL, "heat_efficiency_coefficient" double precision NOT NULL, "heat_utilization_coefficient" double precision NOT NULL, "economizer_exit_temperature" double precision NOT NULL, "combustion_product_enthalpy_exit" double precision NOT NULL, "economizer_heat_absorption" double precision NOT NULL, "max_heated_medium_temperature" double precision NOT NULL, "average_heated_medium_temperature" double precision NOT NULL, "enthalpy_increase" double precision NOT NULL, "heated_medium_exit_temperature" double precision NOT NULL, "average_heated_medium_exit_temperature" double precision NOT NULL, "logarithmic_temperature_difference" double precision NOT NULL, "average_combustion_temperature" double precision NOT NULL, "average_combustion_velocity" double precision NOT NULL, "reynolds_criterion" double precision NOT NULL, "prandtl_criterion" double precision NOT NULL, "finning_coefficient" double precision NOT NULL, "parameter_phi" double precision NOT NULL, "correction_coefficient_cs" double precision NOT NULL, "correction_coefficient_cz" double precision NOT NULL, "convective_heat_transfer_coefficient" double precision NOT NULL, "heat_transfer_coefficient" double precision NOT NULL, "heat_transfer_by_equation" double precision NOT NULL, "control_exit_temperature" double precision NOT NULL, "heat_balance_imbalance" double precision NOT NULL, "specific_heat_transfer_economizer" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_affe6baecd0aca274366bea81ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "air_leakage" ("id" SERIAL NOT NULL, "actual_furnace_air_leakage" integer NOT NULL, "nominal_furnace_air_leakage" integer NOT NULL, "actual_first_convective_air_leakage" integer NOT NULL, "nominal_first_convective_air_leakage" integer NOT NULL, "actual_second_convective_air_leakage" integer NOT NULL, "nominal_second_convective_air_leakage" integer NOT NULL, "actual_third_convective_air_leakage" integer NOT NULL, "nominal_third_convective_air_leakage" integer NOT NULL, "actual_economizer_air_leakage" integer NOT NULL, "nominal_economizer_air_leakage" integer NOT NULL, "actual_air_preheater_leakage" integer NOT NULL, "nominal_air_preheater_leakage" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1f5aefc7a91eff81bd0c87ac331" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "combustion_material_balance_temperature" ("id" SERIAL NOT NULL, "lower_heating_value" double precision NOT NULL, "higher_heating_value" double precision NOT NULL, "theoretical_dry_air_consumption" double precision NOT NULL, "theoretical_wet_air_consumption" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2a7ba3c9344d2fe3b8ff6b246a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "combustion_material_balance" ADD CONSTRAINT "FK_d7adb4058800d6c0119eb55efc0" FOREIGN KEY ("air_excess_coefficient_id") REFERENCES "air_excess_coefficient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "combustion_material_balance" DROP CONSTRAINT "FK_d7adb4058800d6c0119eb55efc0"`,
    );
    await queryRunner.query(
      `DROP TABLE "combustion_material_balance_temperature"`,
    );
    await queryRunner.query(`DROP TABLE "air_leakage"`);
    await queryRunner.query(`DROP TABLE "economizer_heat_balance"`);
    await queryRunner.query(`DROP TABLE "combustion_material_balance"`);
    await queryRunner.query(`DROP TABLE "air_excess_coefficient"`);
    await queryRunner.query(`DROP TABLE "convective_package_heat_balance"`);
    await queryRunner.query(`DROP TABLE "boiler_characteristic"`);
    await queryRunner.query(`DROP TABLE "furnace_heat_balance"`);
    await queryRunner.query(`DROP TABLE "convective_package"`);
    await queryRunner.query(`DROP TABLE "furnace_characteristic"`);
    await queryRunner.query(`DROP TABLE "economizer_characteristic"`);
    await queryRunner.query(`DROP TABLE "heat_balance"`);
    await queryRunner.query(`DROP TABLE "temperature_characteristic"`);
    await queryRunner.query(`DROP TABLE "fuel_composition"`);
  }
}