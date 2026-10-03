export const dynamic = "force-dynamic";
export const metadata = { title: "Resume AI" };

export default function ResumeAIPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-career-navy">Resume AI</h1>
        <p className="mt-1 text-sm text-career-slate">
          Tailor resumes, generate cover letters, and optimize your application materials with AI.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon="📄"
          title="Resume Library"
          body="Upload and manage multiple resume versions for different target roles."
        />
        <FeatureCard
          icon="✨"
          title="AI Tailoring"
          body="Automatically tailor your resume to match specific job descriptions."
        />
        <FeatureCard
          icon="✉️"
          title="Cover Letters"
          body="Generate customized cover letters for each application."
        />
      </div>

      {/* Not connected state */}
      <div className="rounded-xl border border-career-border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
          ✨
        </div>
        <h2 className="mt-4 text-lg font-semibold text-career-navy">
          AI Provider Not Connected
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-career-slate">
          Resume AI is designed to connect to any AI provider (OpenAI, Anthropic,
          etc.). Once an AI API key is configured, you&apos;ll be able to upload
          resumes, tailor them to job descriptions, and generate cover letters.
        </p>
        <div className="mx-auto mt-6 max-w-md rounded-lg bg-career-surface p-4 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-career-slate">
            Architecture
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-career-slate">
            <li>• Resumes stored in the <code className="text-career-navy">resumes</code> entity</li>
            <li>• Generated documents stored in the <code className="text-career-navy">generated_documents</code> entity</li>
            <li>• AI provider abstraction ready for connection</li>
            <li>• Parsed skills and keywords for matching</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-semibold text-career-navy">{title}</h3>
      <p className="mt-1 text-sm text-career-slate">{body}</p>
    </div>
  );
}
