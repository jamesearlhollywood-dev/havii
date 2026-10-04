"use client";

import Link from "next/link";
import { useRef } from "react";
import { PhotoPlaceholder } from "../PhotoPlaceholder";

const PROGRAMS = [
  {
    title: "[Program Name Placeholder]",
    location: "[City], Maryland",
    tag: "Youth Development",
    tone: "warm" as const,
  },
  {
    title: "[Program Name Placeholder]",
    location: "[City], Maryland",
    tag: "Family Support",
    tone: "forest" as const,
  },
  {
    title: "[Program Name Placeholder]",
    location: "[City], Maryland",
    tag: "Community",
    tone: "navy" as const,
  },
  {
    title: "[Program Name Placeholder]",
    location: "[City], Maryland",
    tag: "Mentorship",
    tone: "clay" as const,
  },
];

export function FeaturedPrograms() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <section className="bg-tfy-navy text-tfy-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="meta-label text-tfy-clay">On the Ground</p>
            <h2 className="mt-3 font-display text-4xl text-tfy-parchment sm:text-5xl">
              Featured Programs
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-tfy-parchment/20 text-tfy-parchment transition hover:border-tfy-clay hover:text-tfy-clay"
              aria-label="Scroll programs left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-tfy-parchment/20 text-tfy-parchment transition hover:border-tfy-clay hover:text-tfy-clay"
              aria-label="Scroll programs right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {PROGRAMS.map((p, i) => (
            <article
              key={i}
              className="group w-[340px] flex-none snap-start sm:w-[400px]"
            >
              <PhotoPlaceholder
                label={`Program photo — ${p.tag}`}
                tone={p.tone}
                className="aspect-[4/3] w-full rounded-3xl shadow-xl"
              />
              <div className="mt-5">
                <p className="meta-label text-tfy-clay">{p.tag}</p>
                <h3 className="mt-2 font-display text-2xl text-tfy-parchment">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-tfy-parchment/60">{p.location}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/programs"
            className="meta-label text-tfy-parchment/80 transition-colors hover:text-tfy-clay"
          >
            <span className="border-b border-tfy-parchment/30 pb-0.5 hover:border-tfy-clay">
              Explore all programs →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
