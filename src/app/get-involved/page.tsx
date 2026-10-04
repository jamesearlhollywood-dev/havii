import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { GetInvolvedContent } from "@/components/site/sections/get-involved/GetInvolvedSections";

export const metadata = {
  title: "Get Involved",
  description:
    "Volunteer, intern, mentor, partner, or collaborate with Together For You, Inc. Find your role in supporting young people, families, and communities.",
};

export default function GetInvolvedPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Be Part of It"
        title="Get Involved"
        subtitle="Whether you have time, expertise, or resources to share — there's a place for you in this work. Explore the many ways to get involved with TFY."
      />
      <GetInvolvedContent />
    </SiteShell>
  );
}
