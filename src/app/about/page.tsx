import { SiteShell } from "@/components/site/SiteShell";
import { AboutHero } from "@/components/site/sections/about/AboutHero";
import { AboutMission } from "@/components/site/sections/about/AboutMission";
import { AboutApproach } from "@/components/site/sections/about/AboutApproach";
import { AboutStory } from "@/components/site/sections/about/AboutStory";
import { AboutLeadership } from "@/components/site/sections/about/AboutLeadership";
import { AboutValues } from "@/components/site/sections/about/AboutValues";
import { AboutCTA } from "@/components/site/sections/about/AboutCTA";

export const metadata = {
  title: "About",
  description:
    "Learn about Together For You, Inc. — our mission, vision, approach, leadership, and the values that guide our work with young people, families, and communities.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutHero />
      <AboutMission />
      <AboutApproach />
      <AboutStory />
      <AboutLeadership />
      <AboutValues />
      <AboutCTA />
    </SiteShell>
  );
}
