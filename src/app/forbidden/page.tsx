import Link from "next/link";

export const metadata = { title: "Access Denied" };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rise-sky px-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rise-navy text-2xl font-bold text-white">
          R
        </div>
        <h1 className="mt-6 text-3xl font-bold text-rise-navy">Access Denied</h1>
        <p className="mt-2 text-rise-muted">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-rise-navy px-6 py-3 text-sm font-semibold text-white hover:bg-rise-navy-light"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
