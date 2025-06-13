import { BoilerCharacteristic } from 'src/boiler-characteristics/entities';
import { CreateFuelCompositionDto } from '../dtos';

export interface CalculateFuelCompositionParams {
  createFuelCompositionDto: CreateFuelCompositionDto;
  boilerCharacreristics: Pick<BoilerCharacteristic, 'gasInletTemperature'>;
}
