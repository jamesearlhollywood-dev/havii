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
  GuestWithStats,
  GuestWithRelations,
  ProductionTask,
  ProductionTaskWithEpisode,
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
  guest:guests(id, first_name, last_name, professional_title, organization, biography, headshot, website, linkedin_url, booking_status)
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

// ---------------------------------------------------------------------------
// Guests with cross-cutting stats (admin table + profile)
// ---------------------------------------------------------------------------

const GUEST_EPISODE_SELECT = `
  id, title, slug, episode_status, episode_number, season_number,
  short_description, cover_image, publish_date, recording_date, duration,
  show:shows!inner(show_name, slug, category),
  guest:guests(id, first_name, last_name, professional_title, organization, biography, headshot, website, linkedin_url, booking_status)
`;

/**
 * All guests enriched with episode count + next scheduled recording date.
 * Used by the admin Guests table.
 */
export async function getGuestsWithStats(): Promise<GuestWithStats[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("guests")
    .select("*")
    .order("updated_at", { ascending: false });
  const guests = (data ?? []) as Guest[];
  if (guests.length === 0) return [];

  // One query for episode counts per guest.
  const { data: epRows } = await supabase
    .from("episodes")
    .select("guest_id, id, title, recording_date, episode_status")
    .not("guest_id", "is", null);
  const byGuest = new Map<string, { count: number; next: Episode | null }>();
  for (const row of (epRows ?? []) as Array<
    Pick<Episode, "guest_id" | "id" | "title" | "recording_date" | "episode_status">
  >) {
    if (!row.guest_id) continue;
    const entry = byGuest.get(row.guest_id) ?? { count: 0, next: null as Episode | null };
    entry.count += 1;
    // "next" recording = earliest upcoming recording_date in the future.
    if (
      row.recording_date &&
      new Date(row.recording_date).getTime() >= Date.now() &&
      (!entry.next ||
        (entry.next.recording_date &&
          new Date(row.recording_date).getTime() <
            new Date(entry.next.recording_date as string).getTime()))
    ) {
      entry.next = row as Episode;
    }
    byGuest.set(row.guest_id, entry);
  }

  return guests.map((g) => {
    const entry = byGuest.get(g.id);
    return {
      ...g,
      episode_count: entry?.count ?? 0,
      next_recording_date: entry?.next?.recording_date ?? null,
      next_recording_title: entry?.next?.title ?? null,
    };
  });
}

/**
 * Single guest with all episodes split into upcoming/past, plus stats.
 * Used by the admin guest profile page.
 */
export async function getGuestWithRelations(
  id: string
): Promise<GuestWithRelations | null> {
  const supabase = await getClient();
  if (!supabase) return null;
  const { data: guest } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!guest) return null;

  const { data: epData } = await supabase
    .from("episodes")
    .select(GUEST_EPISODE_SELECT)
    .eq("guest_id", id)
    .order("recording_date", { ascending: false, nullsFirst: false });

  const episodes = (epData ?? []).map((r) => r as unknown as EpisodeWithShow);

  const now = Date.now();
  const upcoming = episodes.filter(
    (e) => e.recording_date && new Date(e.recording_date).getTime() >= now
  );
  const past = episodes.filter(
    (e) => !e.recording_date || new Date(e.recording_date).getTime() < now
  );

  return {
    ...(guest as Guest),
    episode_count: episodes.length,
    next_recording_date: upcoming[0]?.recording_date ?? null,
    next_recording_title: upcoming[0]?.title ?? null,
    episodes,
    upcoming,
    past,
  };
}

// ---------------------------------------------------------------------------
// Public guest profiles (only guests with ≥1 published episode)
// ---------------------------------------------------------------------------

export async function getPublicGuestById(
  id: string
): Promise<{ guest: Guest; episodes: EpisodeWithShow[] } | null> {
  const supabase = await getClient();
  if (!supabase) return null;
  const { data: guest } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!guest) return null;

  const { data } = await supabase
    .from("episodes")
    .select(GUEST_EPISODE_SELECT)
    .eq("guest_id", id)
    .eq("episode_status", "published")
    .order("publish_date", { ascending: false, nullsFirst: false });
  const episodes = (data ?? []).map((r) => r as unknown as EpisodeWithShow);
  if (episodes.length === 0) return null; // not public without a published episode

  return { guest: guest as Guest, episodes };
}

/** Public directory: guests who appear on at least one published episode. */
export async function getPublicGuests(): Promise<GuestWithStats[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  // Find guest ids that have published episodes.
  const { data: pubEp } = await supabase
    .from("episodes")
    .select("guest_id")
    .eq("episode_status", "published")
    .not("guest_id", "is", null);
  const ids = Array.from(
    new Set((pubEp ?? []).map((r) => (r as { guest_id: string }).guest_id))
  );
  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("guests")
    .select("*")
    .in("id", ids)
    .order("first_name", { ascending: true });
  const guests = (data ?? []) as Guest[];

  // Published-episode counts only.
  const { data: countRows } = await supabase
    .from("episodes")
    .select("guest_id")
    .eq("episode_status", "published")
    .not("guest_id", "is", null);
  const counts = new Map<string, number>();
  for (const r of (countRows ?? []) as Array<{ guest_id: string }>) {
    counts.set(r.guest_id, (counts.get(r.guest_id) ?? 0) + 1);
  }

  return guests.map((g) => ({
    ...g,
    episode_count: counts.get(g.id) ?? 0,
    next_recording_date: null,
    next_recording_title: null,
  }));
}

// ---------------------------------------------------------------------------
// Production tasks
// ---------------------------------------------------------------------------

const TASK_EPISODE_SELECT = `
  *,
  episode:episodes(id, title, show:shows(show_name))
`;

export async function getAllProductionTasks(): Promise<ProductionTaskWithEpisode[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("production_tasks")
    .select(TASK_EPISODE_SELECT)
    .order("due_date", { ascending: true, nullsFirst: false });
  return (data ?? []).map((r) => {
    const row = r as Record<string, unknown>;
    const ep = row.episode as
      | { id: string; title: string; show: { show_name: string | null } | null }
      | null;
    return {
      ...(row as unknown as ProductionTask),
      episode: ep
        ? { id: ep.id, title: ep.title, show_name: ep.show?.show_name ?? null }
        : null,
    };
  });
}

export async function getProductionTasksByEpisode(
  episodeId: string
): Promise<ProductionTask[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("production_tasks")
    .select("*")
    .eq("episode_id", episodeId)
    .order("created_at", { ascending: true });
  return (data ?? []) as ProductionTask[];
}

// ---------------------------------------------------------------------------
// Upcoming recordings (admin dashboard)
// ---------------------------------------------------------------------------

export interface UpcomingRecording {
  id: string;
  title: string;
  showName: string | null;
  recordingDate: string | null;
  episodeStatus: string;
  guestName: string | null;
}

export async function getUpcomingRecordings(
  limit = 6
): Promise<UpcomingRecording[]> {
  const supabase = await getClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("episodes")
    .select(`
      id, title, recording_date, episode_status,
      show:shows!inner(show_name),
      guest:guests(first_name, last_name)
    `)
    .not("recording_date", "is", null)
    .gte("recording_date", new Date().toISOString())
    .neq("episode_status", "archived")
    .order("recording_date", { ascending: true })
    .limit(limit);

  return ((data ?? []) as unknown as Array<{
    id: string;
    title: string;
    recording_date: string | null;
    episode_status: string;
    show: { show_name: string } | null;
    guest: { first_name: string; last_name: string | null } | null;
  }>).map((r) => ({
    id: r.id,
    title: r.title,
    showName: r.show?.show_name ?? null,
    recordingDate: r.recording_date,
    episodeStatus: r.episode_status,
    guestName: r.guest
      ? [r.guest.first_name, r.guest.last_name].filter(Boolean).join(" ") || null
      : null,
  }));
}

/**
 * Schedule events derived from episode recording_date + publish_date.
 * Optionally filtered by show and event type.
 */
export interface ScheduleEvent {
  id: string;
  title: string;
  type: "recording" | "publication";
  date: string;
  showName: string | null;
  episodeId: string;
  guestName: string | null;
}

export async function getScheduleEvents(opts?: {
  showId?: string;
  type?: "recording" | "publication" | "all";
}): Promise<ScheduleEvent[]> {
  const supabase = await getClient();
  if (!supabase) return [];

  let q = supabase
    .from("episodes")
    .select(`
      id, title, recording_date, publish_date, episode_status,
      show:shows!inner(show_name),
      guest:guests(first_name, last_name)
    `)
    .neq("episode_status", "archived");

  if (opts?.showId) q = q.eq("show_id", opts.showId);

  const { data } = await q;
  const rows = (data ?? []) as unknown as Array<{
    id: string;
    title: string;
    recording_date: string | null;
    publish_date: string | null;
    episode_status: string;
    show: { show_name: string } | null;
    guest: { first_name: string; last_name: string | null } | null;
  }>;

  const events: ScheduleEvent[] = [];
  for (const r of rows) {
    const guestName = r.guest
      ? [r.guest.first_name, r.guest.last_name].filter(Boolean).join(" ") || null
      : null;
    if (r.recording_date && opts?.type !== "publication") {
      events.push({
        id: `${r.id}-rec`,
        title: r.title,
        type: "recording",
        date: r.recording_date,
        showName: r.show?.show_name ?? null,
        episodeId: r.id,
        guestName,
      });
    }
    if (r.publish_date && opts?.type !== "recording") {
      events.push({
        id: `${r.id}-pub`,
        title: r.title,
        type: "publication",
        date: r.publish_date,
        showName: r.show?.show_name ?? null,
        episodeId: r.id,
        guestName,
      });
    }
  }
  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
