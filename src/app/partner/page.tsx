import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { PagePlaceholder } from "@/components/visual/PagePlaceholder";

export const metadata: Metadata = { title: "Partner With Us" };

export default function PartnerPage() {
  return (
    <PublicPage>
      <PagePlaceholder
        eyebrow="Partnerships"
        title="Partner With Us"
        description="Sponsorship, collaboration, and brand-partnership opportunities with the James Hollywood III Studios network. Partnership tiers and details will be available here soon."
      />
    </PublicPage>
  );
}
