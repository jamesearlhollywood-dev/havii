import Link from "next/link";

type PubItem = { date: string; type: string; title: string; desc: string };

function PublicationSection({
  eyebrow,
  title,
  description,
  items,
  bgColor = "bg-tfy-parchment",
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: PubItem[];
  bgColor?: string;
}) {
  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="meta-label text-tfy-gold">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-tfy-muted">{description}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <article key={i} className="group flex flex-col rounded-3xl border border-tfy-line bg-white p-7 transition-all hover:border-tfy-blue/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="meta-label text-tfy-blue">{item.type}</span>
                <span className="text-xs text-tfy-muted">{item.date}</span>
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug text-tfy-navy">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-tfy-muted">{item.desc}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-tfy-blue transition-colors group-hover:text-tfy-gold">
                Download PDF
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const JOURNAL_ARTICLES: PubItem[] = [
  { date: "[Month YYYY]", type: "Journal Article", title: "[Article Title Placeholder]", desc: "[Article description placeholder — summary of research focus and key findings.]" },
  { date: "[Month YYYY]", type: "Journal Article", title: "[Article Title Placeholder]", desc: "[Article description placeholder — summary of research focus and key findings.]" },
  { date: "[Month YYYY]", type: "Journal Article", title: "[Article Title Placeholder]", desc: "[Article description placeholder — summary of research focus and key findings.]" },
];

const REPORTS: PubItem[] = [
  { date: "[Month YYYY]", type: "Report", title: "[Report Title Placeholder]", desc: "[Report description placeholder — scope, methodology, and key findings.]" },
  { date: "[Month YYYY]", type: "Report", title: "[Report Title Placeholder]", desc: "[Report description placeholder — scope, methodology, and key findings.]" },
  { date: "[Month YYYY]", type: "Report", title: "[Report Title Placeholder]", desc: "[Report description placeholder — scope, methodology, and key findings.]" },
];

const BRIEFS: PubItem[] = [
  { date: "[Month YYYY]", type: "Brief", title: "[Brief Title Placeholder]", desc: "[Brief description placeholder — key findings and recommendations.]" },
  { date: "[Month YYYY]", type: "Brief", title: "[Brief Title Placeholder]", desc: "[Brief description placeholder — key findings and recommendations.]" },
  { date: "[Month YYYY]", type: "Brief", title: "[Brief Title Placeholder]", desc: "[Brief description placeholder — key findings and recommendations.]" },
];

const ARTICLES: PubItem[] = [
  { date: "[Month YYYY]", type: "Article", title: "[Article Title Placeholder]", desc: "[Article description placeholder — thought leadership and analysis.]" },
  { date: "[Month YYYY]", type: "Article", title: "[Article Title Placeholder]", desc: "[Article description placeholder — thought leadership and analysis.]" },
  { date: "[Month YYYY]", type: "Article", title: "[Article Title Placeholder]", desc: "[Article description placeholder — thought leadership and analysis.]" },
];

const PROJECTS: PubItem[] = [
  { date: "[Status Placeholder]", type: "Research Project", title: "[Project Title Placeholder]", desc: "[Project description placeholder — research focus, scope, and timeline.]" },
  { date: "[Status Placeholder]", type: "Research Project", title: "[Project Title Placeholder]", desc: "[Project description placeholder — research focus, scope, and timeline.]" },
  { date: "[Status Placeholder]", type: "Research Project", title: "[Project Title Placeholder]", desc: "[Project description placeholder — research focus, scope, and timeline.]" },
];

const DOWNLOADS = [
  { title: "[Publication Title Placeholder]", type: "Report", desc: "[Brief description of the publication.]" },
  { title: "[Publication Title Placeholder]", type: "Brief", desc: "[Brief description of the publication.]" },
  { title: "[Publication Title Placeholder]", type: "Guide", desc: "[Brief description of the publication.]" },
  { title: "[Publication Title Placeholder]", type: "White Paper", desc: "[Brief description of the publication.]" },
  { title: "[Publication Title Placeholder]", type: "Report", desc: "[Brief description of the publication.]" },
  { title: "[Publication Title Placeholder]", type: "Brief", desc: "[Brief description of the publication.]" },
];

export function ResearchContent() {
  return (
    <>
      <PublicationSection
        eyebrow="TFY Research Journal"
        title="Original research & analysis"
        description="The TFY Research Journal publishes original research and analysis on youth development, community engagement, and nonprofit impact."
        items={JOURNAL_ARTICLES}
      />
      <PublicationSection
        eyebrow="Reports"
        title="In-depth reports"
        description="In-depth reports examining issues affecting young people and families across Maryland."
        items={REPORTS}
        bgColor="bg-tfy-parchment-warm"
      />
      <PublicationSection
        eyebrow="Briefs"
        title="Research briefs"
        description="Short-form research briefs highlighting key findings, recommendations, and insights."
        items={BRIEFS}
      />
      <PublicationSection
        eyebrow="Articles"
        title="Articles & thought leadership"
        description="Articles and thought leadership pieces from TFY staff, partners, and contributors."
        items={ARTICLES}
        bgColor="bg-tfy-parchment-warm"
      />
      <PublicationSection
        eyebrow="Research Projects"
        title="Ongoing & completed projects"
        description="Research projects exploring youth wellness, mentorship, career readiness, and community development."
        items={PROJECTS}
      />

      {/* Downloadable Publications */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Downloadable Publications</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Resource library
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Access our full library of downloadable reports, briefs, and
              resources.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DOWNLOADS.map((d, i) => (
              <div key={i} className="group flex items-start gap-4 rounded-2xl border border-tfy-line bg-white p-6 transition-all hover:border-tfy-blue/30 hover:shadow-md">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-tfy-blue-tint text-tfy-blue transition-colors group-hover:bg-tfy-gold-tint group-hover:text-tfy-gold-dark">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <span className="meta-label text-tfy-blue">{d.type}</span>
                  <h3 className="mt-1 font-display text-lg leading-tight text-tfy-navy">{d.title}</h3>
                  <p className="mt-2 text-sm text-tfy-muted">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research CTA */}
      <section className="bg-tfy-navy text-tfy-parchment">
        <div className="mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8 lg:py-28">
          <p className="meta-label text-tfy-gold">Research Inquiries</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
            Partner with us on research
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-tfy-parchment/75">
            Interested in collaborating on a research project or accessing our
            publications? We welcome inquiries from researchers, institutions,
            and community partners.
          </p>
          <Link href="/contact" className="mt-10 inline-flex rounded-full bg-tfy-gold px-8 py-3.5 text-sm font-semibold text-tfy-navy transition-all hover:bg-tfy-gold-dark hover:text-white">
            Contact Our Team
          </Link>
        </div>
      </section>
    </>
  );
}
