/**
 * Podcast data-access helpers.
 * All functions return null/empty arrays on error so pages render
 * professional empty states instead of crashing.
 */

import { createClient } from "@/lib/supabase/server";
import type {
  Show,
  Episode,
  EpisodeWithShow,
  Guest,
  Sponsor,
  ContactMessage,
} from "@/lib/podcast-types";

/** Returns a Supabase client, or null when credentials are invalid/missing. */
async function getClient() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Dashboard aggregates
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalShows: number;
  totalEpisodes: number;
  publishedEpisodes: number;
  scheduledEpisodes: number;
  draftEpisodes: number;
  totalGuests: number;
  activeSponsors: number;
  unreadMessages: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await getClient();
  if (!supabase) return emptyStats();

  const [shows, episodes, guests, sponsors, messages] = await Promise.all([
    supabase.from("shows").select("id", { count: "exact", head: true }),
    supabase.from("episodes").select("id, episode_status", { count: "exact" }),
    supabase.from("guests").select("id", { count: "exact", head: true }),
    supabase
      .from("sponsors")
      .select("id", { count: "exact", head: true })
      .eq("sponsorship_status", "active"),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const epRows = (episodes.data ?? []) as Pick<Episode, "id" | "episode_status">[];
  return {
    totalShows: shows.count ?? 0,
    totalEpisodes: episodes.count ?? 0,
    publishedEpisodes: epRows.filter((e) => e.episode_status === "published").length,
    scheduledEpisodes: epRows.filter((e) => e.episode_status === "scheduled").length,
    draftEpisodes: epRows.filter((e) => e.episode_status === "planned").length,
    totalGuests: guests.count ?? 0,
    activeSponsors: sponsors.count ?? 0,
    unreadMessages: messages.count ?? 0,
  };
}

function emptyStats(): DashboardStats {
  return {
    totalShows: 0,
    totalEpisodes: 0,
    publishedEpisodes: 0,
    scheduledEpisodes: 0,
    draftEpisodes: 0,
    totalGuests: 0,
    activeSponsors: 0,
    unreadMessages: 0,
  };
}

// ---------------------------------------------------------------------------
// Recent activity
// ---------------------------------------------------------------------------

export interface RecentActivity {
  recentEpisodes: Episode[];
  recentShows: Show[];
  recentGuests: Guest[];
  recentMessages: ContactMessage[];
}

export async function getRecentActivity(): Promise<RecentActivity> {
  const supabase = await getClient();
  if (!supabase)
    return { recentEpisodes: [], recentShows: [], recentGuests: [], recentMessages: [] };

  const [episodes, shows, guests, messages] = await Promise.all([
    supabase
      .from("episodes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("shows")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    recentEpisodes: (episodes.data ?? []) as Episode[],
    recentShows: (shows.data ?? []) as Show[],
    recentGuests: (guests.data ?? []) as Guest[],
    recentMessages: (messages.data ?? []) as ContactMessage[],
  };
}

// ---------------------------------------------------------------------------
// Upcoming schedule
// ---------------------------------------------------------------------------

export interface ScheduleItem {
  id: string;
  title: string;
  type: "recording" | "publish";
  date: string | null;
  showName?: string | null;
}

export async function getUpcomingSchedule(): Promise<ScheduleItem[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("episodes")
    .select(`
      id, title, recording_date, publish_date,
      show:shows!inner(show_name)
    `)
    .or(
      `recording_date.gte.${new Date().toISOString()},publish_date.gte.${new Date().toISOString()}`
    )
    .order("recording_date", { ascending: true })
    .limit(10);

  const rows = (data ?? []) as unknown as Array<
    Pick<Episode, "id" | "title" | "recording_date" | "publish_date"> & {
      show: { show_name: string } | null;
    }
  >;

  const items: ScheduleItem[] = [];
  for (const r of rows) {
    if (r.recording_date) {
      items.push({
        id: `${r.id}-rec`,
        title: r.title,
        type: "recording",
        date: r.recording_date,
        showName: r.show?.show_name ?? null,
      });
    }
    if (r.publish_date) {
      items.push({
        id: `${r.id}-pub`,
        title: r.title,
        type: "publish",
        date: r.publish_date,
        showName: r.show?.show_name ?? null,
      });
    }
  }
  return items.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : Infinity;
    const db = b.date ? new Date(b.date).getTime() : Infinity;
    return da - db;
  });
}

// ---------------------------------------------------------------------------
// Shows
// ---------------------------------------------------------------------------

export async function getAllShows(): Promise<Show[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("shows")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []) as Show[];
}

export async function getShowById(id: string): Promise<Show | null> {
  const supabase = await getClient();
  if (!supabase) return null;
  const { data } = await supabase.from("shows").select("*").eq("id", id).maybeSingle();
  return data as Show | null;
}

export async function getShowBySlug(slug: string): Promise<Show | null> {
  const supabase = await getClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("shows")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data as Show | null;
}

export async function getPublicShows(): Promise<Show[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("shows")
    .select("*")
    .eq("status", "active")
    .order("show_name", { ascending: true });
  return (data ?? []) as Show[];
}

// ---------------------------------------------------------------------------
// Episodes for a show
// ---------------------------------------------------------------------------

export async function getPublishedEpisodesByShow(showId: string): Promise<EpisodeWithShow[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .eq("show_id", showId)
    .eq("episode_status", "published")
    .order("publish_date", { ascending: false, nullsFirst: false });
  return (data ?? []).map(mapEpisodeWithShow);
}

export async function getEpisodeCountByShow(showId: string): Promise<number> {
  const supabase = await getClient();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("episodes")
    .select("id", { count: "exact", head: true })
    .eq("show_id", showId);
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Episodes (admin + public)
// ---------------------------------------------------------------------------

const EPISODE_RELATION_SELECT = `
  *,
  show:shows!inner(show_name, slug, category),
  guest:guests(id, first_name, last_name, professional_title, organization, biography, headshot, website, linkedin_url)
`;

function mapEpisodeWithShow(row: Record<string, unknown>): EpisodeWithShow {
  return row as unknown as EpisodeWithShow;
}

/** Admin: all episodes with show + guest relations, newest first. */
export async function getAllEpisodes(): Promise<EpisodeWithShow[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .order("updated_at", { ascending: false });
  return (data ?? []).map(mapEpisodeWithShow);
}

/** Admin: single episode by ID (any status) with show + guest. */
export async function getEpisodeById(id: string): Promise<EpisodeWithShow | null> {
  const supabase = await getClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .eq("id", id)
    .maybeSingle();
  return data ? mapEpisodeWithShow(data) : null;
}

/** Public: single published episode by show slug + episode slug. */
export async function getPublishedEpisodeBySlug(
  showSlug: string,
  episodeSlug: string
): Promise<EpisodeWithShow | null> {
  const supabase = await getClient();
  if (!supabase) return null;

  // Verify the show exists and is active, then fetch the published episode.
  const { data: show } = await supabase
    .from("shows")
    .select("id")
    .eq("slug", showSlug)
    .eq("status", "active")
    .maybeSingle();
  if (!show) return null;

  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .eq("show_id", show.id)
    .eq("slug", episodeSlug)
    .eq("episode_status", "published")
    .maybeSingle();
  return data ? mapEpisodeWithShow(data) : null;
}

/** Public: all published episodes with show + guest, newest publish date first. */
export async function getPublishedEpisodes(): Promise<EpisodeWithShow[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .eq("episode_status", "published")
    .order("publish_date", { ascending: false, nullsFirst: false });
  return (data ?? []).map(mapEpisodeWithShow);
}

/** Public: featured published episodes with show + guest. */
export async function getFeaturedEpisodes(): Promise<EpisodeWithShow[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .eq("episode_status", "published")
    .eq("featured", true)
    .order("publish_date", { ascending: false, nullsFirst: false })
    .limit(6);
  return (data ?? []).map(mapEpisodeWithShow);
}

/** Public: related published episodes from the same show (excluding one). */
export async function getRelatedEpisodes(
  showId: string,
  excludeId: string,
  limit = 4
): Promise<EpisodeWithShow[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .eq("show_id", showId)
    .eq("episode_status", "published")
    .neq("id", excludeId)
    .order("publish_date", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data ?? []).map(mapEpisodeWithShow);
}

export interface EpisodeSearchFilters {
  showId?: string;
  guestId?: string;
  category?: string;
}

/** Public: search published episodes by query text + filters. */
export async function searchPublishedEpisodes(
  query: string,
  filters: EpisodeSearchFilters = {}
): Promise<EpisodeWithShow[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  let q = supabase
    .from("episodes")
    .select(EPISODE_RELATION_SELECT)
    .eq("episode_status", "published");

  if (filters.showId) q = q.eq("show_id", filters.showId);
  if (filters.guestId) q = q.eq("guest_id", filters.guestId);

  // Category lives on the shows table — resolve matching show IDs first.
  if (filters.category) {
    const { data: catShows } = await supabase
      .from("shows")
      .select("id")
      .eq("category", filters.category)
      .eq("status", "active");
    const catIds = (catShows ?? []).map((s) => s.id);
    if (catIds.length === 0) return [];
    q = q.in("show_id", catIds);
  }

  // Full-text search across title + short_description + show_notes + transcript
  const term = query.trim();
  if (term) {
    q = q.or(
      `title.ilike.%${term}%,short_description.ilike.%${term}%,show_notes.ilike.%${term}%,transcript.ilike.%${term}%`
    );
  }

  q = q.order("publish_date", { ascending: false, nullsFirst: false });
  const { data } = await q;
  return (data ?? []).map(mapEpisodeWithShow);
}

// ---------------------------------------------------------------------------
// Guests (for episode form select + public info)
// ---------------------------------------------------------------------------

export async function getAllGuests(): Promise<Guest[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("guests")
    .select("*")
    .order("first_name", { ascending: true });
  return (data ?? []) as Guest[];
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const supabase = await getClient();
  if (!supabase) return null;
  const { data } = await supabase.from("guests").select("*").eq("id", id).maybeSingle();
  return data as Guest | null;
}
