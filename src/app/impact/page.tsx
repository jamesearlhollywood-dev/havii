import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ImpactContent } from "@/components/site/sections/impact/ImpactSections";

export const metadata = {
  title: "Impact",
  description:
    "Explore the impact of Together For You, Inc. — community impact, youth impact, program outcomes, stories, annual highlights, and future goals.",
};

export default function ImpactPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Proof & Outcomes"
        title="Our Impact"
        subtitle="Verified outcomes, stories, and data demonstrating the difference TFY makes in Maryland communities. Metrics will be displayed here once data is confirmed."
      />
      <ImpactContent />
    </SiteShell>
  );
}
