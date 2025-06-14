import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateBoilerCharacteristicDto } from 'src/boiler-characteristics/dtos';
import { CreateFuelCompositionDto } from 'src/fuel-compositions/dtos';
import { CreateFurnaceCharacteristicDto } from 'src/furnace-characteristics/dtos';
import { CreateConvectivePackageDto } from 'src/convective-packages/dtos';

export class CreateCalculationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateFuelCompositionDto)
  fuelComposition: CreateFuelCompositionDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateBoilerCharacteristicDto)
  boilerCharacteristics: CreateBoilerCharacteristicDto;

  @ApiProperty({ type: CreateFurnaceCharacteristicDto })
  @ValidateNested()
  @Type(() => CreateFurnaceCharacteristicDto)
  furnaceCharacteristics: CreateFurnaceCharacteristicDto;

  @ApiProperty({ type: [CreateConvectivePackageDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateConvectivePackageDto)
  convectivePackagesParameters: CreateConvectivePackageDto[];
}
