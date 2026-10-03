"use client";

import { useActionState, useEffect } from "react";
import { saveCareerProfileAction } from "@/actions/career-profile";
import type { CareerProfileState } from "@/actions/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { CareerProfile } from "@/lib/career/types";
import { WORK_MODES } from "@/lib/career/types";

const workPrefOptions = WORK_MODES.map((w) => ({ value: w, label: w }));

export function CareerProfileForm({ profile }: { profile: CareerProfile | null }) {
  const [state, action, pending] = useActionState<CareerProfileState, FormData>(
    saveCareerProfileAction,
    {}
  );

  useEffect(() => {
    if (state.success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.success]);

  return (
    <form action={action} className="space-y-6">
      {state.success ? (
        <Alert tone="success">{state.success}</Alert>
      ) : null}
      {state.error ? (
        <Alert tone="error">{state.error}</Alert>
      ) : null}

      <FormSection title="Basic Information">
        <Input
          name="full_name"
          label="Full name"
          defaultValue={profile?.full_name ?? ""}
          placeholder="Jane Doe"
        />
        <Input
          name="headline"
          label="Professional headline"
          defaultValue={profile?.headline ?? ""}
          placeholder="Senior Product Manager"
        />
        <Input
          name="location"
          label="Location"
          defaultValue={profile?.location ?? ""}
          placeholder="San Francisco, CA"
        />
        <Input
          name="years_experience"
          type="number"
          label="Years of experience"
          defaultValue={profile?.years_experience?.toString() ?? ""}
          placeholder="5"
        />
      </FormSection>

      <FormSection title="Target Roles & Skills">
        <Input
          name="target_roles"
          label="Target job titles"
          hint="Comma-separated, e.g. Product Manager, Program Manager"
          defaultValue={(profile?.target_roles ?? []).join(", ")}
          placeholder="Product Manager, Program Manager"
        />
        <Input
          name="skills"
          label="Skills"
          hint="Comma-separated, e.g. Python, SQL, Project Management"
          defaultValue={(profile?.skills ?? []).join(", ")}
          placeholder="Python, SQL, Project Management"
        />
        <div className="sm:col-span-2">
          <Textarea
            name="summary"
            label="Professional summary"
            defaultValue={profile?.summary ?? ""}
            placeholder="A brief summary of your experience and career goals..."
          />
        </div>
      </FormSection>

      <FormSection title="Salary & Work Preferences">
        <Input
          name="salary_min"
          type="number"
          label="Minimum desired salary"
          defaultValue={profile?.salary_min?.toString() ?? ""}
          placeholder="80000"
        />
        <Input
          name="salary_max"
          type="number"
          label="Maximum desired salary"
          defaultValue={profile?.salary_max?.toString() ?? ""}
          placeholder="120000"
        />
        <Select
          name="work_preferences"
          label="Preferred work arrangement"
          options={[{ value: "", label: "No preference" }, ...workPrefOptions]}
          defaultValue={profile?.work_preferences ?? ""}
        />
      </FormSection>

      <FormSection title="Links">
        <Input
          name="linkedin_url"
          label="LinkedIn URL"
          defaultValue={profile?.linkedin_url ?? ""}
          placeholder="https://linkedin.com/in/janedoe"
        />
        <Input
          name="portfolio_url"
          label="Portfolio or personal website"
          defaultValue={profile?.portfolio_url ?? ""}
          placeholder="https://janedoe.com"
        />
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" loading={pending} size="lg">
          Save Profile
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-career-border bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-career-navy">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
