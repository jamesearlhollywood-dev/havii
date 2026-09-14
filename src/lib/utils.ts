import type { Profile } from "@/lib/types";

export function displayName(profile: Profile | null | undefined): string {
  if (!profile) return "there";
  return profile.preferred_name || profile.first_name || "there";
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
