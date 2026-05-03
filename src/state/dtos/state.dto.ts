import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { ConvectivePackage } from 'src/phisics/convective-packages/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';
import { FurnaceCharacteristic } from 'src/phisics/furnace-characteristics/entities';
import { State } from '../entities';
import { Resource } from 'src/phisics/resources/entities/resource.entity';
import { AirLeakage } from 'src/phisics/air-leakages/entities';

export class StateDto {
  fuelComposition: Partial<FuelComposition>;

  boilerCharacteristics: Partial<BoilerCharacteristic>;

  airLeakage: Partial<AirLeakage>;

  furnaceCharacteristics: Partial<FurnaceCharacteristic>;

  convectivePackagesParameters: Partial<ConvectivePackage>[];

  resource: Partial<Resource>;

  constructor(model: StateDto | State) {
    this.fuelComposition = model.fuelComposition;
    this.boilerCharacteristics = model.boilerCharacteristics;
    this.airLeakage = model.airLeakage;
    this.furnaceCharacteristics = model.furnaceCharacteristics;
    this.convectivePackagesParameters = model.convectivePackagesParameters;
    this.resource = model.resource;
  }
}
