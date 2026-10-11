// ============================================================================
// RISE USA LMS — Question Bank & Assessment Data
// ============================================================================

import type { AssessmentQuestion, AssessmentConfig } from "./assessment-types";
import { modules } from "./course";
import type { QuizQuestion } from "./course-types";

// ---------------------------------------------------------------------------
// Convert existing module QuizQuestions to AssessmentQuestions
// ---------------------------------------------------------------------------
function quizToAssessment(
  q: QuizQuestion,
  moduleId: string,
  index: number,
  difficulty: AssessmentQuestion["difficulty"],
  topic: AssessmentQuestion["topic"],
): AssessmentQuestion {
  return {
    id: q.id,
    type: q.type as AssessmentQuestion["type"],
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    matches: q.matches,
    explanation: q.explanation,
    points: 1,
    difficulty,
    topic,
    moduleId,
    published: true,
  };
}

// Topic mapping per module
const MODULE_TOPICS: Record<string, AssessmentQuestion["topic"]> = {
  "module-1": "income",
  "module-2": "budgeting",
  "module-3": "credit",
  "module-4": "student_loans",
  "module-5": "investing",
  "module-6": "insurance",
};

// Convert all existing module knowledge checks
const moduleQuestions: AssessmentQuestion[] = [];
for (const mod of modules) {
  const topic = MODULE_TOPICS[mod.id] || "income";
  mod.knowledgeCheck.forEach((q, i) => {
    // Alternate difficulty levels
    const diff = i < 4 ? "foundational" : i < 8 ? "applied" : "advanced";
    moduleQuestions.push(quizToAssessment(q, mod.id, i, diff as AssessmentQuestion["difficulty"], topic));
  });
}

// ---------------------------------------------------------------------------
// New question types — fill in blank, short answer, calculation, scenario
// ---------------------------------------------------------------------------

const newQuestions: AssessmentQuestion[] = [
  // --- Module 1: Income & Banking ---
  {
    id: "m1-calc1",
    type: "calculation",
    question: "Jordan earns $18 per hour and works 25 hours this week. Before deductions, what is Jordan's gross pay?",
    numericAnswer: 450,
    acceptableRangeLow: 450,
    acceptableRangeHigh: 450,
    unit: "$",
    explanation: "Gross pay = hourly rate × hours worked = $18 × 25 = $450.",
    points: 2,
    difficulty: "foundational",
    topic: "income",
    moduleId: "module-1",
    published: true,
    correctAnswer: "450",
  },
  {
    id: "m1-calc2",
    type: "calculation",
    question: "Your gross pay this pay period is $2,000. Social Security tax is 6.2% and Medicare is 1.45%. What is the total FICA tax withheld?",
    numericAnswer: 153,
    acceptableRangeLow: 152,
    acceptableRangeHigh: 154,
    unit: "$",
    explanation: "Social Security: $2,000 × 0.062 = $124. Medicare: $2,000 × 0.0145 = $29. Total FICA = $124 + $29 = $153.",
    points: 2,
    difficulty: "applied",
    topic: "paychecks",
    moduleId: "module-1",
    published: true,
    correctAnswer: "153",
  },
  {
    id: "m1-fill1",
    type: "fill_in_blank",
    question: "The form your employer sends you each January summarizing your annual earnings and tax withholdings is called the ____.",
    correctAnswer: "W-2",
    acceptableKeywords: ["w-2", "w2"],
    explanation: "The W-2 form summarizes your total annual earnings and all tax withholdings. You use it to file your tax return.",
    points: 1,
    difficulty: "foundational",
    topic: "paychecks",
    moduleId: "module-1",
    published: true,
  },
  {
    id: "m1-sa1",
    type: "short_answer",
    question: "Explain one reason why you might choose a credit union over a traditional bank.",
    correctAnswer: "",
    acceptableKeywords: ["member", "not-for-profit", "lower fees", "better rates", "fewer fees", "owned by members"],
    explanation: "Credit unions are not-for-profit, member-owned, and often offer lower fees and better interest rates than traditional banks.",
    points: 2,
    difficulty: "applied",
    topic: "banking",
    moduleId: "module-1",
    published: true,
  },

  // --- Module 2: Budgeting & Saving ---
  {
    id: "m2-calc1",
    type: "calculation",
    question: "Your monthly net income is $2,400. You want to save 20% of it. How much should you save each month?",
    numericAnswer: 480,
    acceptableRangeLow: 480,
    acceptableRangeHigh: 480,
    unit: "$",
    explanation: "$2,400 × 0.20 = $480 per month.",
    points: 2,
    difficulty: "foundational",
    topic: "saving",
    moduleId: "module-2",
    published: true,
    correctAnswer: "480",
  },
  {
    id: "m2-calc2",
    type: "calculation",
    question: "Your monthly income is $3,000. Fixed expenses are $1,800 and variable expenses are $700. What is your monthly cash flow (income minus all expenses)?",
    numericAnswer: 500,
    acceptableRangeLow: 500,
    acceptableRangeHigh: 500,
    unit: "$",
    explanation: "Cash flow = $3,000 − $1,800 − $700 = $500.",
    points: 2,
    difficulty: "applied",
    topic: "budgeting",
    moduleId: "module-2",
    published: true,
    correctAnswer: "500",
  },
  {
    id: "m2-calc3",
    type: "calculation",
    question: "You want to save $1,200 for an emergency fund in 6 months. How much do you need to save per month?",
    numericAnswer: 200,
    acceptableRangeLow: 200,
    acceptableRangeHigh: 200,
    unit: "$",
    explanation: "$1,200 ÷ 6 months = $200 per month.",
    points: 2,
    difficulty: "foundational",
    topic: "saving",
    moduleId: "module-2",
    published: true,
    correctAnswer: "200",
  },
  {
    id: "m2-fill1",
    type: "fill_in_blank",
    question: "A budgeting approach where you allocate 50% to needs, 30% to wants, and 20% to savings is called the ____ rule.",
    correctAnswer: "50/30/20",
    acceptableKeywords: ["50/30/20", "50-30-20"],
    explanation: "The 50/30/20 rule is a simple budgeting framework: 50% needs, 30% wants, 20% savings.",
    points: 1,
    difficulty: "foundational",
    topic: "budgeting",
    moduleId: "module-2",
    published: true,
  },
  {
    id: "m2-sa1",
    type: "short_answer",
    question: "Name one difference between a fixed expense and a variable expense, with an example of each.",
    correctAnswer: "",
    acceptableKeywords: ["fixed", "variable", "rent", "groceries", "same amount", "changes", "stays the same"],
    explanation: "Fixed expenses (like rent) stay the same each month. Variable expenses (like groceries or utilities) change from month to month.",
    points: 2,
    difficulty: "applied",
    topic: "budgeting",
    moduleId: "module-2",
    published: true,
  },

  // --- Module 3: Credit & Borrowing ---
  {
    id: "m3-calc1",
    type: "calculation",
    question: "A student has a $1,000 credit limit and a $300 balance. What percentage of the available credit is currently being used (credit utilization)?",
    numericAnswer: 30,
    acceptableRangeLow: 30,
    acceptableRangeHigh: 30,
    unit: "%",
    explanation: "Credit utilization = balance ÷ credit limit = $300 ÷ $1,000 = 30%.",
    points: 2,
    difficulty: "applied",
    topic: "credit",
    moduleId: "module-3",
    published: true,
    correctAnswer: "30",
  },
  {
    id: "m3-calc2",
    type: "calculation",
    question: "You borrow $5,000 at a simple interest rate of 6% per year for 3 years. How much interest will you pay?",
    numericAnswer: 900,
    acceptableRangeLow: 900,
    acceptableRangeHigh: 900,
    unit: "$",
    explanation: "Simple interest = Principal × Rate × Time = $5,000 × 0.06 × 3 = $900.",
    points: 2,
    difficulty: "applied",
    topic: "borrowing",
    moduleId: "module-3",
    published: true,
    correctAnswer: "900",
  },
  {
    id: "m3-calc3",
    type: "calculation",
    question: "Loan A charges 8% APR with a $50 fee. Loan B charges 10% APR with no fee. On a $2,000 one-year loan, which loan costs less in total? Enter the total cost of the cheaper loan.",
    numericAnswer: 2100,
    acceptableRangeLow: 2100,
    acceptableRangeHigh: 2100,
    unit: "$",
    explanation: "Loan A: $2,000 × 0.08 + $50 = $210. Loan B: $2,000 × 0.10 = $200. Loan B costs $2,200 total, Loan A costs $2,210. Wait — Loan A total = $2,000 + $160 + $50 = $2,210. Loan B = $2,000 + $200 = $2,200. Loan B is cheaper at $2,200.",
    points: 3,
    difficulty: "advanced",
    topic: "borrowing",
    moduleId: "module-3",
    published: true,
    correctAnswer: "2200",
  },
  {
    id: "m3-scen1",
    type: "scenario",
    question: "A credit card advertises rewards but has a high APR and annual fee. What should a student compare before applying?",
    options: [
      "Only the rewards percentage — more rewards is always better",
      "The rewards value vs. the annual fee, APR, and other terms — make sure benefits outweigh costs",
      "The color and design of the card",
      "Whether friends have the same card",
    ],
    correctAnswer: "The rewards value vs. the annual fee, APR, and other terms — make sure benefits outweigh costs",
    explanation: "Rewards can be valuable, but only if they exceed the cost of the annual fee and any interest charges. Always compare the full terms, not just the rewards.",
    points: 2,
    difficulty: "applied",
    topic: "credit",
    moduleId: "module-3",
    published: true,
  },
  {
    id: "m3-fill1",
    type: "fill_in_blank",
    question: "A three-digit number that lenders use to evaluate your creditworthiness is called a ____ score.",
    correctAnswer: "credit",
    acceptableKeywords: ["credit"],
    explanation: "Your credit score is a three-digit number (typically 300–850) that lenders use to assess your likelihood of repaying debt.",
    points: 1,
    difficulty: "foundational",
    topic: "credit",
    moduleId: "module-3",
    published: true,
  },

  // --- Module 4: Education Financing & Student Loans ---
  {
    id: "m4-scen1",
    type: "scenario",
    question: "College A offers a larger scholarship but leaves a $14,000 annual funding gap. College B leaves an $8,500 funding gap. Which figure should the student focus on when estimating how much may need to be borrowed?",
    options: [
      "The scholarship amounts — College A's scholarship is bigger",
      "The funding gaps — College B's $8,500 gap means less borrowing needed",
      "The total cost of attendance only",
      "The distance from home",
    ],
    correctAnswer: "The funding gaps — College B's $8,500 gap means less borrowing needed",
    explanation: "The funding gap (cost minus grants/scholarships) is what you'll need to cover through loans, work, or family contributions. A smaller gap means less borrowing.",
    points: 2,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
  },
  {
    id: "m4-calc1",
    type: "calculation",
    question: "College A costs $28,000/year and offers $14,000 in grants. College B costs $22,000/year and offers $13,500 in grants. What is the remaining funding gap for College A?",
    numericAnswer: 14000,
    acceptableRangeLow: 14000,
    acceptableRangeHigh: 14000,
    unit: "$",
    explanation: "Funding gap = Cost − Grants = $28,000 − $14,000 = $14,000.",
    points: 2,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
    correctAnswer: "14000",
  },
  {
    id: "m4-calc2",
    type: "calculation",
    question: "A student borrows $20,000 in federal subsidized loans at 5.5% fixed interest. If the loan accrues simple interest over 4 years of college (subsidized means no interest while in school), how much interest accrues during the 6-month grace period after graduation?",
    numericAnswer: 550,
    acceptableRangeLow: 500,
    acceptableRangeHigh: 600,
    unit: "$",
    explanation: "Subsidized loans don't accrue interest during school. During the 6-month grace period: $20,000 × 0.055 × 0.5 years = $550.",
    points: 3,
    difficulty: "advanced",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
    correctAnswer: "550",
  },
  {
    id: "m4-fill1",
    type: "fill_in_blank",
    question: "The type of federal student loan where the government pays the interest while you're in school is called a ____ loan.",
    correctAnswer: "subsidized",
    acceptableKeywords: ["subsidized", "direct subsidized"],
    explanation: "With a Direct Subsidized Loan, the government pays the interest while you're enrolled at least half-time and during the grace period.",
    points: 1,
    difficulty: "foundational",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
  },
  {
    id: "m4-sa1",
    type: "short_answer",
    question: "Explain one key difference between a federal student loan and a private student loan.",
    correctAnswer: "",
    acceptableKeywords: ["federal", "private", "government", "fixed rate", "flexible", "repayment", "protections", "subsidized"],
    explanation: "Federal student loans offer fixed interest rates, income-driven repayment plans, and borrower protections. Private loans typically have variable rates and fewer protections.",
    points: 2,
    difficulty: "applied",
    topic: "student_loans",
    moduleId: "module-4",
    published: true,
  },

  // --- Module 5: Investing & Wealth Building ---
  {
    id: "m5-calc1",
    type: "calculation",
    question: "You invest $1,000 in a savings account with 4% APY. How much interest will you earn in one year (simple calculation, no compounding)?",
    numericAnswer: 40,
    acceptableRangeLow: 40,
    acceptableRangeHigh: 40,
    unit: "$",
    explanation: "Interest = Principal × Rate = $1,000 × 0.04 = $40.",
    points: 2,
    difficulty: "foundational",
    topic: "investing",
    moduleId: "module-5",
    published: true,
    correctAnswer: "40",
  },
  {
    id: "m5-calc2",
    type: "calculation",
    question: "If you invest $200/month at an average annual return of 7%, approximately how much will you have after 1 year if you only count the principal contributions?",
    numericAnswer: 2400,
    acceptableRangeLow: 2400,
    acceptableRangeHigh: 2400,
    unit: "$",
    explanation: "This question asks for principal only: $200 × 12 months = $2,400. (Investment returns would add more, but the question asks for contributions only.)",
    points: 2,
    difficulty: "applied",
    topic: "investing",
    moduleId: "module-5",
    published: true,
    correctAnswer: "2400",
  },
  {
    id: "m5-fill1",
    type: "fill_in_blank",
    question: "An investment strategy where you invest a fixed amount at regular intervals regardless of market conditions is called dollar-____.",
    correctAnswer: "cost averaging",
    acceptableKeywords: ["cost averaging", "dollar cost averaging"],
    explanation: "Dollar-cost averaging means investing a fixed amount at regular intervals, which can reduce the impact of market volatility.",
    points: 1,
    difficulty: "foundational",
    topic: "investing",
    moduleId: "module-5",
    published: true,
  },
  {
    id: "m5-scen1",
    type: "scenario",
    question: "A friend recommends putting all your savings into a single stock they're sure will double. What should you consider?",
    options: [
      "Follow their advice — guaranteed returns are rare",
      "Diversify — putting all your money in one stock is high risk; spread investments across different assets",
      "Invest only in that stock if the friend has inside information",
      "Avoid investing entirely and keep cash under a mattress",
    ],
    correctAnswer: "Diversify — putting all your money in one stock is high risk; spread investments across different assets",
    explanation: "Diversification reduces risk by spreading investments across different assets. No single stock is guaranteed to increase in value.",
    points: 2,
    difficulty: "applied",
    topic: "investing",
    moduleId: "module-5",
    published: true,
  },

  // --- Module 6: Cars, Housing, Insurance & Protection ---
  {
    id: "m6-calc1",
    type: "calculation",
    question: "A car costs $8,000. You put $2,000 down and finance the rest at 6% APR for 4 years. What is the principal amount you're financing?",
    numericAnswer: 6000,
    acceptableRangeLow: 6000,
    acceptableRangeHigh: 6000,
    unit: "$",
    explanation: "Amount financed = Price − Down payment = $8,000 − $2,000 = $6,000.",
    points: 2,
    difficulty: "foundational",
    topic: "cars",
    moduleId: "module-6",
    published: true,
    correctAnswer: "6000",
  },
  {
    id: "m6-calc2",
    type: "calculation",
    question: "Your monthly car payment is $350, insurance is $120, gas is $180, and maintenance averages $50/month. What is your total monthly car ownership cost?",
    numericAnswer: 700,
    acceptableRangeLow: 700,
    acceptableRangeHigh: 700,
    unit: "$",
    explanation: "Total = $350 + $120 + $180 + $50 = $700/month.",
    points: 2,
    difficulty: "applied",
    topic: "cars",
    moduleId: "module-6",
    published: true,
    correctAnswer: "700",
  },
  {
    id: "m6-scen1",
    type: "scenario",
    question: "You're renting your first apartment. The landlord asks for first month's rent ($1,200), last month's rent, and a security deposit equal to one month's rent. How much do you need upfront?",
    options: [
      "$1,200",
      "$2,400",
      "$3,600",
      "$4,800",
    ],
    correctAnswer: "$3,600",
    explanation: "First month ($1,200) + Last month ($1,200) + Security deposit ($1,200) = $3,600 total upfront.",
    points: 2,
    difficulty: "applied",
    topic: "housing",
    moduleId: "module-6",
    published: true,
  },
  {
    id: "m6-fill1",
    type: "fill_in_blank",
    question: "Insurance that helps pay for damage you cause to others in an accident is called ____ insurance.",
    correctAnswer: "liability",
    acceptableKeywords: ["liability", "liability insurance"],
    explanation: "Liability insurance covers damage or injuries you cause to others. Most states require a minimum level of liability coverage.",
    points: 1,
    difficulty: "foundational",
    topic: "insurance",
    moduleId: "module-6",
    published: true,
  },
  {
    id: "m6-sa1",
    type: "short_answer",
    question: "Describe one red flag that might indicate a financial scam or fraud attempt.",
    correctAnswer: "",
    acceptableKeywords: ["urgent", "pressure", "too good", "guaranteed", "wire", "gift card", "personal information", "unsolicited", "stranger", "verify"],
    explanation: "Common fraud red flags include high-pressure tactics, promises of guaranteed returns, requests for gift cards or wire transfers, and unsolicited requests for personal information.",
    points: 2,
    difficulty: "applied",
    topic: "fraud_protection",
    moduleId: "module-6",
    published: true,
  },
];

// ---------------------------------------------------------------------------
// Full Question Bank
// ---------------------------------------------------------------------------
export const QUESTION_BANK: AssessmentQuestion[] = [...moduleQuestions, ...newQuestions];

// ---------------------------------------------------------------------------
// Knowledge Check Assessment Configs (one per module)
// ---------------------------------------------------------------------------
export const KNOWLEDGE_CHECK_CONFIGS: AssessmentConfig[] = modules.map((mod, idx) => ({
  id: `kc-${mod.id}`,
  title: `Module ${mod.number} Knowledge Check`,
  type: "knowledge_check" as const,
  moduleId: mod.id,
  description: `Knowledge check for ${mod.title}`,
  questionIds: mod.knowledgeCheck.map((q) => q.id),
  passingScore: 70,
  maxRetakes: null, // unlimited
  feedbackMode: "after_submit" as const,
  randomizeQuestions: false,
  randomizeAnswers: false,
  published: true,
}));

// ---------------------------------------------------------------------------
// Final Assessment — ~30 questions across all modules
// ---------------------------------------------------------------------------
const finalAssessmentQuestionIds: string[] = [
  // Module 1: Income & Banking (5 questions)
  "m1-q1", "m1-q2", "m1-q3", "m1-q6", "m1-calc1",
  // Module 2: Budgeting & Saving (5 questions)
  "m2-calc1", "m2-calc2", "m2-calc3", "m2-fill1", "m2-q3",
  // Module 3: Credit & Borrowing (5 questions)
  "m3-calc1", "m3-calc2", "m3-scen1", "m3-fill1", "m3-q5",
  // Module 4: Education Financing (5 questions)
  "m4-scen1", "m4-calc1", "m4-fill1", "m4-sa1", "m4-q2",
  // Module 5: Investing (5 questions)
  "m5-calc1", "m5-fill1", "m5-scen1", "m5-q1", "m5-q4",
  // Module 6: Cars, Housing, Insurance (5 questions)
  "m6-calc1", "m6-calc2", "m6-scen1", "m6-fill1", "m6-sa1",
];

export const FINAL_ASSESSMENT_CONFIG: AssessmentConfig = {
  id: "final-assessment",
  title: "RISE USA Final Assessment",
  type: "final_assessment",
  description: "Comprehensive assessment covering all six RISE USA modules",
  questionIds: finalAssessmentQuestionIds,
  passingScore: 70,
  maxRetakes: null,
  feedbackMode: "after_submit",
  randomizeQuestions: false,
  randomizeAnswers: false,
  published: true,
};

// ---------------------------------------------------------------------------
// All Assessment Configs
// ---------------------------------------------------------------------------
export const ALL_ASSESSMENTS: AssessmentConfig[] = [...KNOWLEDGE_CHECK_CONFIGS, FINAL_ASSESSMENT_CONFIG];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------
export function getQuestionById(id: string): AssessmentQuestion | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}

export function getAssessmentById(id: string): AssessmentConfig | undefined {
  return ALL_ASSESSMENTS.find((a) => a.id === id);
}

export function getQuestionsForAssessment(assessmentId: string): AssessmentQuestion[] {
  const config = getAssessmentById(assessmentId);
  if (!config) return [];
  return config.questionIds
    .map((id) => getQuestionById(id))
    .filter((q): q is AssessmentQuestion => q !== undefined);
}

export function getKnowledgeCheckForModule(moduleId: string): AssessmentConfig | undefined {
  return KNOWLEDGE_CHECK_CONFIGS.find((kc) => kc.moduleId === moduleId);
}

// Filter questions for the question bank
export function filterQuestions(filters: {
  moduleId?: string;
  topic?: string;
  difficulty?: string;
  type?: string;
  published?: string;
  search?: string;
}): AssessmentQuestion[] {
  return QUESTION_BANK.filter((q) => {
    if (filters.moduleId && q.moduleId !== filters.moduleId) return false;
    if (filters.topic && q.topic !== filters.topic) return false;
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    if (filters.type && q.type !== filters.type) return false;
    if (filters.published === "published" && !q.published) return false;
    if (filters.published === "draft" && q.published) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!q.question.toLowerCase().includes(s)) return false;
    }
    return true;
  });
}
