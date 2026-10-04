import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ResearchContent } from "@/components/site/sections/research/ResearchSections";

export const metadata = {
  title: "Research & Publications",
  description:
    "Explore TFY's research journal, reports, briefs, articles, research projects, and downloadable publications on youth development and community engagement.",
};

export default function ResearchPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Thought Leadership"
        title="Research & Publications"
        subtitle="Reports, briefs, and research grounded in the lived experience of Maryland's young people and families. Publications will be added as they are completed."
      />
      <ResearchContent />
    </SiteShell>
  );
}
