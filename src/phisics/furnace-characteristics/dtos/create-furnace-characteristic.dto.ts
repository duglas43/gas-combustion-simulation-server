import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * DTO for creating boiler characteristics.
 *
 * Some properties are set according to ДКВР 10-13 boiler characteristics
 * and may be changed in the future.
 */
export class CreateFurnaceCharacteristicDto {
  firstScreenArea: number = 5.94;
  firstScreenAngleCoefficient: number = 0.88;
  secondScreenArea: number = 26.4;
  secondScreenAngleCoefficient: number = 0.94;
  thirdScreenArea: number = 22.9;
  thirdScreenAngleCoefficient: number = 0.9;
  fourthScreenArea: number = 11.3;
  fourthScreenAngleCoefficient: number = 0.88;
  fifthScreenArea: number = 0;
  fifthScreenAngleCoefficient: number = 0;
  nonScreenedFurnaceArea: number = 14;
  furnaceVolume: number = 40.5;
  furnaceHeight: number = 4.4;
  firstBurnerRowHeight: number = 1;
  burnersInFirstRow: number = 2;
  secondBurnerRowHeight: number = 0;
  burnersInSecondRow: number = 0;
  firstScreenRadiantHeatSurface: number = 5.23;
  secondScreenRadiantHeatSurface: number = 24.82;
  thirdScreenRadiantHeatSurface: number = 20.61;
  fourthScreenRadiantHeatSurface: number = 9.94;
  fifthScreenRadiantHeatSurface: number = 0;
  totalRadiantHeatSurfaceArea: number = 60.6;
  totalWallSurfaceArea: number = 80.54;
  furnaceScreeningDegree: number = 0.752;
  effectiveRadiatingLayerThickness: number = 1.81;
  totalBurnersInBoiler: number = 2;

  @ApiProperty()
  @IsNumber()
  screenContaminationFactor: number;
}
