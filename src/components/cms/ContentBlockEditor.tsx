"use client";

import { useState } from "react";
import type { ContentBlock } from "@/data/course-types";
import { CONTENT_BLOCK_TYPES, type ContentBlockType } from "@/data/cms-types";
import { ReorderControls } from "./ReorderControls";

const CALLOUT_TYPES = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "tip", label: "Tip" },
  { value: "success", label: "Success" },
];

function emptyBlock(type: ContentBlockType): ContentBlock {
  switch (type) {
    case "heading":
      return { type: "heading", text: "", level: 2 };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "list":
      return { type: "list", items: [""] };
    case "table":
      return { type: "table", headers: ["", ""], rows: [["", ""]] };
    case "callout":
      return { type: "callout", calloutType: "info", text: "" };
    case "example":
      return { type: "example", text: "" };
    case "definition":
      return { type: "callout", calloutType: "info", text: "" } as ContentBlock;
    case "video":
      return { type: "video", videoUrl: "", caption: "" };
    case "image":
      return { type: "image", imageUrl: "", imageAlt: "", caption: "" };
    case "divider":
      return { type: "divider" };
    default:
      return { type: "paragraph", text: "" };
  }
}

export function ContentBlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const [showAddMenu, setShowAddMenu] = useState<number | null>(null);

  function updateBlock(index: number, updates: Partial<ContentBlock>) {
    const next = [...blocks];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function addBlock(type: ContentBlockType, afterIndex: number) {
    const block = emptyBlock(type);
    const next = [...blocks];
    next.splice(afterIndex + 1, 0, block);
    onChange(next);
    setShowAddMenu(null);
  }

  function moveBlock(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={i} className="rounded-xl border border-rise-border bg-white p-3">
          {/* Block header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rise-muted">
              {block.type === "callout" && block.calloutType ? `Callout (${block.calloutType})` : block.type}
            </span>
            <div className="flex items-center gap-1">
              <ReorderControls
                onUp={() => moveBlock(i, -1)}
                onDown={() => moveBlock(i, 1)}
                canUp={i > 0}
                canDown={i < blocks.length - 1}
              />
              <button
                type="button"
                onClick={() => removeBlock(i)}
                className="rounded-lg border border-rise-border bg-white p-1.5 text-red-500 hover:bg-red-50"
                aria-label="Remove block"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l8 8M11 3l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Block editor by type */}
          <BlockEditor block={block} onChange={(updates) => updateBlock(i, updates)} />

          {/* Add block after this */}
          <div className="mt-2 border-t border-rise-border pt-2">
            {showAddMenu === i ? (
              <div className="flex flex-wrap gap-1">
                {CONTENT_BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    type="button"
                    onClick={() => addBlock(bt.type, i)}
                    className="rounded-lg border border-rise-border bg-white px-2 py-1 text-xs text-rise-navy hover:bg-rise-sky"
                  >
                    <span className="mr-1">{bt.icon}</span>
                    {bt.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAddMenu(null)}
                  className="rounded-lg px-2 py-1 text-xs text-rise-muted hover:text-rise-navy"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddMenu(i)}
                className="text-xs font-medium text-rise-blue-dark hover:underline"
              >
                + Add block below
              </button>
            )}
          </div>
        </div>
      ))}

      {blocks.length === 0 && (
        <div className="rounded-xl border border-dashed border-rise-border bg-rise-sky/30 p-6 text-center">
          <p className="text-sm text-rise-muted">No content blocks yet.</p>
        </div>
      )}

      {/* Add block at end */}
      {showAddMenu === -1 || (showAddMenu === null && blocks.length === 0) ? (
        <div className="flex flex-wrap gap-1">
          {CONTENT_BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              type="button"
              onClick={() => addBlock(bt.type, blocks.length - 1)}
              className="rounded-lg border border-rise-border bg-white px-2 py-1 text-xs text-rise-navy hover:bg-rise-sky"
            >
              <span className="mr-1">{bt.icon}</span>
              {bt.label}
            </button>
          ))}
          {blocks.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAddMenu(null)}
              className="rounded-lg px-2 py-1 text-xs text-rise-muted hover:text-rise-navy"
            >
              Cancel
            </button>
          )}
        </div>
      ) : blocks.length > 0 ? (
        <button
          type="button"
          onClick={() => setShowAddMenu(-1)}
          className="w-full rounded-xl border border-dashed border-rise-border bg-white py-2 text-sm font-medium text-rise-blue-dark hover:bg-rise-sky"
        >
          + Add content block
        </button>
      ) : null}
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (updates: Partial<ContentBlock>) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              value={block.level || 2}
              onChange={(e) => onChange({ level: Number(e.target.value) })}
              className="rounded-lg border border-rise-border bg-white px-2 py-1.5 text-sm"
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
              <option value={4}>H4</option>
            </select>
            <input
              type="text"
              value={block.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder="Heading text"
              className="flex-1 rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      );

    case "paragraph":
      return (
        <textarea
          value={block.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Paragraph text"
          rows={3}
          className="w-full rounded-lg border border-rise-border bg-white px-3 py-2 text-sm"
        />
      );

    case "list":
      return (
        <div className="space-y-1.5">
          {(block.items || []).map((item, j) => (
            <div key={j} className="flex items-center gap-2">
              <span className="text-rise-muted">•</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const items = [...(block.items || [])];
                  items[j] = e.target.value;
                  onChange({ items });
                }}
                placeholder={`List item ${j + 1}`}
                className="flex-1 rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const items = (block.items || []).filter((_, k) => k !== j);
                  onChange({ items });
                }}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ items: [...(block.items || []), ""] })}
            className="text-xs font-medium text-rise-blue-dark hover:underline"
          >
            + Add list item
          </button>
        </div>
      );

    case "table":
      return (
        <div className="space-y-2">
          <div className="flex gap-1">
            {(block.headers || []).map((h, j) => (
              <input
                key={j}
                type="text"
                value={h}
                onChange={(e) => {
                  const headers = [...(block.headers || [])];
                  headers[j] = e.target.value;
                  onChange({ headers });
                }}
                placeholder={`Col ${j + 1}`}
                className="flex-1 rounded-lg border border-rise-border bg-rise-sky/30 px-2 py-1 text-xs font-semibold"
              />
            ))}
          </div>
          {(block.rows || []).map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((cell, c) => (
                <input
                  key={c}
                  type="text"
                  value={cell}
                  onChange={(e) => {
                    const rows = (block.rows || []).map((rr) => [...rr]);
                    rows[r][c] = e.target.value;
                    onChange({ rows });
                  }}
                  placeholder="Cell"
                  className="flex-1 rounded-lg border border-rise-border bg-white px-2 py-1 text-xs"
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  const rows = (block.rows || []).filter((_, k) => k !== r);
                  onChange({ rows });
                }}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const colCount = (block.headers || []).length;
                onChange({ rows: [...(block.rows || []), Array(colCount).fill("")] });
              }}
              className="text-xs font-medium text-rise-blue-dark hover:underline"
            >
              + Add row
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({
                  headers: [...(block.headers || []), ""],
                  rows: (block.rows || []).map((r) => [...r, ""]),
                });
              }}
              className="text-xs font-medium text-rise-blue-dark hover:underline"
            >
              + Add column
            </button>
          </div>
        </div>
      );

    case "callout":
      return (
        <div className="space-y-2">
          <select
            value={block.calloutType || "info"}
            onChange={(e) => onChange({ calloutType: e.target.value as any })}
            className="rounded-lg border border-rise-border bg-white px-2 py-1.5 text-sm"
          >
            {CALLOUT_TYPES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <textarea
            value={block.text || ""}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Callout text"
            rows={2}
            className="w-full rounded-lg border border-rise-border bg-white px-3 py-2 text-sm"
          />
        </div>
      );

    case "example":
      return (
        <textarea
          value={block.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Example text"
          rows={2}
          className="w-full rounded-lg border border-rise-border bg-white px-3 py-2 text-sm"
        />
      );

    case "video":
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={block.videoUrl || ""}
            onChange={(e) => onChange({ videoUrl: e.target.value })}
            placeholder="Video URL (YouTube, Vimeo, etc.)"
            className="w-full rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm"
          />
          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className="w-full rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm"
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={block.imageUrl || ""}
            onChange={(e) => onChange({ imageUrl: e.target.value })}
            placeholder="Image URL"
            className="w-full rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={block.imageAlt || ""}
              onChange={(e) => onChange({ imageAlt: e.target.value })}
              placeholder="Alt text"
              className="flex-1 rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm"
            />
            <input
              type="text"
              value={block.caption || ""}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="Caption"
              className="flex-1 rounded-lg border border-rise-border bg-white px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      );

    case "divider":
      return <p className="text-xs text-rise-muted">A horizontal divider line.</p>;

    default:
      return null;
  }
}
