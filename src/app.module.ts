import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeatBalanceSolverModule } from './heat-balance-solver/heat-balance-solver.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { APP_PIPE } from '@nestjs/core';
import { EconomizerCharacteristicsModule } from './phisics/economizer-characteristics/economizer-characteristics.module';
import { BoilerCharacteristicsModule } from './phisics/boiler-characteristics/boiler-characteristics.module';
import { EngineModule } from './engine/engine.module';
import { AlertsModule } from './alerts/alerts.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { WarningsModule } from './warnings/warnings.module';
import { ObservationsModule } from './observations/observations.module';
import { RuntimeModule } from './runtime/runtime.module';
import { StateModule } from './state/state.module';
import { SimulationModule } from './simulation/simulation.module';
import { TypeOrmModule } from './type-orm/type-orm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    HeatBalanceSolverModule,
    EconomizerCharacteristicsModule,
    BoilerCharacteristicsModule,
    EngineModule,
    AlertsModule,
    RecommendationsModule,
    WarningsModule,
    ObservationsModule,
    RuntimeModule,
    StateModule,
    SimulationModule,
    TypeOrmModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
        }),
    },
  ],
})
export class AppModule {}
