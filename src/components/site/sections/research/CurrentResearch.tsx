const PROJECTS = [
  {
    title: "[Project Title Placeholder]",
    question:
      "[Research question placeholder — the central question this project seeks to answer.]",
    status: "Active",
    lead: "[Lead Researcher / Team Placeholder]",
    focus: "[Community or population of focus placeholder]",
    expected: "[Expected publication date placeholder]",
  },
  {
    title: "[Project Title Placeholder]",
    question:
      "[Research question placeholder — the central question this project seeks to answer.]",
    status: "Upcoming",
    lead: "[Lead Researcher / Team Placeholder]",
    focus: "[Community or population of focus placeholder]",
    expected: "[Expected publication date placeholder]",
  },
  {
    title: "[Project Title Placeholder]",
    question:
      "[Research question placeholder — the central question this project seeks to answer.]",
    status: "In Progress",
    lead: "[Lead Researcher / Team Placeholder]",
    focus: "[Community or population of focus placeholder]",
    expected: "[Expected publication date placeholder]",
  },
];

function statusStyle(status: string) {
  switch (status) {
    case "Active":
      return "bg-tfy-blue-tint text-tfy-blue";
    case "In Progress":
      return "bg-tfy-gold-tint text-tfy-gold-dark";
    case "Upcoming":
      return "bg-tfy-navy/10 text-tfy-navy";
    default:
      return "bg-tfy-navy/10 text-tfy-navy";
  }
}

export function CurrentResearch() {
  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="meta-label text-tfy-gold">Current Research &amp; Learning</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-tfy-navy sm:text-5xl">
            Active and upcoming projects
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-tfy-muted">
            Research projects currently underway or planned. Project details
            will be added as they are confirmed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <article
              key={i}
              className="flex flex-col rounded-2xl border border-tfy-line bg-white p-7"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 meta-label text-[0.625rem] ${statusStyle(
                    project.status
                  )}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {project.status}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl leading-tight text-tfy-navy">
                {project.title}
              </h3>

              <div className="mt-4">
                <p className="meta-label text-[0.625rem] text-tfy-muted">
                  Research Question
                </p>
                <p className="mt-1.5 text-sm italic leading-relaxed text-tfy-muted">
                  {project.question}
                </p>
              </div>

              <dl className="mt-6 space-y-3 border-t border-tfy-line pt-5">
                <div className="flex gap-3">
                  <dt className="meta-label w-28 flex-none text-[0.625rem] text-tfy-muted">
                    Lead
                  </dt>
                  <dd className="text-sm text-tfy-navy">{project.lead}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="meta-label w-28 flex-none text-[0.625rem] text-tfy-muted">
                    Focus
                  </dt>
                  <dd className="text-sm text-tfy-navy">{project.focus}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="meta-label w-28 flex-none text-[0.625rem] text-tfy-muted">
                    Expected
                  </dt>
                  <dd className="text-sm text-tfy-navy">{project.expected}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="mt-7 inline-flex items-center gap-2 self-start meta-label text-tfy-blue transition-colors hover:text-tfy-gold"
              >
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
