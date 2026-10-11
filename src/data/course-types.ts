// ============================================================================
// RISE USA — Course Content Type Definitions
// ============================================================================

export interface ContentBlock {
  type: "heading" | "paragraph" | "list" | "table" | "callout" | "example" | "calculator" | "video" | "image" | "divider";
  text?: string;
  level?: number; // for headings
  items?: string[]; // for lists
  headers?: string[]; // for tables
  rows?: string[][]; // for tables
  calloutType?: "info" | "warning" | "tip" | "success";
  videoUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  calculatorType?: string; // identifier for interactive calculator
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  isRequired: boolean;
  isEnrichment: boolean;
  content: ContentBlock[];
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface RealLifeScenario {
  title: string;
  setup: string;
  situation: string;
  prompt: string;
}

export interface DecisionLabOption {
  id: string;
  label: string;
  description: string;
}

export interface DecisionLabField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "radio" | "checkbox" | "calculated" | "table" | "slider";
  description?: string;
  options?: DecisionLabOption[];
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface DecisionLab {
  id: string;
  title: string;
  subtitle: string;
  instructions: string;
  fields: DecisionLabField[];
  resultPrompt: string;
}

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "multiple_select" | "true_false" | "matching" | "scenario";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  matches?: { left: string; right: string }[];
  explanation?: string;
}

export interface ModuleReflection {
  prompt: string;
  placeholder: string;
}

export interface ActionCommitment {
  prompt: string;
  placeholder: string;
}

export interface BlueprintUpdate {
  sectionKey: string;
  sectionTitle: string;
  prompt: string;
  fields: { id: string; label: string; type: "text" | "number" | "textarea"; placeholder?: string }[];
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  estimatedTime: string;
  icon: string; // emoji or icon identifier
  themeColor: string;
  overview: string;
  objectives: string[];
  lessons: Lesson[];
  keyTerms: KeyTerm[];
  realLifeScenario: RealLifeScenario;
  decisionLab: DecisionLab;
  workbookActivity: { title: string; instructions: string; prompts: string[] };
  knowledgeCheck: QuizQuestion[];
  reflection: ModuleReflection;
  actionCommitment: ActionCommitment;
  blueprintUpdate: BlueprintUpdate;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  brandMessage: string;
  philosophy: string;
  modules: CourseModule[];
}
