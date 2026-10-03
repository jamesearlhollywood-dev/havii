/**
 * James Hollywood III Studios — database entity types.
 * Mirrors supabase/migrations/202610030001_podcast_platform.sql
 */

export type ShowStatus = "draft" | "active" | "paused" | "archived";

export type EpisodeStatus =
  | "planned"
  | "recording"
  | "editing"
  | "scheduled"
  | "published"
  | "archived";

export type GuestBookingStatus =
  | "invited"
  | "confirmed"
  | "recorded"
  | "declined"
  | "tentative";

export type ProductionTaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "completed";

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
  planned: "Planned",
  recording: "Recording",
  editing: "Editing",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

export const GUEST_BOOKING_LABELS: Record<GuestBookingStatus, string> = {
  invited: "Invited",
  confirmed: "Confirmed",
  recorded: "Recorded",
  declined: "Declined",
  tentative: "Tentative",
};

export const PRODUCTION_TASK_LABELS: Record<ProductionTaskStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  completed: "Completed",
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
