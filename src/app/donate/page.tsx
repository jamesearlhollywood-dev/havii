import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { DonateContent } from "@/components/site/sections/donate/DonateSections";

export const metadata = {
  title: "Donate",
  description:
    "Support Together For You, Inc. — your gift directly supports youth mentorship, wellness programs, career readiness, family support, and community initiatives across Maryland.",
};

export default function DonatePage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Fuel the Mission"
        title="Donate"
        subtitle="Your gift directly supports youth mentorship, family programs, and community initiatives across Maryland. Every contribution makes a difference."
      />
      <DonateContent />
    </SiteShell>
  );
}
