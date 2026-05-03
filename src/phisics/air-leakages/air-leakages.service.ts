import { Injectable } from '@nestjs/common';
import { CalculateAirLeakageParams } from './interfaces';
import { AirLeakage } from './entities';

@Injectable()
export class AirLeakagesService {
  public calculate(params: CalculateAirLeakageParams) {
    const { nominalSteamProduction, actualSteamProduction } =
      params.boilerCharacreristics;
    const {
      nominalFurnaceAirLeakage,
      nominalFirstConvectiveAirLeakage,
      nominalSecondConvectiveAirLeakage,
      nominalEconomizerAirLeakage,
    } = params.airLeakage;
    const airLeakage = new AirLeakage({
      nominalFurnaceAirLeakage,
      actualFurnaceAirLeakage:
        nominalFurnaceAirLeakage *
        (nominalSteamProduction / actualSteamProduction),
      nominalFirstConvectiveAirLeakage,
      actualFirstConvectiveAirLeakage:
        nominalFirstConvectiveAirLeakage *
        (nominalSteamProduction / actualSteamProduction) ** 0.5,
      nominalSecondConvectiveAirLeakage,
      actualSecondConvectiveAirLeakage:
        nominalSecondConvectiveAirLeakage *
        (nominalSteamProduction / actualSteamProduction) ** 0.5,
      nominalEconomizerAirLeakage,
      actualEconomizerAirLeakage:
        nominalEconomizerAirLeakage *
        (nominalSteamProduction / actualSteamProduction) ** 0.5,
    });
    return airLeakage;
  }
}
