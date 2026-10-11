import type { Profile } from "./types";

export function displayName(profile: Profile | null | undefined): string {
  if (!profile) return "there";
  return profile.preferred_name || profile.first_name || "there";
}

export function fullName(profile: Profile | null | undefined): string {
  if (!profile) return "";
  return [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "there";
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function initials(profile: Profile | null | undefined): string {
  if (!profile) return "?";
  const first = profile.first_name?.[0] ?? "";
  const last = profile.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || profile.preferred_name?.[0]?.toUpperCase() || "?";
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const random2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RISE-${year}-${random}${random2}`;
}
