// ============================================================================
// RISE USA LMS — Confidence Survey Statements
// Shared between the Starting Point Survey (onboarding) and the
// End-of-Course Confidence Survey so analytics can compute pre/post deltas.
// ============================================================================

export const CONFIDENCE_SURVEY_QUESTIONS: string[] = [
  "I know how to read a paycheck.",
  "I understand the difference between gross and net pay.",
  "I understand how checking and savings accounts work.",
  "I know how to create a monthly budget.",
  "I understand how credit scores work.",
  "I understand the cost of borrowing money.",
  "I know how student loans work.",
  "I understand basic investing.",
  "I understand the true cost of owning a car.",
  "I know what to look for before signing a lease or financial agreement.",
];

export interface ConfidenceSurveyResponse {
  question: string;
  confidence: number;
}

export interface ConfidenceSurveyData {
  responses: ConfidenceSurveyResponse[];
  completed_at: string;
}
