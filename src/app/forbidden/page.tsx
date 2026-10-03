import Link from "next/link";

export const metadata = { title: "Forbidden" };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-studio-black px-4">
      <div className="max-w-md rounded-2xl border border-studio-line bg-studio-charcoal p-6 text-center">
        <h1 className="text-lg font-semibold text-studio-ink">
          You don&apos;t have access
        </h1>
        <p className="mt-2 text-sm text-studio-muted">
          That area is reserved for studio staff and administrators. If you
          think this is a mistake, contact the studio.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl bg-studio-gold px-5 py-2.5 text-sm font-semibold text-studio-black hover:bg-studio-gold-light"
          >
            Go to sign in
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-studio-line px-5 py-2.5 text-sm font-semibold text-studio-ink hover:bg-studio-surface"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
