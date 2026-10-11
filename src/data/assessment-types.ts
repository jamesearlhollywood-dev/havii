// ============================================================================
// RISE USA LMS — Assessment Engine Type Definitions
// ============================================================================

export type QuestionType =
  | "multiple_choice"
  | "multiple_select"
  | "true_false"
  | "matching"
  | "fill_in_blank"
  | "short_answer"
  | "scenario"
  | "calculation";

export type Difficulty = "foundational" | "applied" | "advanced";

export type TopicTag =
  | "income"
  | "paychecks"
  | "banking"
  | "budgeting"
  | "saving"
  | "credit"
  | "borrowing"
  | "student_loans"
  | "investing"
  | "cars"
  | "housing"
  | "insurance"
  | "fraud_protection";

export const TOPIC_LABELS: Record<TopicTag, string> = {
  income: "Income",
  paychecks: "Paychecks",
  banking: "Banking",
  budgeting: "Budgeting",
  saving: "Saving",
  credit: "Credit",
  borrowing: "Borrowing",
  student_loans: "Student Loans",
  investing: "Investing",
  cars: "Cars",
  housing: "Housing",
  insurance: "Insurance",
  fraud_protection: "Fraud & Identity Protection",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  foundational: "Foundational",
  applied: "Applied",
  advanced: "Advanced",
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice",
  multiple_select: "Multiple Select",
  true_false: "True / False",
  matching: "Matching",
  fill_in_blank: "Fill in the Blank",
  short_answer: "Short Answer",
  scenario: "Scenario Decision",
  calculation: "Calculation",
};

export interface MatchPair {
  left: string;
  right: string;
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  matches?: MatchPair[];
  explanation?: string;
  points: number;
  difficulty: Difficulty;
  topic: TopicTag;
  moduleId?: string;
  lessonId?: string;
  assessmentId?: string;
  published: boolean;
  // Calculation-specific
  numericAnswer?: number;
  acceptableRangeLow?: number;
  acceptableRangeHigh?: number;
  unit?: string;
  // Short answer keyword matching
  acceptableKeywords?: string[];
}

export type FeedbackMode = "immediate" | "after_submit";

export type AssessmentType = "knowledge_check" | "final_assessment" | "practice";

export interface AssessmentConfig {
  id: string;
  title: string;
  type: AssessmentType;
  moduleId?: string;
  description: string;
  questionIds: string[];
  passingScore: number;
  maxRetakes: number | null; // null = unlimited
  feedbackMode: FeedbackMode;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  published: boolean;
}

export interface AssessmentAttempt {
  id: string;
  profile_id: string;
  assessment_id: string;
  assessment_type: AssessmentType;
  module_id: string | null;
  attempt_number: number;
  started_at: string;
  submitted_at: string | null;
  score: number;
  percentage: number;
  passed: boolean;
  responses: Record<string, string | string[]>;
  question_results?: Record<string, boolean>;
}

export interface AssessmentSummary {
  assessment_id: string;
  title: string;
  type: AssessmentType;
  module_id: string | null;
  attempts: number;
  highest_score: number | null;
  highest_percentage: number | null;
  passed: boolean;
  last_attempt_date: string | null;
}
