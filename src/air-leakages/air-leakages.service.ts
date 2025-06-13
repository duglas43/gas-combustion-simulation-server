import { Injectable } from '@nestjs/common';
import { AirLeakageRepository } from './repositories';
import { CalculateAirLeakageParams } from './interfaces';

@Injectable()
export class AirLeakagesService {
  constructor(private readonly airLeakageRepository: AirLeakageRepository) {}

  public async calculate(params: CalculateAirLeakageParams) {
    const { nominalSteamProduction, actualSteamProduction } =
      params.boilerCharacreristics;
    const airLeakage = this.airLeakageRepository.create({
      nominalFurnaceAirLeakage: 0.05,
      actualFurnaceAirLeakage:
        0.05 * (nominalSteamProduction / actualSteamProduction),
      nominalFirstConvectiveAirLeakage: 0.05,
      actualFirstConvectiveAirLeakage:
        0.05 * (nominalSteamProduction / actualSteamProduction) ** 0.5,
      nominalSecondConvectiveAirLeakage: 0.1,
      actualSecondConvectiveAirLeakage:
        0.1 * (nominalSteamProduction / actualSteamProduction) ** 0.5,
      nominalEconomizerAirLeakage: 0.1,
      actualEconomizerAirLeakage:
        0.1 * (nominalSteamProduction / actualSteamProduction) ** 0.5,
    });
    return airLeakage;
  }
}
