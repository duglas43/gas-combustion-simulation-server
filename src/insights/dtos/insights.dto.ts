import { ApiProperty } from '@nestjs/swagger';
import { AlertDTO } from 'src/alerts/dtos';
import { RecommendationDto } from 'src/recommendations/dtos';
import { WarningDTO } from 'src/warnings/dtos';

export class InsightsDto {
  @ApiProperty({ type: [WarningDTO] })
  warnings: WarningDTO[];

  @ApiProperty({ type: [AlertDTO] })
  alerts: AlertDTO[];

  @ApiProperty({ type: [RecommendationDto] })
  recommendations: RecommendationDto[];

  constructor(model: InsightsDto) {
    this.warnings = model.warnings;
    this.alerts = model.alerts;
    this.recommendations = model.recommendations;
  }
}
