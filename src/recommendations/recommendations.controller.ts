import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { RecommendationDto } from './dtos/recommendation.dto';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get()
  @ApiExtraModels(RecommendationDto)
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(RecommendationDto) },
    },
  })
  getRecommendations(): RecommendationDto[] {
    return this.recommendationsService.getRecommendations();
  }
}
