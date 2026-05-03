import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dtos';
import { Resource } from './entities';

@Injectable()
export class ResourcesService {
  public calculate(createResourceDto: CreateResourceDto): Resource {
    const resource = new Resource(createResourceDto);
    return resource;
  }
}
