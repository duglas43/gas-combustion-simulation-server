export class FuelComposition {
  methanePercentage: number;

  methaneHeatCapacity: number;

  ethanePercentage: number;

  ethaneHeatCapacity: number;

  propanePercentage: number;

  propaneHeatCapacity: number;

  nButanePercentage: number;

  nButaneHeatCapacity: number;

  isoButanePercentage: number;

  isoButaneHeatCapacity: number;

  pentanePercentage: number;

  pentaneHeatCapacity: number;

  hydrogenPercentage: number;

  hydrogenHeatCapacity: number;

  ethylenePercentage: number;

  ethyleneHeatCapacity: number;

  propylenePercentage: number;

  propyleneHeatCapacity: number;

  butylenePercentage: number;

  butyleneHeatCapacity: number;

  acetylenePercentage: number;

  acetyleneHeatCapacity: number;

  hydrogenSulfidePercentage: number;

  hydrogenSulfideHeatCapacity: number;

  carbonMonoxidePercentage: number;

  carbonMonoxideHeatCapacity: number;

  carbonDioxidePercentage: number;

  carbonDioxideHeatCapacity: number;

  nitrogenPercentage: number;

  nitrogenHeatCapacity: number;

  oxygenPercentage: number;

  oxygenHeatCapacity: number;

  constructor(model: FuelComposition) {
    this.methanePercentage = model.methanePercentage;
    this.methaneHeatCapacity = model.methaneHeatCapacity;
    this.ethanePercentage = model.ethanePercentage;
    this.ethaneHeatCapacity = model.ethaneHeatCapacity;
    this.propanePercentage = model.propanePercentage;
    this.propaneHeatCapacity = model.propaneHeatCapacity;
    this.nButanePercentage = model.nButanePercentage;
    this.nButaneHeatCapacity = model.nButaneHeatCapacity;
    this.isoButanePercentage = model.isoButanePercentage;
    this.isoButaneHeatCapacity = model.isoButaneHeatCapacity;
    this.pentanePercentage = model.pentanePercentage;
    this.pentaneHeatCapacity = model.pentaneHeatCapacity;
    this.hydrogenPercentage = model.hydrogenPercentage;
    this.hydrogenHeatCapacity = model.hydrogenHeatCapacity;
    this.ethylenePercentage = model.ethylenePercentage;
    this.ethyleneHeatCapacity = model.ethyleneHeatCapacity;
    this.butylenePercentage = model.butylenePercentage;
    this.butyleneHeatCapacity = model.butyleneHeatCapacity;
    this.acetylenePercentage = model.acetylenePercentage;
    this.acetyleneHeatCapacity = model.acetyleneHeatCapacity;
    this.hydrogenSulfidePercentage = model.hydrogenSulfidePercentage;
    this.hydrogenSulfideHeatCapacity = model.hydrogenSulfideHeatCapacity;
    this.carbonMonoxidePercentage = model.carbonMonoxidePercentage;
    this.carbonMonoxideHeatCapacity = model.carbonMonoxideHeatCapacity;
    this.carbonDioxidePercentage = model.carbonDioxidePercentage;
    this.carbonDioxideHeatCapacity = model.carbonDioxideHeatCapacity;
    this.nitrogenPercentage = model.nitrogenPercentage;
    this.nitrogenHeatCapacity = model.nitrogenHeatCapacity;
    this.oxygenPercentage = model.oxygenPercentage;
    this.oxygenHeatCapacity = model.oxygenHeatCapacity;
    this.propylenePercentage = model.propylenePercentage;
    this.propyleneHeatCapacity = model.propyleneHeatCapacity;
  }
}
