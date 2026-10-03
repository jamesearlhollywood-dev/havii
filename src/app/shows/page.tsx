import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { PagePlaceholder } from "@/components/visual/PagePlaceholder";

export const metadata: Metadata = { title: "Shows" };

export default function ShowsPage() {
  return (
    <PublicPage>
      <PagePlaceholder
        eyebrow="The Network"
        title="Shows"
        description="Browse every podcast series in the James Hollywood III Studios network. The Grace Beyond Podcast Show leads the lineup, with more shows to come."
      />
    </PublicPage>
  );
}
