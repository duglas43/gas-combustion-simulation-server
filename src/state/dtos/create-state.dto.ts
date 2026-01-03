import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateBoilerCharacteristicDto } from 'src/phisics/boiler-characteristics/dtos';
import { CreateFuelCompositionDto } from 'src/phisics/fuel-compositions/dtos';
import { CreateFurnaceCharacteristicDto } from 'src/phisics/furnace-characteristics/dtos';
import { CreateConvectivePackageDto } from 'src/phisics/convective-packages/dtos';

export class CreateStateDto {
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
