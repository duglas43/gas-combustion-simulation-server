import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { ConvectivePackage } from 'src/phisics/convective-packages/entities';
import { EconomizerCharacteristic } from 'src/phisics/economizer-characteristics/entities';
import { FuelComposition } from 'src/phisics/fuel-compositions/entities';
import { FurnaceCharacteristic } from 'src/phisics/furnace-characteristics/entities';

export class State {
  fuelComposition: FuelComposition;

  boilerCharacteristics: BoilerCharacteristic;

  furnaceCharacteristics: FurnaceCharacteristic;

  convectivePackagesParameters: ConvectivePackage[];

  economizerCharacteristic: EconomizerCharacteristic;

  constructor(model: State) {
    this.fuelComposition = model.fuelComposition;
    this.boilerCharacteristics = model.boilerCharacteristics;
    this.furnaceCharacteristics = model.furnaceCharacteristics;
    this.convectivePackagesParameters = model.convectivePackagesParameters;
    this.economizerCharacteristic = model.economizerCharacteristic;
  }
}
