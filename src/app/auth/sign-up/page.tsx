import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-havii-ink">Create your HAVII account</h1>
          <p className="text-sm text-havii-muted">
            A space to reflect, grow, and connect.
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
