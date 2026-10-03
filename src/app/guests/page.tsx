import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { PagePlaceholder } from "@/components/visual/PagePlaceholder";

export const metadata: Metadata = { title: "Guests" };

export default function GuestsPage() {
  return (
    <PublicPage>
      <PagePlaceholder
        eyebrow="The Voices"
        title="Guests"
        description="The remarkable people who share their stories on the network. Guest profiles, bios, and appearances will be featured here."
      />
    </PublicPage>
  );
}
