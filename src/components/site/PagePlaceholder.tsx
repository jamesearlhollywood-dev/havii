/**
 * PagePlaceholder — shared shell for interior pages whose full content
 * will be built out in later steps. Keeps navigation + footer consistent.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:py-36">
      <p className="meta-label text-tfy-gold">{eyebrow}</p>
      <h1 className="mt-4 font-display text-5xl text-tfy-navy sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-tfy-muted">
        {subtitle ??
          "This page's content will be built out in a later step. The structure, navigation, and design system are in place and ready to customize."}
      </p>
      <div className="mt-14 border-t border-tfy-line pt-10">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-tfy-gold" />
          <p className="text-sm font-medium text-tfy-muted">
            Content placeholder — to be customized
          </p>
        </div>
      </div>
    </section>
  );
}
