import { Injectable } from '@nestjs/common';
import { AlertsService } from 'src/alerts/alerts.service';
import { ALERT_CODES } from 'src/alerts/enums';
import { Alert } from 'src/alerts/entities';
import { Observation } from 'src/observations/entities';
import { Recommendation } from 'src/recommendations/entities';
import { RecommendationsService } from 'src/recommendations/recommendations.service';
import { State } from 'src/state/entities';
import { Warning } from 'src/warnings/entities';
import { WARNING_CODES } from 'src/warnings/enums';
import { WarningsService } from 'src/warnings/warnings.service';
import { InsightsDto } from './dtos';

type AirLeakageEntry = {
  title: string;
  value: number;
};

@Injectable()
export class InsightsService {
  constructor(
    private readonly warningsService: WarningsService,
    private readonly alertsService: AlertsService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  evaluate(params: { state: State; observation: Observation }): InsightsDto {
    const timestamp = new Date();
    const warnings: Warning[] = [];
    const alerts: Alert[] = [];
    const recommendations: Recommendation[] = [];
    const { state, observation } = params;

    const addWarning = (code: WARNING_CODES, message: string): void => {
      warnings.push(new Warning({ code, message, timestamp }));
    };
    const addAlert = (code: ALERT_CODES, message: string): void => {
      alerts.push(new Alert({ code, message, timestamp }));
    };
    const addRecommendation = (message: string, effect: string): void => {
      if (recommendations.some((rec) => rec.message === message)) return;
      recommendations.push(new Recommendation({ message, effect }));
    };

    if (this.isBelow(observation.efficiency, 80)) {
      addAlert(
        ALERT_CODES.CRITICAL_LOW_EFFICIENCY,
        `КПД критически низкий: ${this.format(observation.efficiency)}%.`,
      );
      addRecommendation(
        'Снизить неконтролируемые подсосы и проверить настройку коэффициента избытка воздуха.',
        '',
      );
    } else if (this.isBelow(observation.efficiency, 87)) {
      addWarning(
        WARNING_CODES.LOW_EFFICIENCY,
        `КПД ниже ожидаемого: ${this.format(observation.efficiency)}%.`,
      );
      addRecommendation(
        'Проверить загрязнение поверхностей нагрева и избыток воздуха.',
        '',
      );
    }

    if (this.isAbove(observation.furnaceExitTemperature, 1100)) {
      addAlert(
        ALERT_CODES.FURNACE_OVERHEAT,
        `Температура на выходе из топки критическая: ${this.format(
          observation.furnaceExitTemperature,
        )} C.`,
      );
      addRecommendation(
        'Снизить нагрузку или увеличить тепловосприятие топочных экранов.',
        '',
      );
    } else if (this.isAbove(observation.furnaceExitTemperature, 950)) {
      addWarning(
        WARNING_CODES.ELEVATED_FURNACE_TEMPERATURE,
        `Температура на выходе из топки повышена: ${this.format(
          observation.furnaceExitTemperature,
        )} C.`,
      );
      addRecommendation(
        'Проверить загрязнение экранов и корректность режима горения.',
        '',
      );
    }

    const firstPackageTemperature =
      observation.firstConvectivePackageExitTemperature;
    const secondPackageTemperature =
      observation.secondConvectivePackageExitTemperature;
    if (
      this.isAbove(firstPackageTemperature, 430) ||
      this.isAbove(secondPackageTemperature, 360)
    ) {
      addAlert(
        ALERT_CODES.CRITICAL_CONVECTIVE_TEMPERATURE,
        `Температура после конвективных пакетов критическая: ${this.format(
          Math.max(firstPackageTemperature, secondPackageTemperature),
        )} C.`,
      );
      addRecommendation(
        'Проверить конвективные поверхности и снизить тепловую нагрузку.',
        '',
      );
    } else if (
      this.isAbove(firstPackageTemperature, 360) ||
      this.isAbove(secondPackageTemperature, 300)
    ) {
      addWarning(
        WARNING_CODES.ELEVATED_CONVECTIVE_TEMPERATURE,
        `Температура после конвективных пакетов повышена: ${this.format(
          Math.max(firstPackageTemperature, secondPackageTemperature),
        )} C.`,
      );
      addRecommendation(
        'Проверить степень черноты и загрязнение конвективных пакетов.',
        '',
      );
    }

    if (this.isAbove(observation.economizerExitTemperature, 240)) {
      addAlert(
        ALERT_CODES.CRITICAL_ECONOMIZER_TEMPERATURE,
        `Температура после экономайзера критическая: ${this.format(
          observation.economizerExitTemperature,
        )} C.`,
      );
      addRecommendation(
        'Проверить работу экономайзера и расход питательной воды.',
        '',
      );
    } else if (this.isAbove(observation.economizerExitTemperature, 190)) {
      addWarning(
        WARNING_CODES.ELEVATED_ECONOMIZER_TEMPERATURE,
        `Температура после экономайзера повышена: ${this.format(
          observation.economizerExitTemperature,
        )} C.`,
      );
      addRecommendation(
        'Увеличить контроль за экономайзером и температурой питательной воды.',
        '',
      );
    }

    if (this.isAbove(observation.fuelConsumption, 900)) {
      addWarning(
        WARNING_CODES.HIGH_FUEL_CONSUMPTION,
        `Расход топлива повышен: ${this.format(observation.fuelConsumption)}.`,
      );
      addRecommendation(
        'Сопоставить расход топлива с нагрузкой и текущим КПД.',
        '',
      );
    }

    this.evaluateAirLeakage(state, addWarning, addAlert, addRecommendation);
    this.evaluateStateInputs(state, addWarning, addAlert, addRecommendation);
    this.evaluateImbalances(observation, addWarning, addAlert);

    this.warningsService.setWarnings(warnings);
    this.alertsService.setAlerts(alerts);
    this.recommendationsService.setRecommendations(recommendations);

    return this.getCurrent();
  }

  getCurrent(): InsightsDto {
    return new InsightsDto({
      warnings: this.warningsService.getWarnings(),
      alerts: this.alertsService.getAlerts(),
      recommendations: this.recommendationsService.getRecommendations(),
    });
  }

  clear(): void {
    this.warningsService.clearWarnings();
    this.alertsService.clearAlerts();
    this.recommendationsService.clearRecommendations();
  }

  private evaluateAirLeakage(
    state: State,
    addWarning: (code: WARNING_CODES, message: string) => void,
    addAlert: (code: ALERT_CODES, message: string) => void,
    addRecommendation: (message: string, effect: string) => void,
  ): void {
    const airLeakages: AirLeakageEntry[] = [
      {
        title: 'топка',
        value: state.airLeakage?.nominalFurnaceAirLeakage,
      },
      {
        title: 'первый конвективный пакет',
        value: state.airLeakage?.nominalFirstConvectiveAirLeakage,
      },
      {
        title: 'второй конвективный пакет',
        value: state.airLeakage?.nominalSecondConvectiveAirLeakage,
      },
      {
        title: 'экономайзер',
        value: state.airLeakage?.nominalEconomizerAirLeakage,
      },
    ];
    const criticalZones = airLeakages.filter((item) =>
      this.isAbove(item.value, 0.4),
    );
    const warningZones = airLeakages.filter((item) =>
      this.isAbove(item.value, 0.2),
    );

    if (criticalZones.length > 0) {
      addAlert(
        ALERT_CODES.CRITICAL_AIR_LEAKAGE,
        `Критический подсос воздуха: ${criticalZones
          .map((item) => `${item.title} ${this.format(item.value)}`)
          .join(', ')}.`,
      );
      addRecommendation(
        'Немедленно проверить уплотнения и газоходы в зонах критического подсоса.',
        '',
      );
    } else if (warningZones.length > 0) {
      addWarning(
        WARNING_CODES.HIGH_AIR_LEAKAGE,
        `Повышенный подсос воздуха: ${warningZones
          .map((item) => `${item.title} ${this.format(item.value)}`)
          .join(', ')}.`,
      );
      addRecommendation(
        'Запланировать проверку герметичности по зонам с повышенным подсосом.',
        '',
      );
    }
  }

  private evaluateStateInputs(
    state: State,
    addWarning: (code: WARNING_CODES, message: string) => void,
    addAlert: (code: ALERT_CODES, message: string) => void,
    addRecommendation: (message: string, effect: string) => void,
  ): void {
    const boiler = state.boilerCharacteristics;
    const furnace = state.furnaceCharacteristics;
    const packages = state.convectivePackagesParameters ?? [];
    const fuelRemaining = state.resource?.fuelRemaining;

    if (this.isBelow(fuelRemaining, 50)) {
      addAlert(
        ALERT_CODES.CRITICAL_FUEL_DEPLETION,
        `Остаток топлива критически низкий: ${this.format(fuelRemaining)}.`,
      );
      addRecommendation(
        'Снизить нагрузку или пополнить запас топлива до продолжения режима.',
        '',
      );
    } else if (this.isBelow(fuelRemaining, 200)) {
      addWarning(
        WARNING_CODES.LOW_FUEL_REMAINING,
        `Остаток топлива низкий: ${this.format(fuelRemaining)}.`,
      );
      addRecommendation(
        'Подготовить пополнение топлива или плановое снижение нагрузки.',
        '',
      );
    }

    if (this.isAbove(boiler?.loadPercentage, 115)) {
      addAlert(
        ALERT_CODES.CRITICAL_LOAD,
        `Нагрузка критически высокая: ${this.format(boiler.loadPercentage)}%.`,
      );
      addRecommendation(
        'Вернуть нагрузку в допустимый диапазон перед продолжением сценария.',
        '',
      );
    } else if (this.isAbove(boiler?.loadPercentage, 105)) {
      addWarning(
        WARNING_CODES.HIGH_LOAD,
        `Нагрузка выше номинальной: ${this.format(boiler.loadPercentage)}%.`,
      );
      addRecommendation(
        'Проверить, что повышенная нагрузка соответствует выбранному сценарию.',
        '',
      );
    }

    if (
      this.isBelow(boiler?.excessAirCoefficient, 1) ||
      this.isAbove(boiler?.excessAirCoefficient, 1.8)
    ) {
      addAlert(
        ALERT_CODES.CRITICAL_EXCESS_AIR,
        `Коэффициент избытка воздуха критически вне диапазона: ${this.format(
          boiler.excessAirCoefficient,
        )}.`,
      );
      addRecommendation(
        'Скорректировать коэффициент избытка воздуха к рабочему диапазону 1.05-1.5.',
        'Стабилизирует горение и снижает потери.',
      );
    } else if (
      this.isBelow(boiler?.excessAirCoefficient, 1.05) ||
      this.isAbove(boiler?.excessAirCoefficient, 1.5)
    ) {
      addWarning(
        WARNING_CODES.EXCESS_AIR_OUT_OF_RANGE,
        `Коэффициент избытка воздуха вне оптимального диапазона: ${this.format(
          boiler.excessAirCoefficient,
        )}.`,
      );
      addRecommendation(
        'Плавно скорректировать избыток воздуха и наблюдать КПД.',
        'Поможет найти баланс между полнотой сгорания и потерями с газами.',
      );
    }

    if (this.isBelow(boiler?.feedWaterTemperature, 70)) {
      addWarning(
        WARNING_CODES.LOW_FEED_WATER_TEMPERATURE,
        `Температура питательной воды низкая: ${this.format(
          boiler.feedWaterTemperature,
        )} C.`,
      );
      addRecommendation(
        'Плавно поднять температуру питательной воды перед ростом нагрузки.',
        'Снижает тепловой стресс и стабилизирует экономайзер.',
      );
    }

    if (this.isAbove(furnace?.screenContaminationFactor, 0.92)) {
      addAlert(
        ALERT_CODES.CRITICAL_FOULING,
        `Загрязнение экранов критическое: ${this.format(
          furnace.screenContaminationFactor,
        )}.`,
      );
      addRecommendation(
        'Провести очистку экранных поверхностей перед продолжением тяжелого режима.',
        '',
      );
    } else if (this.isAbove(furnace?.screenContaminationFactor, 0.82)) {
      addWarning(
        WARNING_CODES.HIGH_SCREEN_CONTAMINATION,
        `Загрязнение экранов повышено: ${this.format(
          furnace.screenContaminationFactor,
        )}.`,
      );
      addRecommendation(
        'Запланировать очистку экранов или снизить длительность тяжелого режима.',
        '',
      );
    }

    const dirtyPackages = packages.filter((item) =>
      this.isAbove(item.wallBlacknessDegree, 0.92),
    );
    if (dirtyPackages.length > 0) {
      addWarning(
        WARNING_CODES.HIGH_WALL_BLACKNESS,
        `Степень черноты конвективных пакетов высокая: ${dirtyPackages
          .map(
            (item) =>
              `пакет ${item.packageNumber} ${this.format(
                item.wallBlacknessDegree,
              )}`,
          )
          .join(', ')}.`,
      );
      addRecommendation(
        'Проверить конвективные пакеты на загрязнение и ухудшение теплообмена.',
        '',
      );
    }
  }

  private evaluateImbalances(
    observation: Observation,
    addWarning: (code: WARNING_CODES, message: string) => void,
    addAlert: (code: ALERT_CODES, message: string) => void,
  ): void {
    const imbalances = [
      observation.furnaceImbalance,
      observation.firstConvectivePackageImbalance,
      observation.secondConvectivePackageImbalance,
      observation.economizerImbalance,
    ].map((value) => Math.abs(value ?? 0));
    const maxImbalance = Math.max(...imbalances);

    if (maxImbalance > 10) {
      addAlert(
        ALERT_CODES.SOLVER_IMBALANCE,
        `Критический дисбаланс теплового расчета: ${this.format(
          maxImbalance,
        )}.`,
      );
    } else if (maxImbalance > 2) {
      addWarning(
        WARNING_CODES.HEAT_BALANCE_IMBALANCE,
        `Повышенный дисбаланс теплового расчета: ${this.format(maxImbalance)}.`,
      );
    }
  }

  private isAbove(value: number, threshold: number): boolean {
    return Number.isFinite(value) && value > threshold;
  }

  private isBelow(value: number, threshold: number): boolean {
    return Number.isFinite(value) && value < threshold;
  }

  private format(value: number): string {
    if (!Number.isFinite(value)) return 'n/a';
    return Number(value.toFixed(2)).toString();
  }
}
