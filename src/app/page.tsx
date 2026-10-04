import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/sections/Hero";
import { MissionIntro } from "@/components/site/sections/MissionIntro";
import { FocusAreas } from "@/components/site/sections/FocusAreas";
import { FeaturedPrograms } from "@/components/site/sections/FeaturedPrograms";
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
        <GetInvolved />
        <DonationCTA />
        <NewsletterSignup />
      </main>
      <SiteFooter />
    </>
  );
}
