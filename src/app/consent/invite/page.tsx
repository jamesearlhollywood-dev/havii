import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getInvitationByToken, expireOldInvitations } from "@/lib/caregiver";
import { CaregiverSignUpForm } from "@/components/caregiver/CaregiverSignUpForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default async function ConsentInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Invalid Invitation</h1>
          <Alert tone="error">
            This invitation link is missing a token. Please use the link from your invitation email.
          </Alert>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">Go to HAVII</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Expire any old invitations
  await expireOldInvitations();

  // Verify the invitation
  const invitation = await getInvitationByToken(token);
  if (!invitation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Invitation Not Found</h1>
          <Alert tone="error">
            This invitation is no longer valid. It may have expired, been replaced, or already been used.
          </Alert>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">Go to HAVII</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (invitation.status !== "pending") {
    const messages: Record<string, string> = {
      used: "This invitation has already been used.",
      expired: "This invitation has expired. Please ask the youth to send a new invitation.",
      revoked: "This invitation has been replaced or cancelled.",
    };
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Invitation Unavailable</h1>
          <Alert tone="warning">{messages[invitation.status] || "This invitation is no longer valid."}</Alert>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">Go to HAVII</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (new Date(invitation.expires_at) <= new Date()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Invitation Expired</h1>
          <Alert tone="warning">
            This invitation has expired. Please ask the youth to send a new invitation.
          </Alert>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">Go to HAVII</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if the user is already logged in
  const session = await getSession();

  if (session) {
    // Check if their email matches the invitation
    if (session.email === invitation.caregiver_email) {
      // Email matches — redirect to review
      redirect(`/consent/review?token=${token}`);
    }
    // Email doesn't match — show error
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-havii-ink">Email Mismatch</h1>
          <Alert tone="error">
            You are signed in as {session.email}, but this invitation was sent to {invitation.caregiver_email}.
            Please sign out and sign in with the correct email, or create a new account with the invited email.
          </Alert>
          <Link href="/auth/logout">
            <Button variant="outline" size="lg" className="w-full">Sign Out</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not logged in — show invitation details + sign up / sign in options
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-havii-cream px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-havii-ink">HAVII Caregiver Consent</h1>
          <p className="text-sm text-havii-muted">
            {invitation.youth_preferred_name} has invited you to provide consent for their HAVII account.
          </p>
        </div>

        <CaregiverSignUpForm
          token={token}
          caregiverName={invitation.caregiver_name}
          caregiverEmail={invitation.caregiver_email}
        />
      </div>
    </div>
  );
}
