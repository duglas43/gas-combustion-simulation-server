import { Module } from '@nestjs/common';
import { AlertsModule } from 'src/alerts/alerts.module';
import { RecommendationsModule } from 'src/recommendations/recommendations.module';
import { WarningsModule } from 'src/warnings/warnings.module';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [AlertsModule, RecommendationsModule, WarningsModule],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}
