// Non-action constants/types for goals, kept outside the "use server" module
// so the server-action file only exports async functions.

export const GOAL_CATEGORIES = [
  { value: "well-being", label: "Well-Being" },
  { value: "school", label: "School" },
  { value: "career", label: "Career" },
  { value: "relationships", label: "Relationships" },
  { value: "personal-growth", label: "Personal Growth" },
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number]["value"];
export type GoalStatus = "active" | "completed" | "archived";

export type GoalState = {
  error?: string;
  success?: string;
  title?: string;
  description?: string;
  category?: string;
  targetDate?: string;
};

export type StepState = {
  error?: string;
  success?: string;
  title?: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  target_date: string | null;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
};

export type GoalStep = {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GoalWithSteps = Goal & {
  steps: GoalStep[];
  stepTotal: number;
  stepCompleted: number;
};
