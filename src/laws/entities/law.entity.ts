import { LAW_TYPES } from '../enums';

export interface LawParams {
  value?: number;
  target?: number;
  rate?: number;
  tau?: number;
  amplitude?: number;
  frequency?: number;
  startTime?: number;
}

export interface Law {
  type: LAW_TYPES;
  params: LawParams;
}

export type Laws = Record<string, Law>;
