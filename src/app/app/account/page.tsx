import { redirect } from "next/navigation";
import { getAccessLevel } from "@/lib/session";
import { AccountForm } from "@/components/account/AccountForm";

export default async function AccountPage() {
  const { level, profile } = await getAccessLevel();
  if (!profile) redirect("/auth/login");

  // Generate timezone list server-side (Node 22 supports this)
  const allTimezones = Intl.supportedValuesOf("timeZone").sort();
  // Ensure the user's current timezone is in the list
  const timezones = allTimezones.includes(profile.timezone)
    ? allTimezones
    : [profile.timezone, ...allTimezones];

  return (
    <AccountForm
      preferredName={profile.preferred_name}
      timezone={profile.timezone}
      dateOfBirth={profile.date_of_birth || "1900-01-01"}
      timezones={timezones}
    />
  );
}
