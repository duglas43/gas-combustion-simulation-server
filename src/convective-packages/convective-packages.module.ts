import { Module } from '@nestjs/common';
import { ConvectivePackagesService } from './convective-packages.service';

@Module({
  providers: [ConvectivePackagesService],
  exports: [ConvectivePackagesService],
})
export class ConvectivePackagesModule {}
