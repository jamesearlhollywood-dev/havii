import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ContactContent } from "@/components/site/sections/contact/ContactSections";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Together For You, Inc. — for partnerships, volunteering, internships, program inquiries, or general questions.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Reach Out"
        title="Contact"
        subtitle="Get in touch with the TFY team — for partnerships, press, program inquiries, volunteering, or general questions. We'd love to hear from you."
      />
      <ContactContent />
    </SiteShell>
  );
}
