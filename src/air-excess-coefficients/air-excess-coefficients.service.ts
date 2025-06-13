import { Injectable } from '@nestjs/common';
import { AirExcessCoefficientRepository } from './repositories';
import { CalculateAirExcessCoefficientParams } from './interfaces';
import { AirExcessCoefficient } from './entities';

@Injectable()
export class AirExcessCoefficientsService {
  constructor(
    private readonly airExcessCoefficientRepository: AirExcessCoefficientRepository,
  ) {}

  public async calculate(params: CalculateAirExcessCoefficientParams) {
    const airExcessCoefficients: AirExcessCoefficient[] = [];
    const alphaAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alpha',
        value: 1,
      });
    const alphaBurnerAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaBurner',
        value: params.boilerCharacteristic.excessAirCoefficient,
      });
    const alphaFurnaceAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaFurnace',
        value:
          alphaBurnerAirExcessCoefficient.value +
          params.airLeakage.actualFurnaceAirLeakage,
      });
    const alphaFurnaceAvgAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaFurnaceAvg',
        value:
          (alphaBurnerAirExcessCoefficient.value +
            alphaFurnaceAirExcessCoefficient.value) /
          2,
      });
    const alphaConvectivePackage1AirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage1',
        value:
          alphaFurnaceAirExcessCoefficient.value +
          params.airLeakage.actualFirstConvectiveAirLeakage,
      });
    const alphaConvectivePackage1AvgAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage1Avg',
        value:
          (alphaFurnaceAirExcessCoefficient.value +
            alphaConvectivePackage1AirExcessCoefficient.value) /
          2,
      });
    const alphaConvectivePackage2AirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage2',
        value:
          alphaFurnaceAirExcessCoefficient.value +
          params.airLeakage.actualSecondConvectiveAirLeakage,
      });
    const alphaConvectivePackage2AvgAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaConvectivePackage2Avg',
        value:
          (alphaFurnaceAirExcessCoefficient.value +
            alphaConvectivePackage2AirExcessCoefficient.value) /
          2,
      });
    const alphaEconomizerAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
        name: 'alphaEconomizer',
        value:
          alphaFurnaceAirExcessCoefficient.value +
          params.airLeakage.actualEconomizerAirLeakage,
      });
    const alphaFlueGasAirExcessCoefficient =
      this.airExcessCoefficientRepository.create({
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
