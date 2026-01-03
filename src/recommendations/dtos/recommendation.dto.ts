import { ApiProperty } from '@nestjs/swagger';
import { Recommendation } from '../entities';
export class RecommendationDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  effect: string;

  constructor(model: RecommendationDto | Recommendation) {
    this.message = model.message;
    this.effect = model.effect;
  }
}
