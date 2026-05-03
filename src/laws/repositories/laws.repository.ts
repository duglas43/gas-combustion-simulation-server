import { Laws } from '../entities';

export class LawsRepository {
  private laws: Laws = {};

  public create(laws?: Laws): void {
    this.laws = { ...(laws ?? {}) };
  }

  public update(laws?: Laws): void {
    if (!laws) return;
    this.laws = {
      ...this.laws,
      ...laws,
    };
  }

  public clear(): void {
    this.laws = {};
  }

  public getCurrent(): Laws {
    return this.laws;
  }
}
