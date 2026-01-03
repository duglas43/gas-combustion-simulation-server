import { Injectable } from '@nestjs/common';
import { ObservationRepository } from './repositories';
import { Observation } from './entities';
import { FindObservationsDto } from './dtos/find-observations.dto';
import { ObservationsListDto } from './dtos/observations-list.dto';
import { ObservationDto } from './dtos/observation.dto';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ObservationsService {
  private forecastObservations: Observation[] = [];
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

  public saveForecastObservations(observations: Observation[]): void {
    this.forecastObservations = observations;
  }

  public async find(params: FindObservationsDto): Promise<ObservationsListDto> {
    const { from, to } = params;

    const observations = await this.observationRepository.find({
      where: {
        timestamp: And(MoreThanOrEqual(from), LessThanOrEqual(to)),
      },
      order: { timestamp: 'ASC' },
    });

    const dtos = observations.map((o) => new ObservationDto(o));
    const forecastDtos = this.forecastObservations.map(
      (o) => new ObservationDto(o),
    );
    const result = new ObservationsListDto({
      historical: dtos,
      current: dtos[dtos.length - 1] ?? null,
      forecast: forecastDtos,
    });
    return result;
  }

  public async clearAll(): Promise<void> {
    await this.observationRepository.clear();
    this.forecastObservations = [];
  }
}
