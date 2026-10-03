import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { isStaffOrAdmin } from "@/lib/roles";
import { displayName } from "@/lib/utils";
import { AdminShell } from "@/components/layout/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: Awaited<ReturnType<typeof getCurrentUserAndProfile>>["user"];
  let profile: Awaited<ReturnType<typeof getCurrentUserAndProfile>>["profile"];

  try {
    ({ user, profile } = await getCurrentUserAndProfile());
  } catch {
    // Supabase isn't configured yet — send to the sign-in page rather than
    // surfacing a 500. Auth becomes functional once real credentials are set.
    redirect("/auth/login?next=/admin");
  }

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  if (profile && !isStaffOrAdmin(profile.role)) {
    redirect("/forbidden");
  }

  const name = displayName(profile);

  return (
    <AdminShell name={name} role={profile?.role ?? "staff"}>
      {children}
    </AdminShell>
  );
}
