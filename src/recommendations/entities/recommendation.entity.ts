export class Recommendation {
  message: string;
  effect: string;

  constructor(model: Recommendation) {
    this.message = model.message;
    this.effect = model.effect;
  }
}
