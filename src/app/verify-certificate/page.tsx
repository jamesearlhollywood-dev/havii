import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { MarketingHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { VerifyCertificateForm } from "@/components/certificates/VerifyCertificateForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verify Certificate" };

export default async function VerifyCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  let result: { found: boolean; data?: any; error?: string } | null = null;

  if (params.id) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("certificate_id", params.id)
      .maybeSingle();

    if (error) {
      result = { found: false, error: "Unable to verify at this time." };
    } else if (data) {
      result = { found: true, data };
    } else {
      result = { found: false, error: "No certificate found with that ID." };
    }
  }

  return (
    <div className="min-h-screen bg-rise-sky">
      <MarketingHeader />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-rise-navy">Verify a Certificate</h1>
        <p className="mt-2 text-rise-muted">
          Enter a certificate ID to verify its authenticity.
        </p>

        <div className="mt-6">
          <Card>
            <VerifyCertificateForm initialId={params.id || ""} />
          </Card>
        </div>

        {result && (
          <div className="mt-6">
            {result.found && result.data.status === "issued" ? (
              <Card className="border-rise-success/30 bg-rise-success-light">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="text-lg font-bold text-rise-success">Certificate Verified</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <p><span className="text-rise-muted">Student:</span> <span className="font-medium text-rise-navy">{result.data.student_name}</span></p>
                      <p><span className="text-rise-muted">Course:</span> <span className="font-medium text-rise-navy">{result.data.course_name}</span></p>
                      <p><span className="text-rise-muted">Issued:</span> <span className="font-medium text-rise-navy">{formatDate(result.data.issued_at)}</span></p>
                      <p><span className="text-rise-muted">Certificate ID:</span> <span className="font-mono font-medium text-rise-navy">{result.data.certificate_id}</span></p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : result.data?.status === "revoked" ? (
              <Card className="border-red-200 bg-red-50">
                <p className="text-lg font-bold text-red-700">Certificate Revoked</p>
                <p className="mt-1 text-sm text-red-600">This certificate is no longer valid.</p>
              </Card>
            ) : (
              <Card className="border-red-200 bg-red-50">
                <p className="text-lg font-bold text-red-700">Not Found</p>
                <p className="mt-1 text-sm text-red-600">{result.error}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
