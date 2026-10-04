import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { JournalSection } from "@/components/site/sections/research/JournalSection";
import { ResearchAreas } from "@/components/site/sections/research/ResearchAreas";
import { PublicationsLibrary } from "@/components/site/sections/research/PublicationsLibrary";
import { CurrentResearch } from "@/components/site/sections/research/CurrentResearch";
import { ResearchPartnerships } from "@/components/site/sections/research/ResearchPartnerships";
import { ResearchCollaborate } from "@/components/site/sections/research/ResearchCollaborate";

export const metadata = {
  title: "Research & Publications",
  description:
    "Research, practical insights, and community-informed publications from Together For You, Inc. — focused on issues affecting young people, families, and communities.",
};

export default function ResearchPage() {
  return (
    <SiteShell>
      {/* 1. Page Header */}
      <PageHeader
        eyebrow="Thought Leadership"
        title="Research That Informs Action"
        subtitle="Together For You, Inc. produces research, practical insights, and community-informed publications focused on issues affecting young people, families, and communities."
      />

      {/* 2. TFY Journal */}
      <JournalSection />

      {/* 3. Research Areas */}
      <ResearchAreas />

      {/* 4. Publications Library */}
      <PublicationsLibrary />

      {/* 5. Current Research */}
      <CurrentResearch />

      {/* 6. Research Partnerships */}
      <ResearchPartnerships />

      {/* 7. Submit or Collaborate CTA */}
      <ResearchCollaborate />
    </SiteShell>
  );
}
