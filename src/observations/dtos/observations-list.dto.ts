import { ApiProperty } from '@nestjs/swagger';
import { ObservationDto } from './observation.dto';

export class ObservationsListDto {
  @ApiProperty({ type: [ObservationDto] })
  historical: ObservationDto[];
  @ApiProperty({ type: ObservationDto })
  current: ObservationDto;
  @ApiProperty({ type: [ObservationDto] })
  forecast: ObservationDto[];

  constructor(partial: Partial<ObservationsListDto>) {
    this.historical = partial.historical;
    this.current = partial.current;
    this.forecast = partial.forecast;
  }
}
