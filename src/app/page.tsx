import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/sections/Hero";
import { MissionIntro } from "@/components/site/sections/MissionIntro";
import { FocusAreas } from "@/components/site/sections/FocusAreas";
import { FeaturedPrograms } from "@/components/site/sections/FeaturedPrograms";
import { ImpactStats } from "@/components/site/sections/ImpactStats";
import { LatestResearch } from "@/components/site/sections/LatestResearch";
import { GetInvolved } from "@/components/site/sections/GetInvolved";
import { DonationCTA } from "@/components/site/sections/DonationCTA";
import { NewsletterSignup } from "@/components/site/sections/NewsletterSignup";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <MissionIntro />
        <FocusAreas />
        <FeaturedPrograms />
        <ImpactStats />
        <LatestResearch />
        <GetInvolved />
        <DonationCTA />
        <NewsletterSignup />
      </main>
      <SiteFooter />
    </>
  );
}
