import { Alert } from "@/components/ui/Alert";
import type { YouthConsentStatus } from "@/lib/consentConstants";

const STATUS_CONFIG: Record<
  YouthConsentStatus,
  { title: string; tone: "info" | "warning" | "success" | "error"; message: string }
> = {
  invitation_needed: {
    title: "Invitation Needed",
    tone: "info",
    message:
      "You haven't sent a caregiver invitation yet. Enter your caregiver's details below to request their consent.",
  },
  awaiting_permission: {
    title: "Awaiting Permission",
    tone: "warning",
    message:
      "An invitation has been sent to your caregiver. Protected features will unlock once they approve. You can resend the invitation if needed.",
  },
  approved: {
    title: "Approved",
    tone: "success",
    message:
      "Your caregiver has approved your participation. You now have full access to HAVII's program features.",
  },
  not_approved: {
    title: "Not Approved",
    tone: "error",
    message:
      "Your caregiver has not approved your participation, or consent was withdrawn. Protected features are locked. You can send a new invitation to try again.",
  },
};

export function ConsentStatusCard({
  status,
  caregiverName,
  caregiverEmail,
}: {
  status: YouthConsentStatus;
  caregiverName?: string;
  caregiverEmail?: string;
}) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-havii-ink">Consent status</h2>
      </div>
      <Alert tone={config.tone}>
        <p className="font-medium">{config.title}</p>
        <p className="mt-1">{config.message}</p>
        {status === "awaiting_permission" && caregiverName && caregiverEmail && (
          <p className="mt-2 text-xs">
            Sent to: {caregiverName} ({caregiverEmail})
          </p>
        )}
        {status === "not_approved" && caregiverName && caregiverEmail && (
          <p className="mt-2 text-xs">
            Last invitation to: {caregiverName} ({caregiverEmail})
          </p>
        )}
      </Alert>
    </div>
  );
}
