export type UserRole =
  | "youth"
  | "mentor"
  | "caregiver"
  | "staff"
  | "administrator"
  | "community_partner";

export const PUBLIC_SIGNUP_ROLES: UserRole[] = [
  "youth",
  "mentor",
  "caregiver",
  "community_partner",
];

export const STAFF_ROLES: UserRole[] = ["staff", "administrator"];

export type AccountStatus = "active" | "inactive" | "suspended" | "pending";

export type MentorApplicationStatus =
  | "application_not_started"
  | "pending_application"
  | "submitted"
  | "under_review"
  | "approved"
  | "declined"
  | "withdrawn";

export type ScreeningStatus =
  | "not_started"
  | "in_progress"
  | "pending_review"
  | "cleared"
  | "not_cleared";

export type TrainingStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "expired";

export type PartnerReviewStatus =
  | "pending_review"
  | "approved"
  | "declined"
  | "needs_more_info";

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  date_of_birth: string | null;
  role: UserRole;
  pronouns: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  profile_photo_url: string | null;
  onboarding_completed: boolean;
  account_status: AccountStatus;
  consent_accepted_at: string | null;
  caregiver_consent_status: "not_required" | "pending" | "provided" | "declined";
  created_at: string;
  updated_at: string;
}

export interface YouthProfile {
  id: string;
  profile_id: string;
  interests: string[] | null;
  help_areas: string[] | null;
  mentorship_interested: boolean | null;
  location_general: string | null;
  school_or_program: string | null;
  goals_summary: string | null;
  availability_notes: string | null;
  caregiver_name: string | null;
  caregiver_email: string | null;
  caregiver_relationship: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmotionalCheckIn {
  id: string;
  profile_id: string;
  mood: string | null;
  mood_level: number | null;
  notes: string | null;
  created_at: string;
}

export interface Goal {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  status: string;
  target_date: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  profile_id: string;
  title: string | null;
  body: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionInfo {
  id: string;
  cohort_id: string | null;
  title: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
}

export const MOOD_LEVELS: { level: number; label: string; emoji: string }[] = [
  { level: 5, label: "Great", emoji: "😊" },
  { level: 4, label: "Good", emoji: "🙂" },
  { level: 3, label: "Okay", emoji: "😐" },
  { level: 2, label: "Low", emoji: "😔" },
  { level: 1, label: "Struggling", emoji: "😣" },
];

export const MOOD_LABELS: Record<number, string> = {
  5: "great",
  4: "good",
  3: "okay",
  2: "low",
  1: "struggling",
};

export interface MentorProfile {
  id: string;
  profile_id: string;
  profession: string | null;
  background_summary: string | null;
  mentoring_interests: string[] | null;
  support_areas: string[] | null;
  location_general: string | null;
  availability_notes: string | null;
  years_experience: number | null;
  application_status: MentorApplicationStatus;
  screening_status: ScreeningStatus;
  training_status: TrainingStatus;
  created_at: string;
  updated_at: string;
}

export interface CaregiverProfile {
  id: string;
  profile_id: string;
  relationship_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerProfile {
  id: string;
  profile_id: string;
  organization_name: string | null;
  title_role: string | null;
  contact_email: string | null;
  reason_for_use: string | null;
  review_status: PartnerReviewStatus;
  created_at: string;
  updated_at: string;
}

export const HELP_AREAS = [
  "school",
  "college",
  "career",
  "leadership",
  "confidence",
  "life_skills",
  "emotional_wellness",
  "relationships",
  "community",
  "other",
] as const;

export type HelpArea = (typeof HELP_AREAS)[number];

export const HELP_AREA_LABELS: Record<HelpArea, string> = {
  school: "School",
  college: "College",
  career: "Career",
  leadership: "Leadership",
  confidence: "Confidence",
  life_skills: "Life skills",
  emotional_wellness: "Emotional wellness",
  relationships: "Relationships",
  community: "Community",
  other: "Other",
};

export const INTEREST_OPTIONS = [
  "sports",
  "arts",
  "music",
  "technology",
  "gaming",
  "reading",
  "outdoors",
  "volunteering",
  "entrepreneurship",
  "faith_spirituality",
  "science",
  "cooking",
  "fashion",
  "other",
] as const;
