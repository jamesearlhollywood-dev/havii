"use client";

import { useMemo, useState } from "react";
import { PubCover } from "./PubCover";

type Tone = "navy" | "blue" | "gold";

type Publication = {
  id: number;
  title: string;
  type: string;
  topic: string;
  year: string;
  date: string;
  summary: string;
  authors: string;
  tone: Tone;
};

const PUBLICATION_TYPES = [
  "Research Journal",
  "Research Report",
  "Policy Brief",
  "Issue Brief",
  "Evaluation Report",
  "White Paper",
  "Article",
  "Toolkit",
];

const TOPICS = [
  "Youth Mental Health & Well-Being",
  "Grief, Loss & Social Isolation",
  "Mentorship & Positive Youth Development",
  "Career Readiness & Workforce Development",
  "Family & Community Support",
  "Digital Education & AI Literacy",
  "Equity, Policy & Systems Change",
];

const YEARS = ["2026", "2025", "2024"];

const PUBLICATIONS: Publication[] = [
  { id: 1, title: "[Publication Title Placeholder]", type: "Research Journal", topic: "Grief, Loss & Social Isolation", year: "2026", date: "[Month 2026]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "navy" },
  { id: 2, title: "[Publication Title Placeholder]", type: "Research Report", topic: "Youth Mental Health & Well-Being", year: "2026", date: "[Month 2026]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "blue" },
  { id: 3, title: "[Publication Title Placeholder]", type: "Policy Brief", topic: "Equity, Policy & Systems Change", year: "2025", date: "[Month 2025]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "navy" },
  { id: 4, title: "[Publication Title Placeholder]", type: "Issue Brief", topic: "Family & Community Support", year: "2025", date: "[Month 2025]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "gold" },
  { id: 5, title: "[Publication Title Placeholder]", type: "Evaluation Report", topic: "Mentorship & Positive Youth Development", year: "2025", date: "[Month 2025]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "blue" },
  { id: 6, title: "[Publication Title Placeholder]", type: "White Paper", topic: "Digital Education & AI Literacy", year: "2024", date: "[Month 2024]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "navy" },
  { id: 7, title: "[Publication Title Placeholder]", type: "Article", topic: "Career Readiness & Workforce Development", year: "2024", date: "[Month 2024]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "gold" },
  { id: 8, title: "[Publication Title Placeholder]", type: "Toolkit", topic: "Mentorship & Positive Youth Development", year: "2024", date: "[Month 2024]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "blue" },
  { id: 9, title: "[Publication Title Placeholder]", type: "Research Report", topic: "Equity, Policy & Systems Change", year: "2025", date: "[Month 2025]", summary: "[Short summary placeholder — key focus and findings of this publication.]", authors: "[Author placeholders]", tone: "navy" },
];

const selectClass =
  "rounded-xl border border-tfy-line bg-white px-4 py-2.5 text-sm text-tfy-navy outline-none transition focus:border-tfy-blue focus:ring-2 focus:ring-tfy-blue/20";

export function PublicationsLibrary() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PUBLICATIONS.filter((p) => {
      if (topic !== "All" && p.topic !== topic) return false;
      if (type !== "All" && p.type !== type) return false;
      if (year !== "All" && p.year !== year) return false;
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.summary.toLowerCase().includes(q) &&
        !p.authors.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [search, topic, type, year]);

  return (
    <section className="bg-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-10 max-w-2xl">
          <p className="meta-label text-tfy-gold">Publications Library</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-tfy-navy sm:text-5xl">
            Search our publications
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-tfy-muted">
            Browse, search, and filter TFY&apos;s research reports, briefs,
            evaluations, and resources. Publications will be added as they
            are completed.
          </p>
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-tfy-line bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-tfy-muted"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, summary, or author…"
                className="w-full rounded-xl border border-tfy-line bg-tfy-parchment/40 py-2.5 pl-11 pr-4 text-sm text-tfy-navy outline-none transition focus:border-tfy-blue focus:ring-2 focus:ring-tfy-blue/20"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1.5">
                <span className="meta-label text-[0.625rem] text-tfy-muted">Topic</span>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={selectClass}
                >
                  <option value="All">All Topics</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="meta-label text-[0.625rem] text-tfy-muted">Publication Type</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={selectClass}
                >
                  <option value="All">All Types</option>
                  {PUBLICATION_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="meta-label text-[0.625rem] text-tfy-muted">Year</span>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={selectClass}
                >
                  <option value="All">All Years</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mt-6 meta-label text-tfy-muted">
          {filtered.length} {filtered.length === 1 ? "publication" : "publications"}
        </p>

        {/* Results grid */}
        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pub) => (
              <article
                key={pub.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-tfy-line bg-white transition-all duration-300 hover:border-tfy-blue/30 hover:shadow-lg"
              >
                {/* Cover thumbnail */}
                <PubCover
                  type={pub.type}
                  title={pub.title}
                  tone={pub.tone}
                  className="aspect-[16/9] w-full rounded-none"
                />

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="meta-label text-[0.625rem] text-tfy-blue">
                      {pub.type}
                    </span>
                    <span className="text-xs text-tfy-muted">{pub.date}</span>
                  </div>

                  <h3 className="mt-3 font-display text-lg leading-tight text-tfy-navy">
                    {pub.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-tfy-muted">
                    {pub.summary}
                  </p>

                  <p className="mt-4 meta-label text-[0.625rem] text-tfy-muted">
                    {pub.authors}
                  </p>

                  {/* Actions */}
                  <div className="mt-5 flex items-center gap-4 border-t border-tfy-line pt-4">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-tfy-blue transition-colors hover:text-tfy-gold"
                    >
                      Read More
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-tfy-navy transition-colors hover:text-tfy-gold"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      PDF
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-tfy-line bg-white p-12 text-center">
            <p className="text-base text-tfy-muted">
              No publications match your filters. Try adjusting your search.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
