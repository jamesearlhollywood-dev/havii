import { redirect } from "next/navigation";
import { getCurrentUserAndProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { modules } from "@/data/course";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resources" };

export default async function ResourcesPage() {
  const { user, profile } = await getCurrentUserAndProfile();
  if (!user) redirect("/auth/login?next=/resources");
  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // Default resources if none in DB
  const defaultResources = [
    { title: "Annual Credit Report", description: "Get your free credit report from all three bureaus.", url: "https://www.annualcreditreport.com", resource_type: "link", module_id: null },
    { title: "FAFSA Official Site", description: "Free Application for Federal Student Aid.", url: "https://studentaid.gov/h/apply-for-aid/fafsa", resource_type: "link", module_id: "module-4" },
    { title: "Consumer Financial Protection Bureau", description: "Tools and resources for financial decisions.", url: "https://www.consumerfinance.gov", resource_type: "link", module_id: null },
    { title: "IdentityTheft.gov", description: "Report identity theft and get a recovery plan.", url: "https://www.identitytheft.gov", resource_type: "link", module_id: "module-6" },
    { title: "Investor.gov", description: "SEC resources for new investors.", url: "https://www.investor.gov", resource_type: "link", module_id: "module-5" },
  ];

  const allResources = (resources && resources.length > 0 ? resources : defaultResources) as any[];

  return (
    <AppShell profile={profile}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-rise-navy">Resources</h1>
        <p className="mb-6 text-rise-muted">
          Trusted tools and references to support your financial journey.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {allResources.map((r, i) => {
            const mod = r.module_id ? modules.find((m) => m.id === r.module_id) : null;
            return (
              <a
                key={i}
                href={r.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {mod && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-rise-red">
                          Module {mod.number}
                        </span>
                      )}
                      <h3 className="mt-0.5 text-base font-bold text-rise-navy group-hover:text-rise-blue-dark">
                        {r.title}
                      </h3>
                      {r.description && (
                        <p className="mt-1 text-sm text-rise-muted">{r.description}</p>
                      )}
                    </div>
                    <span className="ml-2 text-rise-muted group-hover:text-rise-navy">↗</span>
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
