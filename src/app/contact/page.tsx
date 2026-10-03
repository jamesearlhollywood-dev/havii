import type { Metadata } from "next";
import { PublicPage } from "@/components/layout/PublicNav";
import { PagePlaceholder } from "@/components/visual/PagePlaceholder";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PublicPage>
      <PagePlaceholder
        eyebrow="Get In Touch"
        title="Contact"
        description="Reach the studio for booking, sponsorship, press, or general inquiries. A contact form and direct details will be available here soon."
      />
    </PublicPage>
  );
}
