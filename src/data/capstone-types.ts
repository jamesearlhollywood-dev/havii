// Capstone types and constants — kept separate from "use server" action file

import type { ConfidenceSurveyResponse } from "@/data/confidence-survey";

export interface ActionPlanItem {
  goal: string;
  whyItMatters: string;
  targetDate: string;
  firstStep: string;
  status: "Not Started" | "In Progress" | "Completed" | "Changed";
  category: string;
}

export interface CapstoneData {
  actionPlan: ActionPlanItem[];
  topPriorities: string[];
  moneyRules: string[];
  finalReflection: string;
  commitmentConfirmed: boolean;
  endOfCourseSurvey: ConfidenceSurveyResponse[] | null;
  surveyCompletedAt: string | null;
}

export const ACTION_PLAN_CATEGORIES = [
  "Income/job",
  "Banking",
  "Budget",
  "Emergency savings",
  "Credit",
  "Education",
  "Student loans",
  "Investing",
  "Transportation",
  "Housing",
  "Insurance",
  "Financial protection",
];

export const ACTION_PLAN_STATUSES = ["Not Started", "In Progress", "Completed", "Changed"] as const;

export const DEFAULT_MONEY_RULES = [
  "I will read financial agreements before signing.",
  "I will compare total cost, not just monthly payments.",
  "I will know the difference between gross and net pay.",
  "I will maintain an emergency-savings goal.",
  "I will understand debt before borrowing.",
];

export const SUGGESTED_MONEY_RULES = [
  "I will read financial agreements before signing.",
  "I will compare total cost, not just monthly payments.",
  "I will know the difference between gross and net pay.",
  "I will maintain an emergency-savings goal.",
  "I will understand debt before borrowing.",
  "I will verify investment opportunities before sending money.",
  "I will protect my passwords and authentication codes.",
];
