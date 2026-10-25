import type { Survey } from '../types';
import { electronicsSurveys } from './electronics';
import { foodSurveys } from './food';
import { beautySurveys } from './beauty';
import { homeSurveys } from './home';
import { telecomSurveys } from './telecom';
import { retailSurveys } from './retail';

export const ALL_SURVEYS: Survey[] = [
  ...electronicsSurveys,
  ...foodSurveys,
  ...beautySurveys,
  ...homeSurveys,
  ...telecomSurveys,
  ...retailSurveys,
];

export const SURVEY_MAP: Record<string, Survey> = Object.fromEntries(
  ALL_SURVEYS.map((s) => [s.id, s]),
);

export const totalSurveys = ALL_SURVEYS.length;
