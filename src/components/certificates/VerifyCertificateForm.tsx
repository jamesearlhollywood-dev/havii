"use client";

export function VerifyCertificateForm({ initialId }: { initialId: string }) {
  return (
    <form action="/verify-certificate" method="get" className="space-y-4">
      <div>
        <label htmlFor="id" className="block text-sm font-medium text-rise-navy">
          Certificate ID
        </label>
        <input
          id="id"
          name="id"
          type="text"
          defaultValue={initialId}
          placeholder="e.g. RISE-2026-ABCD1234"
          className="mt-1 w-full rounded-xl border border-rise-border bg-white px-3.5 py-2.5 text-sm font-mono text-rise-navy placeholder:text-rise-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-rise-blue"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-rise-navy px-6 py-3 text-sm font-semibold text-white hover:bg-rise-navy-light"
      >
        Verify Certificate
      </button>
    </form>
  );
}
