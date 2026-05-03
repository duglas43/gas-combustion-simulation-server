import { BadRequestException, Injectable } from '@nestjs/common';
import { Laws } from './entities';
import { CreateLawsDto, UpdateLawsDto } from './dtos';
import { LawsRepository } from './repositories';

const STATE_LAW_ROOTS = new Set([
  'fuelComposition',
  'boilerCharacteristics',
  'airLeakage',
  'furnaceCharacteristics',
  'convectivePackagesParameters',
  'economizerCharacteristic',
  'resource',
]);

@Injectable()
export class LawsService {
  public constructor(private readonly lawsRepository: LawsRepository) {}

  public create(createLawsDto?: CreateLawsDto | Laws): void {
    const laws = this.unwrap(createLawsDto);
    this.assertStateLaws(laws);
    this.lawsRepository.create(laws);
  }

  public update(updateLawsDto?: UpdateLawsDto | Laws): void {
    const laws = this.unwrap(updateLawsDto);
    this.assertStateLaws(laws);
    this.lawsRepository.update(laws);
  }

  public reset(): void {
    this.lawsRepository.clear();
  }

  public getCurrent(): Laws {
    return this.lawsRepository.getCurrent();
  }

  private unwrap(dto?: CreateLawsDto | UpdateLawsDto | Laws): Laws {
    if (!dto) return {};
    if ('laws' in dto) return (dto.laws ?? {}) as Laws;
    return dto as Laws;
  }

  private assertStateLaws(laws: Laws): void {
    for (const path of Object.keys(laws)) {
      const root = path.split('.')[0];
      if (!STATE_LAW_ROOTS.has(root)) {
        throw new BadRequestException(
          `Law "${path}" is not allowed. Laws can change state only.`,
        );
      }
    }
  }
}
