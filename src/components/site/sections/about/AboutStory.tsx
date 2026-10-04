import { PhotoPlaceholder } from "../../PhotoPlaceholder";

export function AboutStory() {
  return (
    <section className="bg-tfy-parchment-warm">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="meta-label text-tfy-gold">Our Story</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-tfy-navy sm:text-5xl">
              Built to close the gaps young people face
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-tfy-muted">
              <p>
                Together For You, Inc. was established to respond to gaps
                affecting young people and families across Maryland — gaps in
                mentorship, emotional support, career preparation, digital
                access, community connection, and supportive opportunities.
              </p>
              <p>
                TFY was built to address these gaps directly, bringing
                mentorship, wellness support, career readiness, education,
                digital literacy, family engagement, and advocacy together
                under one organization. We work alongside young people,
                families, educators, and community partners to create programs
                that meet people where they are.
              </p>
              <p>
                Our approach is grounded in the belief that meaningful change
                begins with relationships. Every program we build starts with
                listening — to young people, to families, and to the
                communities we serve.
              </p>
            </div>
          </div>

          <div>
            <PhotoPlaceholder
              label="TFY community program — young people and families gathered in a welcoming community space"
              tone="warm"
              className="aspect-[4/3] w-full rounded-[2rem] shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
