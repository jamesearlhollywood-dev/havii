import type { ContentBlock } from "@/data/course-types";

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            if (block.level === 2) {
              return <h2 key={i} className="mt-6 text-xl font-bold text-rise-navy">{block.text}</h2>;
            }
            return <h3 key={i} className="mt-4 text-lg font-semibold text-rise-navy">{block.text}</h3>;

          case "paragraph":
            return <p key={i} className="text-[15px] leading-relaxed text-rise-navy/90">{block.text}</p>;

          case "list":
            return (
              <ul key={i} className="space-y-1.5 pl-1">
                {block.items?.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[15px] text-rise-navy/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rise-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-rise-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-rise-navy text-white">
                      {block.headers?.map((h, j) => (
                        <th key={j} className="px-4 py-2.5 text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-rise-sky/30"}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-2.5 text-rise-navy/90">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "callout": {
            const styles: Record<string, string> = {
              info: "border-rise-blue-light bg-rise-sky text-rise-navy",
              warning: "border-rise-warning/30 bg-rise-warning-light text-rise-warning",
              tip: "border-rise-success/30 bg-rise-success-light text-rise-success",
              success: "border-rise-success/30 bg-rise-success-light text-rise-success",
            };
            const icons: Record<string, string> = {
              info: "ℹ️",
              warning: "⚠️",
              tip: "💡",
              success: "✓",
            };
            return (
              <div key={i} className={`rounded-xl border px-4 py-3 ${styles[block.calloutType || "info"]}`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">{icons[block.calloutType || "info"]}</span>
                  <p className="text-sm font-medium">{block.text}</p>
                </div>
              </div>
            );
          }

          case "example":
            return (
              <div key={i} className="rounded-xl border-l-4 border-rise-gold bg-rise-cream/50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-rise-warning">Example</p>
                <p className="mt-1 text-sm text-rise-navy/90">{block.text}</p>
              </div>
            );

          case "divider":
            return <hr key={i} className="border-rise-border" />;

          case "image":
            return (
              <figure key={i} className="space-y-1">
                {block.imageUrl && (
                  <img
                    src={block.imageUrl}
                    alt={block.imageAlt || ""}
                    className="w-full rounded-xl border border-rise-border"
                  />
                )}
                {block.caption && (
                  <figcaption className="text-center text-xs text-rise-muted">{block.caption}</figcaption>
                )}
              </figure>
            );

          case "video":
            return (
              <figure key={i} className="space-y-1">
                {block.videoUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-rise-border">
                    <iframe
                      src={block.videoUrl}
                      className="h-full w-full"
                      title={block.caption || "Embedded video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {block.caption && (
                  <figcaption className="text-center text-xs text-rise-muted">{block.caption}</figcaption>
                )}
              </figure>
            );

          case "definition":
            return (
              <div key={i} className="rounded-xl border-l-4 border-rise-blue-light bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-rise-blue-dark">📖 Definition</p>
                <p className="mt-1 text-sm text-rise-navy/90">{block.text}</p>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
