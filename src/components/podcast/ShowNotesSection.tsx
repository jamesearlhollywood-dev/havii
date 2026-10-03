import { Fragment } from "react";

interface ShowNotesSectionProps {
  showNotes: string;
}

/**
 * Lightweight show-notes renderer.
 * Supports: ## headings, -/* bullet lists, [text](url) links, and paragraphs.
 */
export function ShowNotesSection({ showNotes }: ShowNotesSectionProps) {
  const lines = showNotes.split("\n");
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList(key: string) {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`ul-${key}`} className="mt-3 space-y-1.5 pl-5">
        {listItems.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-studio-muted sm:text-base list-disc marker:text-studio-gold">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  }

  function renderInline(text: string): React.ReactNode {
    // [text](url) → link
    const parts = text.split(/(\[.+?\]\(.+?\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(.+?)\]\((.+?)\)/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-studio-gold underline-offset-2 hover:underline"
          >
            {match[1]}
          </a>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    });
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      flushList(`f${idx}`);
      blocks.push(
        <h3 key={`h3-${idx}`} className="mt-5 text-base font-semibold text-studio-ink">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList(`f${idx}`);
      blocks.push(
        <h4 key={`h4-${idx}`} className="mt-4 text-sm font-semibold text-studio-ink">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed === "") {
      flushList(`f${idx}`);
    } else {
      flushList(`f${idx}`);
      blocks.push(
        <p key={`p-${idx}`} className="mt-2 text-sm leading-relaxed text-studio-muted sm:text-base">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList("final");

  return (
    <section className="mt-14">
      <h2 className="text-xl font-semibold tracking-tight text-studio-ink">
        Show Notes
      </h2>
      <div className="mt-4 rounded-2xl border border-studio-line bg-studio-charcoal p-6">
        <div>{blocks}</div>
      </div>
    </section>
  );
}
