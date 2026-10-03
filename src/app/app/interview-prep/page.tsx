export const dynamic = "force-dynamic";
export const metadata = { title: "Interview Prep" };

export default function InterviewPrepPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-career-navy">Interview Prep</h1>
        <p className="mt-1 text-sm text-career-slate">
          Practice with AI-powered mock interviews and get instant feedback on your responses.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon="🎤"
          title="Mock Interviews"
          body="Practice behavioral and technical questions tailored to your target role."
        />
        <FeatureCard
          icon="💬"
          title="AI Feedback"
          body="Get instant feedback on your responses with scoring and suggestions."
        />
        <FeatureCard
          icon="📊"
          title="Track Progress"
          body="Review past sessions and see your improvement over time."
        />
      </div>

      {/* Not connected state */}
      <div className="rounded-xl border border-career-border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
          🎤
        </div>
        <h2 className="mt-4 text-lg font-semibold text-career-navy">
          AI Provider Not Connected
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-career-slate">
          Interview Prep is designed to connect to any AI provider. Once an AI
          API key is configured, you&apos;ll be able to run mock interview sessions,
          receive AI-generated questions, and get feedback on your responses.
        </p>
        <div className="mx-auto mt-6 max-w-md rounded-lg bg-career-surface p-4 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-career-slate">
            Architecture
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-career-slate">
            <li>• Sessions stored in the <code className="text-career-navy">interview_sessions</code> entity</li>
            <li>• Link sessions to specific job applications</li>
            <li>• AI provider abstraction ready for connection</li>
            <li>• Questions, responses, feedback, and scoring tracked</li>
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
