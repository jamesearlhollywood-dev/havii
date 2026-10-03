import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { PagePlaceholder } from "@/components/visual/PagePlaceholder";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PublicPage>
      <PagePlaceholder
        eyebrow="Our Story"
        title="About James Hollywood III Studios"
        description="A podcast network and content studio built on the belief that grace changes everything. Learn about the mission, the host, and the vision behind the network."
      />
    </PublicPage>
  );
}
