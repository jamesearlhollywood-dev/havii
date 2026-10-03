import { getCareerProfile } from "@/actions/career-profile";
import { CareerProfileForm } from "@/components/career/CareerProfileForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Career Profile" };

export default async function CareerProfilePage() {
  const profile = await getCareerProfile();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-career-navy">Career Profile</h1>
        <p className="mt-1 text-sm text-career-slate">
          Define your target roles, skills, and preferences to guide your job search.
        </p>
      </div>

      <CareerProfileForm profile={profile} />
    </div>
  );
}
