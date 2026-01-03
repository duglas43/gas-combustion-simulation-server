import { Injectable } from '@nestjs/common';
import { RecommendationDto } from './dtos/recommendation.dto';
import { Recommendation } from './entities';

@Injectable()
export class RecommendationsService {
  private recommendations: Recommendation[] = [];

  setRecommendations(recs: RecommendationDto[]): void {
    this.recommendations = recs.map((r) => new Recommendation(r));
  }

  addRecommendation(rec: RecommendationDto): void {
    this.recommendations.push(new Recommendation(rec));
  }

  clearRecommendations(): void {
    this.recommendations = [];
  }

  getRecommendations(): RecommendationDto[] {
    return this.recommendations.map(
      (recommendation) => new RecommendationDto(recommendation),
    );
  }
}
