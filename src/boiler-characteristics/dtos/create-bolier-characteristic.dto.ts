import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * DTO for creating boiler characteristics.
 *
 * Some properties are set according to ДКВР 10-13 boiler characteristics
 * and may be changed in the future.
 */
export class CreateBoilerCharacteristicDto {
  nominalSteamProduction: number = 10;

  @ApiProperty()
  @IsNumber()
  loadPercentage: number;

  blowdownPercentage: number = 2.1;
  excessPressureInBoiler: number = 1.3;

  @ApiProperty()
  @IsNumber()
  airHumidityForCombustion: number;

  @ApiProperty()
  @IsNumber()
  gasHumidityForCombustion: number;

  @ApiProperty()
  @IsNumber()
  feedWaterTemperature: number;

  @ApiProperty()
  @IsNumber()
  roomAirTemperature: number;

  @ApiProperty()
  @IsNumber()
  gasInletTemperature: number;

  flueGasAbsolutePressure = 0.1;
  excessAirCoefficient: number = 1.1;

  constructor(model: CreateBoilerCharacteristicDto) {
    if (!model) return;
    this.nominalSteamProduction =
      model.nominalSteamProduction || this.nominalSteamProduction;
    this.loadPercentage = model.loadPercentage || this.loadPercentage;
    this.blowdownPercentage =
      model.blowdownPercentage || this.blowdownPercentage;
    this.excessPressureInBoiler =
      model.excessPressureInBoiler || this.excessPressureInBoiler;
    this.airHumidityForCombustion =
      model.airHumidityForCombustion || this.airHumidityForCombustion;
    this.gasHumidityForCombustion =
      model.gasHumidityForCombustion || this.gasHumidityForCombustion;
    this.feedWaterTemperature =
      model.feedWaterTemperature || this.feedWaterTemperature;
    this.roomAirTemperature =
      model.roomAirTemperature || this.roomAirTemperature;
    this.gasInletTemperature =
      model.gasInletTemperature || this.gasInletTemperature;
    this.flueGasAbsolutePressure =
      model.flueGasAbsolutePressure || this.flueGasAbsolutePressure;
    this.excessAirCoefficient =
      model.excessAirCoefficient || this.excessAirCoefficient;
  }
}
