import { PhotoPlaceholder } from "../../PhotoPlaceholder";

const BOARD: { role: string; name: string }[] = [
  { role: "Board President", name: "[Name Placeholder]" },
  { role: "Secretary", name: "[Name Placeholder]" },
  { role: "Treasurer", name: "[Name Placeholder]" },
  { role: "Board Member", name: "[Name Placeholder]" },
  { role: "Board Member", name: "[Name Placeholder]" },
  { role: "Board Member", name: "[Name Placeholder]" },
];

export function AboutLeadership() {
  return (
    <>
      {/* Leadership */}
      <section className="bg-tfy-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Leadership</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              The people behind the work
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              TFY is led by a team committed to nonprofit leadership,
              education, and community development.
            </p>
          </div>

          {/* Founder Card */}
          <div className="grid grid-cols-1 gap-10 rounded-[2rem] border border-tfy-line bg-white p-8 sm:p-10 lg:grid-cols-[280px_1fr] lg:items-start">
            <div>
              <PhotoPlaceholder
                label="Founder headshot — professional portrait placeholder"
                tone="navy"
                className="aspect-square w-full rounded-[1.5rem] shadow-md"
              />
              <h3 className="mt-5 font-display text-2xl text-tfy-navy">
                James Earl Hollywood III
              </h3>
              <p className="mt-1 text-sm font-semibold text-tfy-gold">
                Founder
              </p>
            </div>
            <div>
              <p className="text-base leading-relaxed text-tfy-muted">
                James Earl Hollywood III is the founder of Together For You,
                Inc. His work is driven by a commitment to nonprofit
                leadership, education, community engagement, and youth
                development. With a background in strategic communications and
                public service, he established TFY to help young people,
                families, and communities access the relationships, resources,
                and opportunities they need to move forward.
              </p>
              <p className="mt-4 text-base leading-relaxed text-tfy-muted">
                His vision for TFY is rooted in the belief that meaningful
                change begins with connection — and that every young person
                deserves access to the support, skills, and relationships that
                make a healthy, successful future possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Board of Directors</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Governance &amp; oversight
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Our board provides strategic guidance, financial oversight, and
              accountability to the communities we serve.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BOARD.map((member, i) => (
              <div
                key={i}
                className={`rounded-2xl border border-tfy-line bg-white p-7 transition-all hover:border-tfy-blue/30 hover:shadow-md reveal delay-${(i % 3) + 1}`}
              >
                <PhotoPlaceholder
                  label={`Headshot placeholder — ${member.role}`}
                  tone={i % 2 === 0 ? "forest" : "clay"}
                  className="aspect-square w-20 rounded-full"
                />
                <p className="mt-5 text-sm font-semibold text-tfy-gold">
                  {member.role}
                </p>
                <p className="mt-1 text-base text-tfy-navy">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
