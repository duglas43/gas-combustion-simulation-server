import { Injectable } from '@nestjs/common';
import { ObservationRepository } from './repositories';
import { Observation } from './entities';

@Injectable()
export class ObservationsService {
  constructor(private observationRepository: ObservationRepository) {}

  public async getLastObservation(): Promise<Observation> {
    const lastObservation = await this.observationRepository.findOne({
      order: { time: 'DESC' },
      where: {},
    });
    if (!lastObservation) {
      const mockObservation = this.observationRepository.create({
        time: new Date(),
        timestamp: 0,
        efficiency: 0,
        adiabaticCombustionTemperature: 1850,
        furnaceExitTemperature: 840,
        firstConvectivePackageExitTemperature: 290,
        secondConvectivePackageExitTemperature: 215,
        economizerExitTemperature: 150,
        flueGasTemperature: 0,
        fuelConsumption: 0,
        lossesWithFlueGasPercentage: 0,
        lossesThroughWallsPercentage: 0,
        totalLosses: 0,
        furnaceImbalance: 0,
        firstConvectivePackageImbalance: 0,
        secondConvectivePackageImbalance: 0,
        economizerImbalance: 150,
      });
      return mockObservation;
    }
    return lastObservation;
  }

  public async saveObservation(observation: Observation): Promise<Observation> {
    return this.observationRepository.save(observation);
  }
}
