import { Injectable } from '@nestjs/common';
import { Laws } from './entities';
import { CreateLawsDto, UpdateLawsDto } from './dtos';
import { LawsRepository } from './repositories';

@Injectable()
export class LawsService {
  public constructor(private readonly lawsRepository: LawsRepository) {}

  public create(createLawsDto?: CreateLawsDto | Laws): void {
    this.lawsRepository.create(this.unwrap(createLawsDto));
  }

  public update(updateLawsDto?: UpdateLawsDto | Laws): void {
    this.lawsRepository.update(this.unwrap(updateLawsDto));
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
}
