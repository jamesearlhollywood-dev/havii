type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
};

const FORMS: { title: string; description: string; fields: Field[] }[] = [
  {
    title: "General Inquiry",
    description: "Have a question or want to learn more about TFY? Send us a message.",
    fields: [
      { name: "general-name", label: "Name", required: true, placeholder: "Your name" },
      { name: "general-email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "general-subject", label: "Subject", required: true, placeholder: "How can we help?" },
      { name: "general-message", label: "Message", required: true, placeholder: "Tell us more...", textarea: true },
    ],
  },
  {
    title: "Partnership Inquiry",
    description: "Interested in partnering with TFY? We'd love to hear from your organization.",
    fields: [
      { name: "partner-name", label: "Name", required: true, placeholder: "Your name" },
      { name: "partner-org", label: "Organization", required: true, placeholder: "Organization name" },
      { name: "partner-email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "partner-message", label: "Message", required: true, placeholder: "Tell us about your organization and how you'd like to partner...", textarea: true },
    ],
  },
  {
    title: "Volunteer & Internship Inquiry",
    description: "Want to volunteer or intern with TFY? Let us know how you'd like to get involved.",
    fields: [
      { name: "volunteer-name", label: "Name", required: true, placeholder: "Your name" },
      { name: "volunteer-email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "volunteer-interest", label: "Area of Interest", required: true, placeholder: "Mentorship, volunteer, internship, etc." },
      { name: "volunteer-message", label: "Message", required: true, placeholder: "Tell us about your interests and availability...", textarea: true },
    ],
  },
];

const CONTACT_DETAILS = [
  { label: "Address", value: ["Together For You, Inc.", "[Street Address Placeholder]", "[City], Maryland [ZIP]"] },
  { label: "Phone", value: ["[Phone Placeholder]"] },
  { label: "Email", value: ["hello@togetherforyou.org"] },
  { label: "Hours", value: ["[Office Hours Placeholder]"] },
];

const SOCIAL_LINKS = ["LinkedIn", "Instagram", "Facebook", "YouTube", "X"];

export function ContactContent() {
  return (
    <>
      {/* Forms */}
      <section className="bg-tfy-parchment">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="meta-label text-tfy-gold">Get in Touch</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-navy sm:text-5xl">
              Send us a message
            </h2>
            <p className="mt-4 text-lg text-tfy-muted">
              Choose the form that best matches your inquiry and we&apos;ll get
              back to you as soon as possible.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {FORMS.map((form) => (
              <div key={form.title} className="rounded-3xl border border-tfy-line bg-white p-7">
                <h3 className="font-display text-2xl text-tfy-navy">{form.title}</h3>
                <p className="mt-2 text-sm text-tfy-muted">{form.description}</p>
                <form className="mt-6 space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-tfy-navy">
                        {field.label}
                      </label>
                      {field.textarea ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          required={field.required}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full rounded-xl border border-tfy-line bg-tfy-parchment/50 px-4 py-3 text-sm text-tfy-navy outline-none transition focus:border-tfy-blue focus:ring-2 focus:ring-tfy-blue/20"
                        />
                      ) : (
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type || "text"}
                          required={field.required}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-tfy-line bg-tfy-parchment/50 px-4 py-3 text-sm text-tfy-navy outline-none transition focus:border-tfy-blue focus:ring-2 focus:ring-tfy-blue/20"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-tfy-navy px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-tfy-navy-soft"
                  >
                    Send
                  </button>
                </form>
                <p className="mt-4 text-xs text-tfy-muted">
                  [Form submissions are a placeholder — backend integration coming soon.]
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Details + Social */}
      <section className="bg-tfy-parchment-warm">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact Details */}
            <div>
              <p className="meta-label text-tfy-gold">Organization Contact</p>
              <h2 className="mt-3 font-display text-3xl text-tfy-navy sm:text-4xl">
                Reach TFY directly
              </h2>
              <div className="mt-8 space-y-6">
                {CONTACT_DETAILS.map((detail) => (
                  <div key={detail.label}>
                    <p className="meta-label text-tfy-navy">{detail.label}</p>
                    <div className="mt-1.5 space-y-0.5">
                      {detail.value.map((line) => (
                        <p key={line} className="text-sm leading-relaxed text-tfy-muted">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="meta-label text-tfy-gold">Connect Online</p>
              <h2 className="mt-3 font-display text-3xl text-tfy-navy sm:text-4xl">
                Follow TFY
              </h2>
              <p className="mt-4 text-base text-tfy-muted">
                Stay connected and follow our latest programs, impact, and
                community stories.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <span
                    key={social}
                    className="inline-flex items-center gap-2 rounded-full border border-tfy-line bg-white px-5 py-2.5 text-sm font-medium text-tfy-navy"
                  >
                    {social}
                    <span className="text-xs text-tfy-muted">[Link Placeholder]</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
