import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { PagePlaceholder } from "@/components/visual/PagePlaceholder";

export const metadata: Metadata = { title: "Episodes" };

export default function EpisodesPage() {
  return (
    <PublicPage>
      <PagePlaceholder
        eyebrow="Listen"
        title="Episodes"
        description="Every episode across the network — full conversations, show notes, and transcripts. The episode library will appear here once episodes are published."
      />
    </PublicPage>
  );
}
