import Link from "next/link";
import {
  Card,
  CardDescription,
  CardTitle,
  ComingNextBadge,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type {
  EmotionalCheckIn,
  Goal,
  JournalEntry,
  MentorProfile,
  PartnerProfile,
  Profile,
  SessionInfo,
  YouthProfile,
} from "@/lib/types";
import { displayName } from "@/lib/utils";
import { MoodCheckIn } from "@/components/dashboards/youth/MoodCheckIn";
import { GoalsWidget } from "@/components/dashboards/youth/GoalsWidget";
import { JournalWidget } from "@/components/dashboards/youth/JournalWidget";
import { SessionsWidget } from "@/components/dashboards/youth/SessionsWidget";
import { MentorConnection } from "@/components/dashboards/youth/MentorConnection";

function PlaceholderCard({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between gap-2">
        <CardTitle>{title}</CardTitle>
        <ComingNextBadge />
      </div>
      <CardDescription className="flex-1">{description}</CardDescription>
      {href && cta ? (
        <div className="mt-4">
          <Link href={href}>
            <Button variant="outline" size="sm">
              {cta}
            </Button>
          </Link>
        </div>
      ) : null}
    </Card>
  );
}

export function YouthDashboard({
  profile,
  youth,
  todayCheckIn,
  goals,
  journalEntries,
  sessions,
  hasMatch,
}: {
  profile: Profile;
  youth: YouthProfile | null;
  todayCheckIn: EmotionalCheckIn | null;
  goals: Goal[];
  journalEntries: JournalEntry[];
  sessions: SessionInfo[];
  hasMatch: boolean;
}) {
  const name = displayName(profile);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-havii-ink">
          Welcome, {name}
        </h1>
        <p className="mt-1 text-sm text-havii-muted">
          A calm place to connect, grow, and find support.
        </p>
      </div>

      {/* Mood check-in — featured at top */}
      <Card>
        <CardTitle className="text-base mb-3">How are you feeling?</CardTitle>
        <MoodCheckIn todayCheckIn={todayCheckIn} />
      </Card>

      {/* Upcoming sessions */}
      <Card>
        <CardTitle className="text-base mb-3">Upcoming Sessions</CardTitle>
        <SessionsWidget sessions={sessions} />
      </Card>

      {/* Mentor connection */}
      <Card className="border-havii-teal/30 bg-gradient-to-br from-white to-havii-teal/5">
        <CardTitle className="text-base mb-3">My Mentor</CardTitle>
        <MentorConnection youth={youth} hasMatch={hasMatch} />
      </Card>

      {/* Quick links to Goals & Journal */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/goals">
          <Card className="flex h-full flex-col items-center gap-1 py-4 text-center transition hover:border-havii-teal/40">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-havii-ink">My Goals</span>
            <span className="text-xs text-havii-muted">
              {goals.length} active
            </span>
          </Card>
        </Link>
        <Link href="/dashboard/journal">
          <Card className="flex h-full flex-col items-center gap-1 py-4 text-center transition hover:border-havii-teal/40">
            <span className="text-2xl">📖</span>
            <span className="text-sm font-medium text-havii-ink">My Journal</span>
            <span className="text-xs text-havii-muted">
              {journalEntries.length} entries
            </span>
          </Card>
        </Link>
      </div>

      {/* Support */}
      <Card className="flex flex-col border-havii-coral/20">
        <CardTitle className="text-base mb-3">Support Hub</CardTitle>
        <p className="flex-1 text-sm text-havii-muted">
          Need help? Reach out — HAVII staff are available during business hours.
          HAVII is not monitored 24/7.
        </p>
        <div className="mt-4">
          <Link href="/help">
            <Button size="sm" variant="outline">Get Help</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function MentorDashboard({
  profile,
  mentor,
}: {
  profile: Profile;
  mentor: MentorProfile | null;
}) {
  const name = displayName(profile);
  const appStatus = mentor?.application_status ?? "application_not_started";
  const isApproved = appStatus === "approved";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-havii-ink">
          Welcome, {name}
        </h1>
        <p className="mt-1 text-sm text-havii-muted">
          Thank you for showing up for young people.
        </p>
      </div>

      {/* Application status card */}
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Application status</CardTitle>
            <CardDescription className="mt-1">
              {isApproved
                ? "You're approved! Staff can match you with youth."
                : "Submit your application to get started."}
            </CardDescription>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize ${
            isApproved ? "bg-green-100 text-green-700" :
            appStatus === "submitted" ? "bg-amber-100 text-amber-700" :
            "bg-havii-sand text-havii-muted"
          }`}>
            {appStatus.replace(/_/g, " ")}
          </span>
        </div>
        <div className="mt-4">
          <Link href="/dashboard/mentor/application">
            <Button size="sm" variant={isApproved ? "outline" : "default"}>
              {appStatus === "application_not_started" || appStatus === "pending_application"
                ? "Complete application"
                : "View application"}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Mentees */}
      <Card>
        <CardTitle className="text-base">My Mentees</CardTitle>
        {isApproved ? (
          <>
            <CardDescription className="mt-2">
              View your assigned participants and their interests.
            </CardDescription>
            <div className="mt-4">
              <Link href="/dashboard/mentor/mentees">
                <Button size="sm" variant="outline">View mentees</Button>
              </Link>
            </div>
          </>
        ) : (
          <CardDescription className="mt-2">
            Mentees appear after your application is approved by staff.
          </CardDescription>
        )}
      </Card>

      {/* Sessions */}
      <Card>
        <CardTitle className="text-base">Sessions</CardTitle>
        <CardDescription className="mt-2">
          Schedule and manage meetings with your mentees.
        </CardDescription>
        <div className="mt-4">
          <Link href="/dashboard/sessions">
            <Button size="sm" variant="outline">View sessions</Button>
          </Link>
        </div>
      </Card>

      {/* Screening & Training */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardTitle className="text-sm">Screening</CardTitle>
          <p className="mt-2 text-sm text-havii-muted capitalize">
            {(mentor?.screening_status ?? "not_started").replace(/_/g, " ")}
          </p>
        </Card>
        <Card>
          <CardTitle className="text-sm">Training</CardTitle>
          <p className="mt-2 text-sm text-havii-muted capitalize">
            {(mentor?.training_status ?? "not_started").replace(/_/g, " ")}
          </p>
        </Card>
      </div>
    </div>
  );
}

export function CaregiverDashboard({ profile }: { profile: Profile }) {
  const name = displayName(profile);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome, {name}
        </h1>
        <p className="mt-1 text-havii-muted">
          Support the young people in your life — with consent and privacy first.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Connected youth"
          description="Links require consent. Nothing is connected automatically in Phase 1."
        />
        <PlaceholderCard title="Consent" description="Manage permissions and agreements." />
        <PlaceholderCard title="Schedule" description="Upcoming sessions and events." />
        <PlaceholderCard title="Resources" description="Guides for families and caregivers." />
      </div>
      <Card className="border-amber-200 bg-amber-50/50">
        <CardTitle>Privacy note</CardTitle>
        <CardDescription>
          Journals, check-ins, and private messages are not exposed to caregivers by default.
        </CardDescription>
      </Card>
    </div>
  );
}

export function PartnerDashboard({
  profile,
  partner,
}: {
  profile: Profile;
  partner: PartnerProfile | null;
}) {
  const name = displayName(profile);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome, {name}
        </h1>
        <p className="mt-1 text-havii-muted">
          {partner?.organization_name
            ? `${partner.organization_name} · review ${partner.review_status.replace(/_/g, " ")}`
            : "Community partner workspace"}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard title="Referrals" description="Refer youth to programs (Coming Next)." />
        <PlaceholderCard title="Programs" description="Partner program touchpoints." />
        <PlaceholderCard title="Resources" description="Shared materials for partners." />
      </div>
      <Card>
        <CardTitle>Data boundaries</CardTitle>
        <CardDescription>
          Partners do not see private participant journals, check-ins, or messages.
        </CardDescription>
      </Card>
    </div>
  );
}

export function StaffDashboard({ profile }: { profile: Profile }) {
  const name = displayName(profile);

  const activeLinks = [
    { label: "Mentor Applications", href: "/dashboard/staff/applications", desc: "Review and approve mentor applications." },
    { label: "Matching", href: "/dashboard/staff/matches", desc: "Assign mentors to youth, manage matches." },
  ];

  const comingNextLinks = [
    "Youth directory",
    "Programs",
    "Support Requests",
    "Safety cases",
    "Reports",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Staff workspace
        </h1>
        <p className="mt-1 text-havii-muted">Hello, {name}.</p>
      </div>

      {/* Active tools */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-havii-ink">Mentorship</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {activeLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="flex h-full flex-col transition hover:border-havii-teal/40">
                <CardTitle className="text-base">{link.label}</CardTitle>
                <CardDescription className="mt-1 flex-1">{link.desc}</CardDescription>
                <span className="mt-3 text-sm font-medium text-havii-teal">Open →</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Coming next */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {comingNextLinks.map((label) => (
          <Card key={label} className="bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{label}</CardTitle>
              <ComingNextBadge />
            </div>
            <CardDescription>Phase 2+ operations module.</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboard({ profile }: { profile: Profile }) {
  const name = displayName(profile);
  const links = [
    "Users",
    "Roles",
    "Permissions",
    "Programs",
    "Resources",
    "Configuration",
    "Audit logs",
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Administrator
        </h1>
        <p className="mt-1 text-havii-muted">Hello, {name}. Protected admin shells.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((label) => (
          <Card key={label} className="bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{label}</CardTitle>
              <ComingNextBadge />
            </div>
            <CardDescription>Configuration reserved for administrators.</CardDescription>
          </Card>
        ))}
      </div>
    </div>
  );
}
