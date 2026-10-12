// ============================================================================
// RISE USA LMS — Assessment Scoring Logic
// Shared between server actions and demo-mode client grading
// ============================================================================

import type { AssessmentQuestion } from "@/data/assessment-types";

export interface SafeQuestion {
  id: string;
  type: AssessmentQuestion["type"];
  question: string;
  options?: string[];
  matches?: { left: string; right: string }[];
  points: number;
  difficulty: AssessmentQuestion["difficulty"];
  unit?: string;
  moduleId?: string;
  topic?: AssessmentQuestion["topic"];
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  explanation?: string;
  topic: AssessmentQuestion["topic"];
  moduleId?: string;
  points: number;
  earnedPoints: number;
}

export interface AssessmentResult {
  score: number;
  percentage: number;
  passed: boolean;
  totalPoints: number;
  earnedPoints: number;
  questionResults: QuestionResult[];
  reviewAreas: string[];
}

/** Strip answer data from a question so it can be safely sent to the client. */
export function stripQuestion(q: AssessmentQuestion): SafeQuestion {
  return {
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    matches: q.matches?.map((m) => ({ left: m.left, right: m.right })),
    points: q.points,
    difficulty: q.difficulty,
    unit: q.unit,
    moduleId: q.moduleId,
    topic: q.topic,
  };
}

/** Grade a single question. */
export function gradeQuestion(
  q: AssessmentQuestion,
  userAnswer: string | string[] | undefined,
): { correct: boolean; earnedPoints: number } {
  if (userAnswer === undefined || userAnswer === "") return { correct: false, earnedPoints: 0 };

  switch (q.type) {
    case "multiple_choice":
    case "true_false":
    case "scenario":
      return {
        correct: userAnswer === q.correctAnswer,
        earnedPoints: userAnswer === q.correctAnswer ? q.points : 0,
      };

    case "multiple_select": {
      const userSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
      const correctSet = new Set(Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]);
      const correct = userSet.size === correctSet.size && [...userSet].every((v) => correctSet.has(v));
      return { correct, earnedPoints: correct ? q.points : 0 };
    }

    case "matching": {
      const userMatches = Array.isArray(userAnswer) ? userAnswer : [];
      const correct = q.matches?.every((m, i) => userMatches[i] === m.right) ?? false;
      return { correct, earnedPoints: correct ? q.points : 0 };
    }

    case "fill_in_blank": {
      const userStr = String(userAnswer).toLowerCase().trim();
      const correctStr = String(q.correctAnswer).toLowerCase().trim();
      if (userStr === correctStr) return { correct: true, earnedPoints: q.points };
      if (q.acceptableKeywords?.some((kw) => userStr.includes(kw.toLowerCase()))) {
        return { correct: true, earnedPoints: q.points };
      }
      return { correct: false, earnedPoints: 0 };
    }

    case "short_answer": {
      const userStr = String(userAnswer).toLowerCase().trim();
      if (userStr.length < 10) return { correct: false, earnedPoints: 0 };
      if (q.acceptableKeywords && q.acceptableKeywords.length > 0) {
        const matches = q.acceptableKeywords.some((kw) => userStr.includes(kw.toLowerCase()));
        return { correct: matches, earnedPoints: matches ? q.points : Math.round(q.points * 0.5) };
      }
      return { correct: true, earnedPoints: q.points };
    }

    case "calculation": {
      const userNum = parseFloat(String(userAnswer).replace(/[^0-9.-]/g, ""));
      if (isNaN(userNum)) return { correct: false, earnedPoints: 0 };
      const target = q.numericAnswer ?? parseFloat(String(q.correctAnswer));
      const low = q.acceptableRangeLow ?? target;
      const high = q.acceptableRangeHigh ?? target;
      const correct = userNum >= low && userNum <= high;
      return { correct, earnedPoints: correct ? q.points : 0 };
    }

    default:
      return { correct: false, earnedPoints: 0 };
  }
}

/** Grade a full assessment and produce results. */
export function gradeAssessment(
  questions: AssessmentQuestion[],
  answers: Record<string, string | string[]>,
  passingScore: number,
): AssessmentResult {
  let totalPoints = 0;
  let earnedPoints = 0;
  const questionResults: QuestionResult[] = [];
  const wrongTopics = new Set<string>();

  for (const q of questions) {
    totalPoints += q.points;
    const userAnswer = answers[q.id];
    const { correct, earnedPoints: earned } = gradeQuestion(q, userAnswer);
    earnedPoints += earned;

    if (!correct) {
      wrongTopics.add(q.topic);
    }

    questionResults.push({
      questionId: q.id,
      correct,
      userAnswer: userAnswer ?? "",
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic,
      moduleId: q.moduleId,
      points: q.points,
      earnedPoints: earned,
    });
  }

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return {
    score: earnedPoints,
    percentage,
    passed: percentage >= passingScore,
    totalPoints,
    earnedPoints,
    questionResults,
    reviewAreas: [...wrongTopics],
  };
}
