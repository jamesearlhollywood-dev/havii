"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { getSession, getProfile } from "@/lib/session";
import {
  GOAL_CATEGORIES,
  type GoalCategory,
  type GoalStatus,
  type GoalState,
  type StepState,
  type Goal,
  type GoalStep,
  type GoalWithSteps,
} from "@/lib/goalConstants";

/** Verify the user has full access (eligible + consented). */
async function requireFullAccess() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated." as const, session: null, profile: null };

  const profile = await getProfile();
  if (!profile) return { error: "Profile not found." as const, session, profile: null };

  if (profile.eligibility_status !== "eligible") {
    return { error: "You are not eligible to use this feature." as const, session, profile };
  }
  if (
    profile.consent_status !== "self_consented" &&
    profile.consent_status !== "caregiver_consented"
  ) {
    return { error: "Caregiver consent is required before you can use goals." as const, session, profile };
  }
  return { error: null, session, profile };
}

function isValidCategory(value: string): value is GoalCategory {
  return (GOAL_CATEGORIES as readonly { value: string }[]).some((c) => c.value === value);
}

function isValidStatus(value: string): value is GoalStatus {
  return value === "active" || value === "completed" || value === "archived";
}

/** Validate a YYYY-MM-DD date string; returns normalized value or null. */
function normalizeTargetDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return "__invalid__";
  }
  return trimmed;
}

/** Get all goals for the current user matching a status, with step counts. */
export async function getGoals(status: GoalStatus): Promise<GoalWithSteps[]> {
  const session = await getSession();
  if (!session) return [];

  const { rows: goals } = await query<Goal>(
    `SELECT id, user_id, title, description, category, target_date::text,
            status, created_at, updated_at
     FROM goals
     WHERE user_id = $1 AND status = $2
     ORDER BY created_at DESC`,
    [session.userId, status]
  );

  if (goals.length === 0) return [];

  const ids = goals.map((g) => g.id);
  const { rows: steps } = await query<GoalStep>(
    `SELECT id, goal_id, title, completed, sort_order, created_at, updated_at
     FROM goal_steps
     WHERE goal_id = ANY($1::uuid[])
     ORDER BY goal_id, sort_order, created_at`,
    [ids]
  );

  return goals.map((g) => {
    const goalSteps = steps.filter((s) => s.goal_id === g.id);
    return {
      ...g,
      steps: goalSteps,
      stepTotal: goalSteps.length,
      stepCompleted: goalSteps.filter((s) => s.completed).length,
    };
  });
}

/** Get a single goal with its steps, verifying ownership. */
export async function getGoalWithSteps(goalId: string): Promise<GoalWithSteps | null> {
  const session = await getSession();
  if (!session) return null;

  const { rows: goals } = await query<Goal>(
    `SELECT id, user_id, title, description, category, target_date::text,
            status, created_at, updated_at
     FROM goals
     WHERE id = $1 AND user_id = $2`,
    [goalId, session.userId]
  );
  if (goals.length === 0) return null;

  const goal = goals[0];
  const { rows: steps } = await query<GoalStep>(
    `SELECT id, goal_id, title, completed, sort_order, created_at, updated_at
     FROM goal_steps
     WHERE goal_id = $1
     ORDER BY sort_order, created_at`,
    [goal.id]
  );

  return {
    ...goal,
    steps,
    stepTotal: steps.length,
    stepCompleted: steps.filter((s) => s.completed).length,
  };
}

/** Get the user's next active goal (oldest active) for the Home card. */
export async function getHomeGoal(): Promise<GoalWithSteps | null> {
  const goals = await getGoals("active");
  if (goals.length === 0) return null;
  return goals[goals.length - 1];
}

/** Create a new goal. Derives the owner from the session. */
export async function createGoalAction(
  _prev: GoalState,
  formData: FormData
): Promise<GoalState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) return { error: access.error };

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const targetDateRaw = String(formData.get("targetDate") || "").trim();

  const base = { title, description, category, targetDate: targetDateRaw };

  if (!title) return { error: "Please give your goal a title.", ...base };
  if (!isValidCategory(category)) return { error: "Please choose a category.", ...base };

  const targetDate = normalizeTargetDate(targetDateRaw);
  if (targetDate === "__invalid__") {
    return { error: "Please enter a valid target date, or leave it blank.", ...base };
  }

  let newId: string | null = null;
  try {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO goals (user_id, title, description, category, target_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [access.session.userId, title, description || null, category, targetDate]
    );
    newId = rows[0].id;
  } catch (err) {
    console.error("createGoal error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Your details have been preserved — please try again.", ...base };
  }

  if (newId) redirect(`/app/goals/${newId}`);
  return { error: "Something went wrong. Please try again.", ...base };
}

/** Update an existing goal's details. Verifies ownership. */
export async function updateGoalAction(
  _prev: GoalState,
  formData: FormData
): Promise<GoalState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) return { error: access.error };

  const goalId = String(formData.get("goalId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const targetDateRaw = String(formData.get("targetDate") || "").trim();

  const base = { title, description, category, targetDate: targetDateRaw };

  if (!goalId) return { error: "Goal not found.", ...base };
  if (!title) return { error: "Please give your goal a title.", ...base };
  if (!isValidCategory(category)) return { error: "Please choose a category.", ...base };

  const targetDate = normalizeTargetDate(targetDateRaw);
  if (targetDate === "__invalid__") {
    return { error: "Please enter a valid target date, or leave it blank.", ...base };
  }

  try {
    const result = await query(
      `UPDATE goals SET title = $1, description = $2, category = $3, target_date = $4
       WHERE id = $5 AND user_id = $6 RETURNING id`,
      [title, description || null, category, targetDate, goalId, access.session.userId]
    );
    if (result.rowCount === 0) return { error: "Goal not found.", ...base };
  } catch (err) {
    console.error("updateGoal error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Your details have been preserved — please try again.", ...base };
  }

  revalidatePath(`/app/goals/${goalId}`);
  revalidatePath("/app/goals");
  return { success: "Your goal has been updated.", ...base };
}

/** Change a goal's status (complete / reopen / archive / restore). */
export async function setGoalStatusAction(
  _prev: GoalState,
  formData: FormData
): Promise<GoalState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) return { error: access.error };

  const goalId = String(formData.get("goalId") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!goalId) return { error: "Goal not found." };
  if (!isValidStatus(status)) return { error: "Invalid status." };

  try {
    const result = await query<{ status: string }>(
      `UPDATE goals SET status = $1
       WHERE id = $2 AND user_id = $3 RETURNING status`,
      [status, goalId, access.session.userId]
    );
    if (result.rowCount === 0) return { error: "Goal not found." };
  } catch (err) {
    console.error("setGoalStatus error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/app/goals/${goalId}`);
  revalidatePath("/app/goals");
  revalidatePath("/app");

  const messages: Record<string, string> = {
    completed: "Goal marked complete. Nice work!",
    active: "Goal reopened.",
    archived: "Goal archived.",
  };
  return { success: messages[status] ?? "Goal updated." };
}

/** Add an action step to a goal. Validates ownership of the parent goal. */
export async function addStepAction(
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) return { error: access.error };

  const goalId = String(formData.get("goalId") || "").trim();
  const title = String(formData.get("title") || "").trim();

  if (!goalId) return { error: "Goal not found.", title };
  if (!title) return { error: "Please write a step before adding it.", title };

  try {
    // Verify the goal belongs to the current user before inserting a step.
    const { rows: owned } = await query<{ id: string }>(
      "SELECT id FROM goals WHERE id = $1 AND user_id = $2",
      [goalId, access.session.userId]
    );
    if (owned.length === 0) return { error: "Goal not found.", title };

    await query(
      `INSERT INTO goal_steps (goal_id, user_id, title, sort_order)
       VALUES ($1, $2, $3, COALESCE((SELECT MAX(sort_order) FROM goal_steps WHERE goal_id = $1), 0) + 1)`,
      [goalId, access.session.userId, title]
    );
  } catch (err) {
    console.error("addStep error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Your step has been preserved — please try again.", title };
  }

  revalidatePath(`/app/goals/${goalId}`);
  revalidatePath("/app/goals");
  revalidatePath("/app");
  return { success: "Step added." };
}

/** Toggle a step's completed state. Validates ownership of the step. */
export async function toggleStepAction(
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) return { error: access.error };

  const stepId = String(formData.get("stepId") || "").trim();
  const goalId = String(formData.get("goalId") || "").trim();

  if (!stepId || !goalId) return { error: "Step not found." };

  try {
    // Ownership enforced via user_id AND goal ownership cross-check.
    const result = await query<{ completed: boolean }>(
      `UPDATE goal_steps gs SET completed = NOT completed
       WHERE id = $1 AND user_id = $2
         AND goal_id IN (SELECT id FROM goals WHERE id = $3 AND user_id = $2)
       RETURNING completed`,
      [stepId, access.session.userId, goalId]
    );
    if (result.rowCount === 0) return { error: "Step not found." };
  } catch (err) {
    console.error("toggleStep error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/app/goals/${goalId}`);
  revalidatePath("/app/goals");
  revalidatePath("/app");
  return { success: "Step updated." };
}

/** Delete an action step. Validates ownership. */
export async function deleteStepAction(
  _prev: StepState,
  formData: FormData
): Promise<StepState> {
  const access = await requireFullAccess();
  if (access.error || !access.session) return { error: access.error };

  const stepId = String(formData.get("stepId") || "").trim();
  const goalId = String(formData.get("goalId") || "").trim();

  if (!stepId || !goalId) return { error: "Step not found." };

  try {
    const result = await query(
      `DELETE FROM goal_steps
       WHERE id = $1 AND user_id = $2
         AND goal_id IN (SELECT id FROM goals WHERE id = $3 AND user_id = $2)`,
      [stepId, access.session.userId, goalId]
    );
    if (result.rowCount === 0) return { error: "Step not found." };
  } catch (err) {
    console.error("deleteStep error:", err instanceof Error ? err.message : "unknown");
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/app/goals/${goalId}`);
  revalidatePath("/app/goals");
  revalidatePath("/app");
  return { success: "Step removed." };
}
