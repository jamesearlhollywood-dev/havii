import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, getProfile } from "@/lib/session";
import { getInvitationByToken, expireOldInvitations } from "@/lib/caregiver";
import { CaregiverReviewForm } from "@/components/caregiver/CaregiverReviewForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default async function ConsentReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Invalid Link</h1>
          <Alert tone="error">No invitation token was provided.</Alert>
          <Link href="/"><Button variant="outline" size="lg" className="w-full">Go to HAVII</Button></Link>
        </div>
      </div>
    );
  }

  // Require authentication
  const session = await getSession();
  if (!session) {
    redirect(`/auth/login?next=${encodeURIComponent(`/consent/review?token=${token}`)}`);
  }

  // Verify the invitation
  await expireOldInvitations();
  const invitation = await getInvitationByToken(token);

  if (!invitation || invitation.status !== "pending" || new Date(invitation.expires_at) <= new Date()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Invitation Invalid</h1>
          <Alert tone="error">
            This invitation is no longer valid. It may have expired, been used, or been replaced.
            Please ask the youth to send a new invitation.
          </Alert>
          <Link href="/caregiver"><Button variant="outline" size="lg" className="w-full">Go to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  // Verify email match
  if (session.email !== invitation.caregiver_email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Email Mismatch</h1>
          <Alert tone="error">
            You are signed in as {session.email}, but this invitation was sent to{" "}
            {invitation.caregiver_email}. Please sign out and use the correct email.
          </Alert>
          <Link href="/auth/logout"><Button variant="outline" size="lg" className="w-full">Sign Out</Button></Link>
        </div>
      </div>
    );
  }

  // Prevent self-approval
  if (session.userId === invitation.youth_user_id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Cannot Self-Approve</h1>
          <Alert tone="error">
            You cannot provide consent for your own account. A caregiver must approve from a separate account.
          </Alert>
          <Link href="/app"><Button variant="outline" size="lg" className="w-full">Go to HAVII</Button></Link>
        </div>
      </div>
    );
  }

  // Verify the user has a caregiver profile
  const profile = await getProfile();
  if (!profile || profile.role !== "caregiver") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Wrong Account Type</h1>
          <Alert tone="error">
            This invitation is for a caregiver, but your account is not a caregiver account.
            Please sign out and create a caregiver account using the invitation link.
          </Alert>
          <Link href="/auth/logout"><Button variant="outline" size="lg" className="w-full">Sign Out</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
      <div className="w-full max-w-sm">
        <CaregiverReviewForm
          token={token}
          youthName={invitation.youth_preferred_name}
          caregiverEmail={invitation.caregiver_email}
        />
      </div>
    </div>
  );
}
