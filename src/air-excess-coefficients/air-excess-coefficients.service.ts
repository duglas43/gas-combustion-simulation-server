import { Injectable } from '@nestjs/common';
import { CalculateAirExcessCoefficientParams } from './interfaces';
import { AirExcessCoefficient } from './entities';

@Injectable()
export class AirExcessCoefficientsService {
  constructor() {}

  public calculate(params: CalculateAirExcessCoefficientParams) {
    const airExcessCoefficients: AirExcessCoefficient[] = [];
    const alphaAirExcessCoefficient = new AirExcessCoefficient({
      name: 'alpha',
      value: 1,
    });
    const alphaBurnerAirExcessCoefficient = new AirExcessCoefficient({
      name: 'alphaBurner',
      value: params.boilerCharacteristic.excessAirCoefficient,
    });
    const alphaFurnaceAirExcessCoefficient = new AirExcessCoefficient({
      name: 'alphaFurnace',
      value:
        alphaBurnerAirExcessCoefficient.value +
        params.airLeakage.actualFurnaceAirLeakage,
    });
    const alphaFurnaceAvgAirExcessCoefficient = new AirExcessCoefficient({
      name: 'alphaFurnaceAvg',
      value:
        (alphaBurnerAirExcessCoefficient.value +
          alphaFurnaceAirExcessCoefficient.value) /
        2,
    });
    const alphaConvectivePackage1AirExcessCoefficient =
      new AirExcessCoefficient({
        name: 'alphaConvectivePackage1',
        value:
          alphaFurnaceAirExcessCoefficient.value +
          params.airLeakage.actualFirstConvectiveAirLeakage,
      });
    const alphaConvectivePackage1AvgAirExcessCoefficient =
      new AirExcessCoefficient({
        name: 'alphaConvectivePackage1Avg',
        value:
          (alphaFurnaceAirExcessCoefficient.value +
            alphaConvectivePackage1AirExcessCoefficient.value) /
          2,
      });
    const alphaConvectivePackage2AirExcessCoefficient =
      new AirExcessCoefficient({
        name: 'alphaConvectivePackage2',
        value:
          alphaConvectivePackage1AirExcessCoefficient.value +
          params.airLeakage.actualSecondConvectiveAirLeakage,
      });
    const alphaConvectivePackage2AvgAirExcessCoefficient =
      new AirExcessCoefficient({
        name: 'alphaConvectivePackage2Avg',
        value:
          (alphaConvectivePackage1AirExcessCoefficient.value +
            alphaConvectivePackage2AirExcessCoefficient.value) /
          2,
      });
    const alphaEconomizerAirExcessCoefficient = new AirExcessCoefficient({
      name: 'alphaEconomizer',
      value:
        alphaConvectivePackage2AirExcessCoefficient.value +
        params.airLeakage.actualEconomizerAirLeakage,
    });
    const alphaFlueGasAirExcessCoefficient = new AirExcessCoefficient({
      name: 'alphaFlueGas',
      value: alphaEconomizerAirExcessCoefficient.value,
    });

    airExcessCoefficients.push(
      alphaAirExcessCoefficient,
      alphaBurnerAirExcessCoefficient,
      alphaFurnaceAirExcessCoefficient,
      alphaFurnaceAvgAirExcessCoefficient,
      alphaConvectivePackage1AirExcessCoefficient,
      alphaConvectivePackage1AvgAirExcessCoefficient,
      alphaConvectivePackage2AirExcessCoefficient,
      alphaConvectivePackage2AvgAirExcessCoefficient,
      alphaEconomizerAirExcessCoefficient,
      alphaFlueGasAirExcessCoefficient,
    );
    return airExcessCoefficients;
  }
}
