import { SiteShell } from "@/components/site/SiteShell";
import { PagePlaceholder } from "@/components/site/PagePlaceholder";

export default function AboutPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        eyebrow="About Us"
        title="About TFY"
        subtitle="Learn about our history, values, team, and the communities we serve across Maryland."
      />
    </SiteShell>
  );
}
