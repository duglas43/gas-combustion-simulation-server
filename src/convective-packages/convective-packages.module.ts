import { Module } from '@nestjs/common';
import { ConvectivePackagesService } from './convective-packages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvectivePackage } from './entities';
import { ConvectivePackageRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([ConvectivePackage])],
  providers: [ConvectivePackagesService, ConvectivePackageRepository],
  exports: [ConvectivePackagesService, ConvectivePackageRepository],
})
export class ConvectivePackagesModule {}
