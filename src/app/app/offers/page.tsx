export const dynamic = "force-dynamic";
export const metadata = { title: "Offers & Salary" };

import { listOffersAction } from "@/actions/offers";
import { getJobApplications } from "@/actions/job-application";
import { OffersSalaryView } from "@/components/career/offers/OffersSalaryView";
import { getUserName } from "@/lib/profile";

export default async function OffersPage() {
  const [offersResult, jobs, userName] = await Promise.all([
    listOffersAction(),
    getJobApplications(),
    getUserName(),
  ]);

  const jobLookup = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
  }));

  return (
    <OffersSalaryView
      initialOffers={offersResult.offers}
      jobs={jobLookup}
      userName={userName ?? "there"}
      loadError={offersResult.error}
    />
  );
}
