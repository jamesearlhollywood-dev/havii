// Email sending utility.
// In production: requires SMTP_URL environment variable and the nodemailer
// package (npm install nodemailer). The invitation link is sent via email.
// In development: the invitation link is returned for on-screen display
// so the flow can be tested without an email server.

export type EmailResult =
  | { delivered: true }
  | { delivered: false; devLink?: string; error?: string };

export async function sendInvitationEmail(
  caregiverEmail: string,
  caregiverName: string,
  youthName: string,
  inviteUrl: string
): Promise<EmailResult> {
  const smtpUrl = process.env.SMTP_URL;

  if (!smtpUrl) {
    // Development mode: return the link for on-screen display.
    if (process.env.NODE_ENV !== "production") {
      return { delivered: false, devLink: inviteUrl };
    }
    return {
      delivered: false,
      error:
        "Email delivery is not configured. Set SMTP_URL and install nodemailer to send invitations.",
    };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport(smtpUrl);

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "HAVII <noreply@togetherforyou.org>",
      to: caregiverEmail,
      subject: `Your consent is needed for ${youthName}'s HAVII account`,
      text: `Hello ${caregiverName},\n\n${youthName} has invited you to provide consent for their HAVII wellness account.\n\nTo review and approve or decline, visit:\n${inviteUrl}\n\nThis link expires in 7 days and can only be used once.\n\nIf you did not expect this invitation, you can safely ignore this email.\n\n— The HAVII Team`,
      html: `<p>Hello ${caregiverName},</p><p>${youthName} has invited you to provide consent for their HAVII wellness account.</p><p><a href="${inviteUrl}">Review and respond to the invitation</a></p><p>This link expires in 7 days and can only be used once.</p><p>If you did not expect this invitation, you can safely ignore this email.</p><p>— The HAVII Team</p>`,
    });

    return { delivered: true };
  } catch {
    // Fall back to dev link so the flow remains testable.
    if (process.env.NODE_ENV !== "production") {
      return { delivered: false, devLink: inviteUrl };
    }
    return { delivered: false, error: "Failed to send invitation email. Check SMTP configuration." };
  }
}
