import { Waveform } from "@/components/visual/Waveform";

/**
 * Placeholder page section. Used while advanced functionality is built out
 * in later steps. Clearly communicates structure without faking content.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-studio-gold">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-studio-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base text-studio-muted">{description}</p>
      <Waveform bars={40} className="mx-auto mt-8 h-12 w-48 opacity-50" />
      <p className="mt-6 inline-flex items-center rounded-full border border-studio-line bg-studio-charcoal px-3 py-1 text-xs text-studio-muted">
        Content coming soon
      </p>
    </div>
  );
}
