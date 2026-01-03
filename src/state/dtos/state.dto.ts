import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { ConvectivePackage } from 'src/phisics/convective-packages/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';
import { FurnaceCharacteristic } from 'src/phisics/furnace-characteristics/entities';
import { State } from '../entities';

export class StateDto {
  fuelComposition: Partial<FuelComposition>;

  boilerCharacteristics: Partial<BoilerCharacteristic>;

  furnaceCharacteristics: Partial<FurnaceCharacteristic>;

  convectivePackagesParameters: Partial<ConvectivePackage>[];

  constructor(model: StateDto | State) {
    this.fuelComposition = model.fuelComposition;
    this.boilerCharacteristics = model.boilerCharacteristics;
    this.furnaceCharacteristics = model.furnaceCharacteristics;
    this.convectivePackagesParameters = model.convectivePackagesParameters;
  }
}
