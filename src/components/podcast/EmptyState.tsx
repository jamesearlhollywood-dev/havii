import { ArtworkFrame } from "@/components/visual/ArtworkFrame";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; href: string };
  size?: "sm" | "md";
}

export function EmptyState({ title, message, action, size = "md" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-studio-line bg-studio-charcoal py-16 text-center">
      <ArtworkFrame
        size={size === "sm" ? "sm" : "md"}
        label="GH3"
        subtitle={title}
        className="opacity-40"
      />
      <p className="mt-4 text-sm font-medium text-studio-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-studio-muted">{message}</p>
      {action && (
        <a
          href={action.href}
          className="mt-5 rounded-lg border border-studio-line px-4 py-2 text-sm text-studio-ink transition hover:border-studio-gold/50 hover:text-studio-gold"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
