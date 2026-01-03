import { BoilerCharacteristic } from 'src/phisics/boiler-characteristics/entities';
import { CreateFuelCompositionDto } from '../dtos';

export interface CalculateFuelCompositionParams {
  createFuelCompositionDto: CreateFuelCompositionDto;
  boilerCharacreristics: Pick<BoilerCharacteristic, 'gasInletTemperature'>;
}
