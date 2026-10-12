// ============================================================================
// RISE USA LMS — Review & Grading Demo Data
// ============================================================================

import type {
  Rubric,
  Submission,
  SubmissionVersion,
  ReviewSettings,
  InstructorWorkloadMetrics,
  ReviewQueueItem,
  StudentFeedbackItem,
  OrgManagerReviewItem,
  SubmissionType,
  ReviewStatus,
  ActivityReviewMode,
  ActivityPrivacyLevel,
} from "@/lib/types";
import { modules } from "@/data/course";

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

// ---------------------------------------------------------------------------
// Default Rubrics
// ---------------------------------------------------------------------------

const PERFORMANCE_LEVELS = [
  { level: "beginning" as const, label: "Beginning", point_value: 1, description: "Shows minimal understanding; response is incomplete or off-topic." },
  { level: "developing" as const, label: "Developing", point_value: 2, description: "Shows partial understanding; some key elements are missing." },
  { level: "proficient" as const, label: "Proficient", point_value: 3, description: "Shows solid understanding; most key elements are present and correct." },
  { level: "strong" as const, label: "Strong", point_value: 4, description: "Shows thorough understanding; all key elements are present and well-articulated." },
];

export const DEFAULT_DECISION_LAB_RUBRIC: Rubric = {
  id: "rubric-decision-lab",
  title: "RISE Decision Lab Rubric",
  activity_type: "decision_lab",
  criteria: [
    {
      id: "c-financial-reasoning",
      title: "Financial Reasoning",
      description: "Demonstrates understanding of the financial concepts involved.",
    },
    {
      id: "c-comparison-options",
      title: "Comparison of Options",
      description: "Evaluates relevant costs, benefits, risks, and tradeoffs.",
    },
    {
      id: "c-decision-quality",
      title: "Decision Quality",
      description: "Makes a reasonable decision based on the information provided.",
    },
    {
      id: "c-explanation",
      title: "Explanation",
      description: "Clearly explains why the selected option was chosen.",
    },
  ],
  performance_levels: PERFORMANCE_LEVELS,
  is_default: true,
  created_by: "system",
  created_by_name: "System",
  created_at: daysAgo(60),
  updated_at: daysAgo(60),
};

export const DEFAULT_BLUEPRINT_RUBRIC: Rubric = {
  id: "rubric-blueprint",
  title: "RISE Financial Blueprint Rubric",
  activity_type: "blueprint_section",
  criteria: [
    { id: "bp-completeness", title: "Completeness", description: "All required sections and fields are filled in." },
    { id: "bp-realistic-planning", title: "Realistic Planning", description: "Numbers and plans are realistic and grounded in real-world expectations." },
    { id: "bp-income-expenses", title: "Connection Between Income and Expenses", description: "Demonstrates understanding of how income drives spending decisions." },
    { id: "bp-credit-debt", title: "Understanding of Credit/Debt", description: "Shows grasp of how credit and debt affect financial health." },
    { id: "bp-saving-investing", title: "Saving and Investing Strategy", description: "Includes a reasonable saving and investing plan." },
    { id: "bp-education-career", title: "Education/Career Financial Planning", description: "Addresses education and career costs and financing." },
    { id: "bp-transportation-housing", title: "Transportation/Housing Planning", description: "Includes realistic transportation and housing plans." },
    { id: "bp-protection", title: "Financial Protection Strategy", description: "Addresses insurance and financial protection." },
  ],
  performance_levels: PERFORMANCE_LEVELS,
  is_default: true,
  created_by: "system",
  created_by_name: "System",
  created_at: daysAgo(60),
  updated_at: daysAgo(60),
};

export const DEMO_RUBRICS: Rubric[] = [DEFAULT_DECISION_LAB_RUBRIC, DEFAULT_BLUEPRINT_RUBRIC];

// ---------------------------------------------------------------------------
// Default Review Settings
// ---------------------------------------------------------------------------

export const DEMO_REVIEW_SETTINGS: ReviewSettings = {
  review_target_days: 5,
  highlight_overdue: true,
};

// ---------------------------------------------------------------------------
// Demo Activity Review Config (maps activity → review mode + privacy)
// ---------------------------------------------------------------------------

export interface ActivityReviewConfig {
  activity_id: string;
  activity_title: string;
  submission_type: SubmissionType;
  review_mode: ActivityReviewMode;
  privacy_level: ActivityPrivacyLevel;
  rubric_id: string | null;
  allow_file_attachment: boolean;
}

export const DEMO_ACTIVITY_REVIEW_CONFIGS: ActivityReviewConfig[] = [
  // Module 1 Decision Lab
  {
    activity_id: `${modules[0].id}-decision-lab`,
    activity_title: modules[0].decisionLab.title,
    submission_type: "decision_lab",
    review_mode: "rubric_scored",
    privacy_level: "student_instructor_admin",
    rubric_id: "rubric-decision-lab",
    allow_file_attachment: false,
  },
  // Module 2 Decision Lab
  {
    activity_id: `${modules[1].id}-decision-lab`,
    activity_title: modules[1].decisionLab.title,
    submission_type: "decision_lab",
    review_mode: "rubric_scored",
    privacy_level: "student_instructor_admin",
    rubric_id: "rubric-decision-lab",
    allow_file_attachment: false,
  },
  // Module 1 Reflection
  {
    activity_id: `${modules[0].id}-reflection`,
    activity_title: "Module 1 Reflection",
    submission_type: "reflection",
    review_mode: "instructor_reviewed",
    privacy_level: "student_instructor_admin",
    rubric_id: null,
    allow_file_attachment: false,
  },
  // Module 1 Action Commitment
  {
    activity_id: `${modules[0].id}-action-commitment`,
    activity_title: "Module 1 Action Commitment",
    submission_type: "action_commitment",
    review_mode: "completion_only",
    privacy_level: "student_instructor_only",
    rubric_id: null,
    allow_file_attachment: false,
  },
  // Module 1 Workbook
  {
    activity_id: `${modules[0].id}-workbook`,
    activity_title: modules[0].workbookActivity.title,
    submission_type: "workbook",
    review_mode: "instructor_reviewed",
    privacy_level: "student_instructor_admin",
    rubric_id: null,
    allow_file_attachment: true,
  },
  // Blueprint Section 1
  {
    activity_id: "blueprint-section-1",
    activity_title: "Income, Paycheck & Banking Plan",
    submission_type: "blueprint_section",
    review_mode: "rubric_scored",
    privacy_level: "student_instructor_admin",
    rubric_id: "rubric-blueprint",
    allow_file_attachment: false,
  },
  // Blueprint Section 2
  {
    activity_id: "blueprint-section-2",
    activity_title: "Monthly Budget & Emergency Savings Plan",
    submission_type: "blueprint_section",
    review_mode: "rubric_scored",
    privacy_level: "student_instructor_admin",
    rubric_id: "rubric-blueprint",
    allow_file_attachment: false,
  },
  // Final Capstone
  {
    activity_id: "final-capstone",
    activity_title: "Final Capstone Review",
    submission_type: "final_capstone",
    review_mode: "rubric_scored",
    privacy_level: "student_instructor_admin",
    rubric_id: "rubric-blueprint",
    allow_file_attachment: true,
  },
];

// ---------------------------------------------------------------------------
// Demo Submissions
// ---------------------------------------------------------------------------

function makeSubmission(p: {
  id: string;
  student_id: string;
  student_name: string;
  cohort_id: string;
  cohort_name: string;
  org_id: string;
  org_name: string;
  module_idx: number;
  activity_id: string;
  activity_title: string;
  submission_type: SubmissionType;
  activity_instructions: string;
  student_response: string;
  submitted_days_ago: number;
  review_status: ReviewStatus;
  assigned_instructor_id: string | null;
  assigned_instructor_name: string | null;
  instructor_feedback: string | null;
  score: number | null;
  max_score: number | null;
  rubric_result: Submission["rubric_result"];
  private_notes: string | null;
  reviewed_days_ago: number | null;
  resubmission_status: "none" | "revision_requested" | "resubmitted" | null;
  version_number: number;
  privacy_level: ActivityPrivacyLevel;
  review_mode: ActivityReviewMode;
  has_file: boolean;
}): Submission {
  const m = modules[p.module_idx];
  return {
    id: p.id,
    student_profile_id: p.student_id,
    student_name: p.student_name,
    enrollment_id: `enr-${p.student_id}`,
    organization_id: p.org_id,
    organization_name: p.org_name,
    cohort_id: p.cohort_id,
    cohort_name: p.cohort_name,
    course_id: "rise-usa",
    module_id: m.id,
    module_number: m.number,
    module_title: m.title.split("—")[0].trim(),
    lesson_id: null,
    lesson_title: null,
    activity_id: p.activity_id,
    activity_title: p.activity_title,
    activity_instructions: p.activity_instructions,
    submission_type: p.submission_type,
    student_response: p.student_response,
    attached_file_url: p.has_file ? `https://example.com/files/${p.id}.pdf` : null,
    attached_file_name: p.has_file ? `${p.id}-submission.pdf` : null,
    submitted_at: daysAgo(p.submitted_days_ago),
    review_status: p.review_status,
    assigned_instructor_id: p.assigned_instructor_id,
    assigned_instructor_name: p.assigned_instructor_name,
    instructor_feedback: p.instructor_feedback,
    score: p.score,
    max_score: p.max_score,
    rubric_result: p.rubric_result,
    private_instructor_notes: p.private_notes,
    reviewed_at: p.reviewed_days_ago !== null ? daysAgo(p.reviewed_days_ago) : null,
    resubmission_status: p.resubmission_status,
    version_number: p.version_number,
    privacy_level: p.privacy_level,
    review_mode: p.review_mode,
    created_at: daysAgo(p.submitted_days_ago),
    updated_at: daysAgo(p.reviewed_days_ago ?? p.submitted_days_ago),
  };
}

export const DEMO_SUBMISSIONS: Submission[] = [
  // s2 — Tyler Brown — Module 1 Decision Lab — submitted, awaiting review (3 days)
  makeSubmission({
    id: "sub-1",
    student_id: "s2",
    student_name: "Tyler Brown",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 0,
    activity_id: `${modules[0].id}-decision-lab`,
    activity_title: modules[0].decisionLab.title,
    submission_type: "decision_lab",
    activity_instructions: modules[0].decisionLab.instructions,
    student_response:
      "I chose Option B — putting $200 into savings each paycheck. Even though Option A lets me spend more now, I know that having an emergency fund means I won't have to borrow money if something unexpected happens. The tradeoff is I have less spending money, but the benefit is long-term security. I used the 50/30/20 rule to decide: 50% needs, 30% wants, 20% savings.",
    submitted_days_ago: 3,
    review_status: "submitted",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback: null,
    score: null,
    max_score: null,
    rubric_result: null,
    private_notes: null,
    reviewed_days_ago: null,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: "student_instructor_admin",
    review_mode: "rubric_scored",
    has_file: false,
  }),
  // s4 — Riley Martinez — Module 2 Decision Lab — submitted, awaiting review (7 days — overdue)
  makeSubmission({
    id: "sub-2",
    student_id: "s4",
    student_name: "Riley Martinez",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 1,
    activity_id: `${modules[1].id}-decision-lab`,
    activity_title: modules[1].decisionLab.title,
    submission_type: "decision_lab",
    activity_instructions: modules[1].decisionLab.instructions,
    student_response:
      "I decided to use the envelope budgeting method. I'll put cash in envelopes for food, transportation, and entertainment. This way I can't overspend. I compared it to using an app, but I think cash is more real for me. The risk is I might lose cash, but the benefit is I can see exactly how much I have left.",
    submitted_days_ago: 7,
    review_status: "submitted",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback: null,
    score: null,
    max_score: null,
    rubric_result: null,
    private_notes: null,
    reviewed_days_ago: null,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: "student_instructor_admin",
    review_mode: "rubric_scored",
    has_file: false,
  }),
  // s5 — Casey Nguyen — Module 1 Workbook — in review (2 days)
  makeSubmission({
    id: "sub-3",
    student_id: "s5",
    student_name: "Casey Nguyen",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 0,
    activity_id: `${modules[0].id}-workbook`,
    activity_title: modules[0].workbookActivity.title,
    submission_type: "workbook",
    activity_instructions: modules[0].workbookActivity.instructions,
    student_response:
      "1. Gross pay is what you earn before taxes. Net pay is what you actually take home.\n2. A W-4 form tells your employer how much tax to withhold.\n3. Direct deposit is safer than a paper check because it can't be lost or stolen.\n4. My monthly net income estimate: $1,800. My planned savings: $360 (20%).",
    submitted_days_ago: 2,
    review_status: "in_review",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback: null,
    score: null,
    max_score: null,
    rubric_result: null,
    private_notes: "Casey seems to understand the basics but the W-4 explanation could be more detailed.",
    reviewed_days_ago: null,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: "student_instructor_admin",
    review_mode: "instructor_reviewed",
    has_file: true,
  }),
  // s2 — Tyler Brown — Module 1 Reflection — feedback provided (1 day ago)
  makeSubmission({
    id: "sub-4",
    student_id: "s2",
    student_name: "Tyler Brown",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 0,
    activity_id: `${modules[0].id}-reflection`,
    activity_title: "Module 1 Reflection",
    submission_type: "reflection",
    activity_instructions: modules[0].reflection.prompt,
    student_response:
      "Before this module, I didn't know the difference between gross and net pay. Now I understand that taxes and deductions take a big chunk out of my paycheck. I feel more prepared to read my pay stub and plan my budget around my actual take-home pay.",
    submitted_days_ago: 5,
    review_status: "feedback_provided",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback:
      "Great reflection, Tyler! You clearly understand the difference between gross and net pay now. Next time, try to also mention specific deductions like FICA or state tax. Keep up the good work!",
    score: null,
    max_score: null,
    rubric_result: null,
    private_notes: "Tyler is engaged and improving. Watch for consistent participation.",
    reviewed_days_ago: 1,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: "student_instructor_admin",
    review_mode: "instructor_reviewed",
    has_file: false,
  }),
  // s3 — Jordan Smith — Module 1 Decision Lab — revision requested (4 days ago)
  makeSubmission({
    id: "sub-5",
    student_id: "s3",
    student_name: "Jordan Smith",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 0,
    activity_id: `${modules[0].id}-decision-lab`,
    activity_title: modules[0].decisionLab.title,
    submission_type: "decision_lab",
    activity_instructions: modules[0].decisionLab.instructions,
    student_response:
      "I picked Option A because I want to spend my money now while I'm young.",
    submitted_days_ago: 8,
    review_status: "revision_requested",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback:
      "I'd like you to revise this. Your decision is valid, but I need more financial reasoning. Please compare the costs and benefits of both options, explain the tradeoffs, and tell me why Option A is the better choice for your situation. Use specific numbers if you can.",
    score: null,
    max_score: null,
    rubric_result: null,
    private_notes: "Jordan's response was too brief. Needs to show more financial reasoning.",
    reviewed_days_ago: 4,
    resubmission_status: "revision_requested",
    version_number: 1,
    privacy_level: "student_instructor_admin",
    review_mode: "rubric_scored",
    has_file: false,
  }),
  // s7 — Sam Anderson — Blueprint Section 1 — completed with rubric score
  makeSubmission({
    id: "sub-6",
    student_id: "s7",
    student_name: "Sam Anderson",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 0,
    activity_id: "blueprint-section-1",
    activity_title: "Income, Paycheck & Banking Plan",
    submission_type: "blueprint_section",
    activity_instructions:
      "Complete your Income, Paycheck & Banking Plan. Include your expected monthly income, a breakdown of deductions, your chosen bank account type, and how you plan to manage your paychecks.",
    student_response:
      "Monthly gross income: $2,400 (part-time job). After taxes (~20%), net income: $1,920. I plan to open a checking account for daily expenses and a savings account for my emergency fund. I'll split my direct deposit: 80% checking, 20% savings. My bank is a local credit union with no monthly fees.",
    submitted_days_ago: 15,
    review_status: "completed",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback:
      "Excellent blueprint section, Sam! Your income calculations are accurate, and your banking plan is realistic. Using a credit union with no fees is a smart choice. Your 80/20 split is a solid savings strategy.",
    score: 14,
    max_score: 16,
    rubric_result: {
      rubric_id: "rubric-blueprint",
      rubric_title: "RISE Financial Blueprint Rubric",
      criterion_results: [
        { criterion_id: "bp-completeness", criterion_title: "Completeness", performance_level: "strong", point_value: 4, instructor_comment: "All fields completed." },
        { criterion_id: "bp-realistic-planning", criterion_title: "Realistic Planning", performance_level: "strong", point_value: 4, instructor_comment: "Numbers are realistic for a part-time job." },
        { criterion_id: "bp-income-expenses", criterion_title: "Connection Between Income and Expenses", performance_level: "strong", point_value: 4, instructor_comment: "Clear connection shown." },
        { criterion_id: "bp-credit-debt", criterion_title: "Understanding of Credit/Debt", performance_level: "beginning", point_value: 1, instructor_comment: "Not addressed in this section — appropriate." },
        { criterion_id: "bp-saving-investing", criterion_title: "Saving and Investing Strategy", performance_level: "beginning", point_value: 1, instructor_comment: "Savings addressed; investing not yet." },
        { criterion_id: "bp-education-career", criterion_title: "Education/Career Financial Planning", performance_level: "beginning", point_value: 0, instructor_comment: "Not applicable to this section." },
        { criterion_id: "bp-transportation-housing", criterion_title: "Transportation/Housing Planning", performance_level: "beginning", point_value: 0, instructor_comment: "Not applicable to this section." },
        { criterion_id: "bp-protection", criterion_title: "Financial Protection Strategy", performance_level: "beginning", point_value: 0, instructor_comment: "Not applicable to this section." },
      ],
      total_points: 14,
      max_points: 16,
    },
    private_notes: "Sam is one of the strongest students. Consider for peer mentoring.",
    reviewed_days_ago: 10,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: "student_instructor_admin",
    review_mode: "rubric_scored",
    has_file: false,
  }),
  // s8 — Jamie Wilson — Module 1 Action Commitment — completed (completion only)
  makeSubmission({
    id: "sub-7",
    student_id: "s8",
    student_name: "Jamie Wilson",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 0,
    activity_id: `${modules[0].id}-action-commitment`,
    activity_title: "Module 1 Action Commitment",
    submission_type: "action_commitment",
    activity_instructions: modules[0].actionCommitment.prompt,
    student_response:
      "This week, I commit to looking at my parents' pay stub with them and identifying all the deductions. I also commit to opening a savings account by next Friday.",
    submitted_days_ago: 6,
    review_status: "completed",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback: "Great commitments, Jamie! Let me know how the pay stub review goes.",
    score: null,
    max_score: null,
    rubric_result: null,
    private_notes: null,
    reviewed_days_ago: 5,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: "student_instructor_only",
    review_mode: "completion_only",
    has_file: false,
  }),
  // s5 — Casey Nguyen — Blueprint Section 2 — resubmitted after revision (1 day ago)
  makeSubmission({
    id: "sub-8",
    student_id: "s5",
    student_name: "Casey Nguyen",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 1,
    activity_id: "blueprint-section-2",
    activity_title: "Monthly Budget & Emergency Savings Plan",
    submission_type: "blueprint_section",
    activity_instructions:
      "Complete your Monthly Budget & Emergency Savings Plan. Include your monthly expense breakdown, your emergency savings goal, and your plan to reach it.",
    student_response:
      "Monthly net income: $1,600. Fixed expenses: $400 (car insurance, phone). Variable expenses: $500 (food, gas, entertainment). Savings: $400 (25%). Emergency fund goal: $2,400 (3 months of expenses). I'll reach this in 6 months by saving $400/month. I revised my entertainment budget down from $300 to $200 based on your feedback.",
    submitted_days_ago: 1,
    review_status: "resubmitted",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback: null,
    score: null,
    max_score: null,
    rubric_result: null,
    private_notes: "Casey revised well. Ready for rubric scoring.",
    reviewed_days_ago: null,
    resubmission_status: "resubmitted",
    version_number: 2,
    privacy_level: "student_instructor_admin",
    review_mode: "rubric_scored",
    has_file: false,
  }),
  // demo-student — Alex Johnson — Module 1 Decision Lab — feedback provided
  makeSubmission({
    id: "sub-9",
    student_id: "demo-student",
    student_name: "Alex Johnson",
    cohort_id: "cohort-fall-2025",
    cohort_name: "Fall 2025 — Period 3",
    org_id: "org-lincoln",
    org_name: "Lincoln High School",
    module_idx: 0,
    activity_id: `${modules[0].id}-decision-lab`,
    activity_title: modules[0].decisionLab.title,
    submission_type: "decision_lab",
    activity_instructions: modules[0].decisionLab.instructions,
    student_response:
      "I chose to split my paycheck 70/20/10: 70% for needs, 20% for savings, and 10% for giving. I compared putting all savings in a regular savings account vs. a high-yield savings account. The HYSA gives 4.5% vs 0.5%, so over a year that's a meaningful difference. The risk is I can't access it instantly, but most HYSAs let me transfer within 1-2 days, which is fine for an emergency fund.",
    submitted_days_ago: 21,
    review_status: "feedback_provided",
    assigned_instructor_id: "demo-instructor",
    assigned_instructor_name: "Ms. Garcia",
    instructor_feedback:
      "Outstanding reasoning, Alex! You compared two real options, used specific numbers (4.5% vs 0.5%), and identified a real tradeoff (access speed). Your 70/20/10 split is a solid framework. One suggestion: consider whether 10% for giving is sustainable on your income — great generosity, but make sure your own needs are covered first.",
    score: 15,
    max_score: 16,
    rubric_result: {
      rubric_id: "rubric-decision-lab",
      rubric_title: "RISE Decision Lab Rubric",
      criterion_results: [
        { criterion_id: "c-financial-reasoning", criterion_title: "Financial Reasoning", performance_level: "strong", point_value: 4, instructor_comment: "Excellent understanding of savings concepts and interest rates." },
        { criterion_id: "c-comparison-options", criterion_title: "Comparison of Options", performance_level: "strong", point_value: 4, instructor_comment: "Compared HYSA vs regular savings with specific rates." },
        { criterion_id: "c-decision-quality", criterion_title: "Decision Quality", performance_level: "proficient", point_value: 3, instructor_comment: "Good decision; the 10% giving is generous but consider sustainability." },
        { criterion_id: "c-explanation", criterion_title: "Explanation", performance_level: "strong", point_value: 4, instructor_comment: "Clear, well-organized explanation." },
      ],
      total_points: 15,
      max_points: 16,
    },
    private_notes: "Alex is a top performer. Consider for advanced placement.",
    reviewed_days_ago: 5,
    resubmission_status: "none",
    version_number: 1,
    privacy_level: "student_instructor_admin",
    review_mode: "rubric_scored",
    has_file: false,
  }),
];

// ---------------------------------------------------------------------------
// Demo Submission Versions (revision history)
// ---------------------------------------------------------------------------

export const DEMO_SUBMISSION_VERSIONS: Record<string, SubmissionVersion[]> = {
  "sub-8": [
    {
      version_number: 1,
      student_response:
        "Monthly net income: $1,600. Fixed expenses: $400. Variable expenses: $700 (food $300, gas $150, entertainment $250). Savings: $200. Emergency fund goal: $1,200.",
      submitted_at: daysAgo(10),
      instructor_feedback:
        "Good start, Casey. Your entertainment budget ($250) seems high relative to your savings ($200). I'd like you to revise: reduce entertainment and increase your savings rate. Also, your emergency fund goal of $1,200 only covers about 1 month — aim for 3 months. Please revise and resubmit.",
      review_status: "revision_requested",
      score: null,
      reviewed_at: daysAgo(7),
    },
    {
      version_number: 2,
      student_response:
        "Monthly net income: $1,600. Fixed expenses: $400 (car insurance, phone). Variable expenses: $500 (food, gas, entertainment). Savings: $400 (25%). Emergency fund goal: $2,400 (3 months of expenses). I'll reach this in 6 months by saving $400/month. I revised my entertainment budget down from $300 to $200 based on your feedback.",
      submitted_at: daysAgo(1),
      instructor_feedback: null,
      review_status: "resubmitted",
      score: null,
      reviewed_at: null,
    },
  ],
  "sub-5": [
    {
      version_number: 1,
      student_response: "I picked Option A because I want to spend my money now while I'm young.",
      submitted_at: daysAgo(8),
      instructor_feedback:
        "I'd like you to revise this. Your decision is valid, but I need more financial reasoning. Please compare the costs and benefits of both options, explain the tradeoffs, and tell me why Option A is the better choice for your situation. Use specific numbers if you can.",
      review_status: "revision_requested",
      score: null,
      reviewed_at: daysAgo(4),
    },
  ],
};

// ---------------------------------------------------------------------------
// Demo Instructor Workload Metrics
// ---------------------------------------------------------------------------

export const DEMO_INSTRUCTOR_WORKLOAD: InstructorWorkloadMetrics[] = [
  {
    instructor_id: "demo-instructor",
    instructor_name: "Ms. Garcia",
    submissions_awaiting_review: 4,
    reviews_completed: 3,
    avg_review_turnaround_hours: 48,
    revisions_requested: 1,
    overdue_reviews: 1,
  },
];

// ---------------------------------------------------------------------------
// Demo Review Queue Items (derived from submissions for the queue view)
// ---------------------------------------------------------------------------

export function getDemoReviewQueueItems(targetDays: number): ReviewQueueItem[] {
  return DEMO_SUBMISSIONS.filter(
    (s) =>
      s.review_status === "submitted" ||
      s.review_status === "in_review" ||
      s.review_status === "resubmitted"
  ).map((s) => {
    const daysWaiting = Math.floor(
      (now.getTime() - new Date(s.submitted_at).getTime()) / 86400000
    );
    return {
      id: s.id,
      student_name: s.student_name,
      organization_name: s.organization_name || "",
      cohort_name: s.cohort_name || "",
      module_number: s.module_number,
      module_title: s.module_title,
      activity_title: s.activity_title,
      submission_type: s.submission_type,
      submitted_at: s.submitted_at,
      review_status: s.review_status,
      days_waiting: daysWaiting,
      is_overdue: daysWaiting > targetDays,
      assigned_instructor_name: s.assigned_instructor_name,
    };
  });
}

// ---------------------------------------------------------------------------
// Demo Student Feedback Items (for student dashboard)
// ---------------------------------------------------------------------------

export function getDemoStudentFeedback(studentId: string): StudentFeedbackItem[] {
  return DEMO_SUBMISSIONS.filter((s) => s.student_profile_id === studentId).map((s) => ({
    submission_id: s.id,
    activity_title: s.activity_title,
    module_number: s.module_number,
    module_title: s.module_title,
    submission_type: s.submission_type,
    review_status: s.review_status,
    instructor_feedback: s.instructor_feedback,
    score: s.score,
    max_score: s.max_score,
    rubric_result: s.rubric_result,
    resubmission_status: s.resubmission_status,
    reviewed_at: s.reviewed_at,
    submitted_at: s.submitted_at,
    link_url: s.submission_type === "blueprint_section"
      ? "/blueprint"
      : `/course/module/${s.module_id}`,
  }));
}

// ---------------------------------------------------------------------------
// Demo Org Manager Review Items
// ---------------------------------------------------------------------------

export function getDemoOrgManagerReviewItems(orgId: string): OrgManagerReviewItem[] {
  return DEMO_SUBMISSIONS.filter((s) => s.organization_id === orgId).map((s) => ({
    student_name: s.student_name,
    cohort_name: s.cohort_name || "",
    module_number: s.module_number,
    module_title: s.module_title,
    activity_title: s.activity_title,
    submission_type: s.submission_type,
    review_status: s.review_status,
    submitted_at: s.submitted_at,
    reviewed_at: s.reviewed_at,
    is_org_visible: s.privacy_level === "org_visible_completion",
  }));
}
