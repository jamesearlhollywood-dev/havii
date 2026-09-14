import Link from "next/link";
import {
  Card,
  CardDescription,
  CardTitle,
  ComingNextBadge,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type {
  MentorProfile,
  PartnerProfile,
  Profile,
  YouthProfile,
} from "@/lib/types";
import { displayName } from "@/lib/utils";

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
}: {
  profile: Profile;
  youth: YouthProfile | null;
}) {
  const name = displayName(profile);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-havii-ink sm:text-3xl">
          Welcome, {name}
        </h1>
        <p className="mt-1 text-havii-muted">
          A calm place to connect, grow, and find support.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="How are you feeling?"
          description="Quick emotional check-ins will live here."
        />
        <Card className="flex h-full flex-col border-havii-teal/30 bg-gradient-to-br from-white to-havii-teal/5">
          <CardTitle>My Mentor</CardTitle>
          <CardDescription className="mt-2 flex-1">
            {youth?.mentorship_interested
              ? "Ready to find someone in your corner?"
              : "Mentorship is optional — explore when you're ready."}
          </CardDescription>
          <div className="mt-4">
            <Link href="/coming-next/find-a-mentor">
              <Button size="sm">Find a Mentor</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-havii-muted">
            Matching launches in a future phase — no mentors assigned yet.
          </p>
        </Card>
        <PlaceholderCard title="My Goals" description="Set and track personal goals." />
        <PlaceholderCard title="My Journal" description="Private space for your thoughts." />
        <PlaceholderCard title="Programs" description="Explore cohorts and activities." />
        <PlaceholderCard
          title="Support Hub"
          description="Ask for help and find resources."
          href="/help"
          cta="Get Help"
        />
        <PlaceholderCard
          title="HAVII Companion"
          description="Guided support tools are on the way."
        />
      </div>
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome, {name}
        </h1>
        <p className="mt-1 text-havii-muted">
          Thank you for showing up for young people.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardTitle>Application status</CardTitle>
          <p className="mt-3 inline-flex rounded-full bg-havii-sand px-3 py-1 text-sm font-medium capitalize text-havii-teal-dark">
            {appStatus.replace(/_/g, " ")}
          </p>
          <CardDescription className="mt-2">
            Completing your profile starts an application — approval is a separate step.
          </CardDescription>
        </Card>
        <Card>
          <CardTitle>Profile completion</CardTitle>
          <CardDescription className="mt-2">
            {mentor?.profession
              ? `Profession on file: ${mentor.profession}`
              : "Add profession and interests in onboarding."}
          </CardDescription>
        </Card>
        <PlaceholderCard
          title="Screening"
          description={`Status: ${(mentor?.screening_status ?? "not_started").replace(/_/g, " ")}`}
        />
        <PlaceholderCard
          title="Training"
          description={`Status: ${(mentor?.training_status ?? "not_started").replace(/_/g, " ")}`}
        />
        <Card className="sm:col-span-2">
          <CardTitle>Your mentees</CardTitle>
          <CardDescription className="mt-2">
            No mentees yet. Matches are made after approval and screening — we will never show fake mentees.
          </CardDescription>
        </Card>
        <PlaceholderCard title="Mentor resources" description="Guides and community tools." />
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
  const links = [
    "Overview",
    "Youth",
    "Mentors",
    "Applications",
    "Matching",
    "Programs",
    "Support Requests",
    "Safety",
    "Resources",
    "Reports",
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Staff workspace
        </h1>
        <p className="mt-1 text-havii-muted">Hello, {name}. Operational shells only — no fake stats.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((label) => (
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
