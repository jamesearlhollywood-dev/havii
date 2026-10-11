// ============================================================================
// RISE USA — Course Content Management System (CMS) Type Definitions
// ============================================================================

import type {
  ContentBlock,
  KeyTerm,
  RealLifeScenario,
  DecisionLab,
  QuizQuestion,
  ModuleReflection,
  ActionCommitment,
  BlueprintUpdate,
} from "./course-types";

// ---------------------------------------------------------------------------
// RISE Content Type — pedagogical label shown to students
// ---------------------------------------------------------------------------
export type RiseContentType =
  | "learn_it"
  | "know_the_terms"
  | "see_it_real_life"
  | "rise_decision_lab"
  | "workbook_activity"
  | "knowledge_check"
  | "reflection"
  | "action_commitment"
  | "rise_financial_blueprint";

export interface RiseContentTypeMeta {
  value: RiseContentType;
  label: string;
  icon: string;
  color: string;       // tailwind text color
  bgColor: string;      // tailwind bg color
  borderColor: string;  // tailwind border color
  description: string;
}

export const RISE_CONTENT_TYPES: RiseContentTypeMeta[] = [
  {
    value: "learn_it",
    label: "Learn It",
    icon: "📚",
    color: "text-rise-navy",
    bgColor: "bg-rise-sky",
    borderColor: "border-rise-blue-light",
    description: "Core instructional content — readings, explanations, and examples.",
  },
  {
    value: "know_the_terms",
    label: "Know the Terms",
    icon: "📖",
    color: "text-rise-blue-dark",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Key vocabulary and definitions students need to master.",
  },
  {
    value: "see_it_real_life",
    label: "See It in Real Life",
    icon: "🌍",
    color: "text-rise-success",
    bgColor: "bg-rise-success-light",
    borderColor: "border-rise-success/30",
    description: "Real-world scenarios that connect concepts to everyday life.",
  },
  {
    value: "rise_decision_lab",
    label: "RISE Decision Lab",
    icon: "🔬",
    color: "text-rise-red",
    bgColor: "bg-rise-red/5",
    borderColor: "border-rise-red/20",
    description: "Interactive decision-making exercises in a safe, fictional environment.",
  },
  {
    value: "workbook_activity",
    label: "Workbook Activity",
    icon: "✏️",
    color: "text-rise-warning",
    bgColor: "bg-rise-cream/50",
    borderColor: "border-rise-gold",
    description: "Hands-on worksheets with prompts for students to complete.",
  },
  {
    value: "knowledge_check",
    label: "Knowledge Check",
    icon: "✅",
    color: "text-rise-navy",
    bgColor: "bg-rise-sky/50",
    borderColor: "border-rise-blue-light",
    description: "Quick checks for understanding with immediate feedback.",
  },
  {
    value: "reflection",
    label: "Reflection",
    icon: "🤔",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Personal reflection prompts for deeper thinking.",
  },
  {
    value: "action_commitment",
    label: "Action Commitment",
    icon: "🎯",
    color: "text-rise-red",
    bgColor: "bg-rise-red/5",
    borderColor: "border-rise-red/20",
    description: "Commitments to take real-world action based on what was learned.",
  },
  {
    value: "rise_financial_blueprint",
    label: "RISE Financial Blueprint",
    icon: "📋",
    color: "text-rise-navy",
    bgColor: "bg-rise-navy/5",
    borderColor: "border-rise-navy/20",
    description: "Builds a section of the student's personal Financial Blueprint.",
  },
];

export function getRiseContentTypeMeta(value: RiseContentType | string | null | undefined): RiseContentTypeMeta | null {
  if (!value) return null;
  return RISE_CONTENT_TYPES.find((t) => t.value === value) ?? null;
}

// ---------------------------------------------------------------------------
// Learning Activity Type — format of the content
// ---------------------------------------------------------------------------
export type ActivityType =
  | "text_lesson"
  | "video"
  | "image"
  | "downloadable_document"
  | "pdf"
  | "powerpoint_resource_link"
  | "interactive_scenario"
  | "rise_decision_lab"
  | "worksheet"
  | "reflection"
  | "discussion_prompt"
  | "knowledge_check"
  | "quiz"
  | "assignment"
  | "financial_blueprint_activity"
  | "external_resource_link";

export interface ActivityTypeMeta {
  value: ActivityType;
  label: string;
  icon: string;
  description: string;
}

export const ACTIVITY_TYPES: ActivityTypeMeta[] = [
  { value: "text_lesson", label: "Text Lesson", icon: "📝", description: "Rich text content with headings, paragraphs, lists, tables, and callouts." },
  { value: "video", label: "Video", icon: "🎥", description: "Embedded video from YouTube, Vimeo, or other video hosting platform." },
  { value: "image", label: "Image", icon: "🖼️", description: "An image with optional caption and alt text." },
  { value: "downloadable_document", label: "Downloadable Document", icon: "📎", description: "A file students can download (DOC, DOCX, etc.)." },
  { value: "pdf", label: "PDF", icon: "📄", description: "A PDF document students can view or download." },
  { value: "powerpoint_resource_link", label: "PowerPoint / Resource Link", icon: "📊", description: "A slide deck or external resource link." },
  { value: "interactive_scenario", label: "Interactive Scenario", icon: "🎭", description: "A branching scenario students navigate through." },
  { value: "rise_decision_lab", label: "RISE Decision Lab", icon: "🔬", description: "An interactive Decision Lab with fields and prompts." },
  { value: "worksheet", label: "Worksheet", icon: "✏️", description: "A workbook activity with prompts for students to complete." },
  { value: "reflection", label: "Reflection", icon: "🤔", description: "A reflection prompt with a text response area." },
  { value: "discussion_prompt", label: "Discussion Prompt", icon: "💬", description: "A prompt for group or class discussion." },
  { value: "knowledge_check", label: "Knowledge Check", icon: "✅", description: "Quick check questions with immediate feedback." },
  { value: "quiz", label: "Quiz", icon: "🧪", description: "A graded quiz with multiple question types." },
  { value: "assignment", label: "Assignment", icon: "📌", description: "A graded assignment with submission requirements." },
  { value: "financial_blueprint_activity", label: "Financial Blueprint Activity", icon: "📋", description: "An activity that builds a section of the Financial Blueprint." },
  { value: "external_resource_link", label: "External Resource Link", icon: "🔗", description: "A link to an external website or resource." },
];

export function getActivityTypeMeta(value: ActivityType | string): ActivityTypeMeta {
  return ACTIVITY_TYPES.find((t) => t.value === value) ?? ACTIVITY_TYPES[0];
}

// ---------------------------------------------------------------------------
// Content Status
// ---------------------------------------------------------------------------
export type ContentStatus = "draft" | "published";

// ---------------------------------------------------------------------------
// CMS Module — extends the existing CourseModule with admin metadata
// ---------------------------------------------------------------------------
export interface CmsModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  estimatedTime: string;
  icon: string;
  themeColor: string;
  imageUrl: string | null;
  isPublished: boolean;
  prerequisiteModuleId: string | null;
  requiredCompletionPct: number;
  lessons: CmsLesson[];
  // Module-level activities (from existing CourseModule)
  keyTerms: KeyTerm[];
  realLifeScenario: RealLifeScenario;
  decisionLab: DecisionLab;
  workbookActivity: { title: string; instructions: string; prompts: string[] };
  knowledgeCheck: QuizQuestion[];
  reflection: ModuleReflection;
  actionCommitment: ActionCommitment;
  blueprintUpdate: BlueprintUpdate;
  // CMS metadata
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  status: ContentStatus;
}

// ---------------------------------------------------------------------------
// CMS Lesson — extends the existing Lesson with admin metadata
// ---------------------------------------------------------------------------
export interface CmsLesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  sortOrder: number;
  isRequired: boolean;
  isPublished: boolean;
  riseContentType: RiseContentType | null;
  content: ContentBlock[];
  instructorNotes: string | null;
  studentInstructions: string | null;
  activities: CmsActivity[];
  // CMS metadata
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  status: ContentStatus;
}

// ---------------------------------------------------------------------------
// CMS Activity — a learning activity within a lesson or module
// ---------------------------------------------------------------------------
export interface CmsActivity {
  id: string;
  lessonId: string | null;
  moduleId: string | null;
  title: string;
  activityType: ActivityType;
  riseContentType: RiseContentType | null;
  content: Record<string, unknown>;
  sortOrder: number;
  isPublished: boolean;
  instructorNotes: string | null;
  // CMS metadata
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  status: ContentStatus;
}

// ---------------------------------------------------------------------------
// Content Block types for the visual editor (extends existing ContentBlock)
// ---------------------------------------------------------------------------
export type ContentBlockType =
  | "heading"
  | "paragraph"
  | "list"
  | "table"
  | "callout"
  | "example"
  | "calculator"
  | "video"
  | "image"
  | "divider"
  | "definition";

export const CONTENT_BLOCK_TYPES: { type: ContentBlockType; label: string; icon: string }[] = [
  { type: "heading", label: "Heading", icon: "H" },
  { type: "paragraph", label: "Paragraph", icon: "¶" },
  { type: "list", label: "List", icon: "•" },
  { type: "table", label: "Table", icon: "⊞" },
  { type: "callout", label: "Callout Box", icon: "!" },
  { type: "example", label: "Example", icon: "★" },
  { type: "definition", label: "Definition", icon: "📖" },
  { type: "video", label: "Video", icon: "▶" },
  { type: "image", label: "Image", icon: "🖼" },
  { type: "divider", label: "Divider", icon: "—" },
];
