import { State } from '../entities';
export class StateRepository {
  private state: State | null = null;

  public create(state: State) {
    this.state = state;
  }

  public update(updateSimulationStateDto: Partial<State>) {
    if (!this.state) {
      throw new Error('State not found');
    }
    if (updateSimulationStateDto.economizerCharacteristic) {
      this.state.economizerCharacteristic =
        updateSimulationStateDto.economizerCharacteristic;
    }
    if (updateSimulationStateDto.boilerCharacteristics) {
      this.state.boilerCharacteristics =
        updateSimulationStateDto.boilerCharacteristics;
    }
    if (updateSimulationStateDto.airLeakage) {
      this.state.airLeakage = updateSimulationStateDto.airLeakage;
    }
    if (updateSimulationStateDto.fuelComposition) {
      this.state.fuelComposition = updateSimulationStateDto.fuelComposition;
    }
    if (updateSimulationStateDto.furnaceCharacteristics) {
      this.state.furnaceCharacteristics =
        updateSimulationStateDto.furnaceCharacteristics;
    }
    if (updateSimulationStateDto.convectivePackagesParameters) {
      this.state.convectivePackagesParameters =
        updateSimulationStateDto.convectivePackagesParameters;
    }
    if (updateSimulationStateDto.resource) {
      this.state.resource = updateSimulationStateDto.resource;
    }
  }

  public getCurrent() {
    return this.state;
  }

  public clear() {
    this.state = null;
  }
}
