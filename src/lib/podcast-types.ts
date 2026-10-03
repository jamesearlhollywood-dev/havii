/**
 * James Hollywood III Studios — database entity types.
 * Mirrors supabase/migrations/202610030001_podcast_platform.sql
 */

export type ShowStatus = "draft" | "active" | "paused" | "archived";

export type EpisodeStatus =
  | "planned"
  | "idea"
  | "guest_outreach"
  | "scheduling"
  | "scheduled"
  | "recording"
  | "recorded"
  | "editing"
  | "review"
  | "ready_for_review"
  | "published"
  | "archived";

/**
 * Statuses exposed in the admin UI, in the order they appear in filters.
 * Legacy "planned"/"recording" are kept in the DB type for backward compat.
 */
export const EPISODE_STATUSES: EpisodeStatus[] = [
  "idea",
  "guest_outreach",
  "scheduling",
  "scheduled",
  "planned",
  "recorded",
  "editing",
  "review",
  "ready_for_review",
  "published",
  "archived",
];

/**
 * Ordered production-workflow stages shown as columns on the production board.
 */
export const PRODUCTION_STAGES: EpisodeStatus[] = [
  "idea",
  "guest_outreach",
  "scheduling",
  "scheduled",
  "recorded",
  "editing",
  "review",
  "ready_for_review",
  "published",
];

/**
 * Maps a stored episode status onto one of the production-board stages.
 * Legacy/terminal statuses fall back to the nearest stage.
 */
export function stageForEpisode(status: EpisodeStatus): EpisodeStatus {
  switch (status) {
    case "planned":
    case "recording":
      return "idea";
    default:
      return PRODUCTION_STAGES.includes(status) ? status : "idea";
  }
}

export type GuestBookingStatus =
  | "prospect"
  | "invited"
  | "interested"
  | "scheduling"
  | "confirmed"
  | "recorded"
  | "published"
  | "declined"
  | "archived"
  | "tentative"; // legacy

export const GUEST_BOOKING_STATUSES: GuestBookingStatus[] = [
  "prospect",
  "invited",
  "interested",
  "scheduling",
  "confirmed",
  "recorded",
  "published",
  "declined",
  "archived",
];

export type ProductionTaskStatus =
  | "not_started"
  | "in_progress"
  | "waiting"
  | "completed"
  | "cancelled"
  | "blocked"; // legacy

export const PRODUCTION_TASK_STATUSES: ProductionTaskStatus[] = [
  "not_started",
  "in_progress",
  "waiting",
  "completed",
  "cancelled",
];

/** Tasks considered "done" for completion-percentage calculations. */
export const TASK_DONE_STATUSES: ProductionTaskStatus[] = ["completed", "cancelled"];

export type SponsorshipLevel =
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "in_kind";

export type SponsorshipStatus =
  | "prospect"
  | "negotiating"
  | "active"
  | "expired"
  | "declined";

export type ContactMessageStatus = "new" | "read" | "archived" | "responded";

export type ContactInquiryType =
  | "general"
  | "booking"
  | "sponsorship"
  | "press"
  | "feedback"
  | "partnership";

export interface Show {
  id: string;
  show_name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  host_name: string | null;
  category: string | null;
  status: ShowStatus;
  spotify_url: string | null;
  apple_podcast_url: string | null;
  youtube_url: string | null;
  rss_feed_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  show_id: string;
  episode_number: number | null;
  season_number: number | null;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  audio_url: string | null;
  video_url: string | null;
  transcript: string | null;
  show_notes: string | null;
  guest_id: string | null;
  episode_status: EpisodeStatus;
  recording_date: string | null;
  publish_date: string | null;
  duration: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Episode enriched with related show + guest data (for table rows, cards, etc.).
 */
export interface EpisodeWithShow extends Episode {
  show: { show_name: string; slug: string; category: string | null } | null;
  guest: {
    id: string;
    first_name: string;
    last_name: string | null;
    professional_title: string | null;
    organization: string | null;
    biography: string | null;
    headshot: string | null;
    website: string | null;
    linkedin_url: string | null;
    booking_status: GuestBookingStatus;
  } | null;
}

export interface Guest {
  id: string;
  first_name: string;
  last_name: string | null;
  professional_title: string | null;
  organization: string | null;
  biography: string | null;
  headshot: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  booking_status: GuestBookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductionTask {
  id: string;
  episode_id: string | null;
  task_name: string;
  assigned_to: string | null;
  status: ProductionTaskStatus;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Production task enriched with its parent episode title/show (for the board).
 */
export interface ProductionTaskWithEpisode extends ProductionTask {
  episode: {
    id: string;
    title: string;
    show_name: string | null;
  } | null;
}

/**
 * Guest enriched with cross-cutting stats used by the admin table/cards.
 */
export interface GuestWithStats extends Guest {
  episode_count: number;
  next_recording_date: string | null;
  next_recording_title: string | null;
}

/**
 * Guest with the episodes they appear on, split into upcoming/past for the
 * admin profile page.
 */
export interface GuestWithRelations extends GuestWithStats {
  episodes: EpisodeWithShow[];
  upcoming: EpisodeWithShow[];
  past: EpisodeWithShow[];
}

/** Common production tasks offered as one-click suggestions (never required). */
export const SUGGESTED_TASKS: string[] = [
  "Research Guest",
  "Prepare Interview Questions",
  "Confirm Recording",
  "Record Episode",
  "Edit Audio",
  "Edit Video",
  "Write Show Notes",
  "Prepare Transcript",
  "Create Episode Artwork",
  "Guest Approval",
  "Final Review",
  "Schedule Publication",
  "Create Social Media Assets",
];

export interface Sponsor {
  id: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  logo: string | null;
  sponsorship_level: SponsorshipLevel;
  sponsorship_status: SponsorshipStatus;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: ContactInquiryType;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
}

export const SHOW_STATUS_LABELS: Record<ShowStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  archived: "Archived",
};

export const SHOW_STATUSES: ShowStatus[] = ["draft", "active", "paused", "archived"];

export const SHOW_CATEGORIES = [
  "Faith",
  "Leadership",
  "Personal Development",
  "Community",
  "Education",
  "Business",
  "Culture",
  "Interviews",
  "Social Impact",
  "Faith / Personal Development",
] as const;

export const EPISODE_STATUS_LABELS: Record<EpisodeStatus, string> = {
  planned: "Draft",
  idea: "Idea",
  guest_outreach: "Guest Outreach",
  scheduling: "Scheduling",
  scheduled: "Scheduled",
  recording: "Recording",
  recorded: "Recorded",
  editing: "Editing",
  review: "Review",
  ready_for_review: "Ready to Publish",
  published: "Published",
  archived: "Archived",
};

/** Production-board column labels (shortened for compact columns). */
export const PRODUCTION_STAGE_LABELS: Record<string, string> = {
  idea: "Idea",
  guest_outreach: "Outreach",
  scheduling: "Scheduling",
  scheduled: "Scheduled",
  recorded: "Recorded",
  editing: "Editing",
  review: "Review",
  ready_for_review: "Ready",
  published: "Published",
};

export const GUEST_BOOKING_LABELS: Record<GuestBookingStatus, string> = {
  prospect: "Prospect",
  invited: "Invited",
  interested: "Interested",
  scheduling: "Scheduling",
  confirmed: "Confirmed",
  recorded: "Recorded",
  published: "Published",
  declined: "Declined",
  archived: "Archived",
  tentative: "Tentative",
};

export const PRODUCTION_TASK_LABELS: Record<ProductionTaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  waiting: "Waiting",
  completed: "Complete",
  cancelled: "Cancelled",
  blocked: "Blocked",
};

export const SPONSORSHIP_LEVEL_LABELS: Record<SponsorshipLevel, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  in_kind: "In-kind",
};

export const SPONSORSHIP_STATUS_LABELS: Record<SponsorshipStatus, string> = {
  prospect: "Prospect",
  negotiating: "Negotiating",
  active: "Active",
  expired: "Expired",
  declined: "Declined",
};

export const CONTACT_MESSAGE_LABELS: Record<ContactMessageStatus, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
  responded: "Responded",
};

export const CONTACT_INQUIRY_LABELS: Record<ContactInquiryType, string> = {
  general: "General",
  booking: "Booking",
  sponsorship: "Sponsorship",
  press: "Press",
  feedback: "Feedback",
  partnership: "Partnership",
};
