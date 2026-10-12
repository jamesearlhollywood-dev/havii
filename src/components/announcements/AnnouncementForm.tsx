"use client";

import { useActionState } from "react";
import { createAnnouncement } from "@/actions/announcements";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";

export function AnnouncementForm({
  organizations,
  cohorts,
  isInstructor,
}: {
  organizations: { id: string; name: string }[];
  cohorts: { id: string; name: string; organization_id: string }[];
  isInstructor: boolean;
}) {
  const [state, action, pending] = useActionState(createAnnouncement, {});

  const today = new Date().toISOString().split("T")[0];

  // Instructors can only target cohorts
  const audienceOptions = isInstructor
    ? cohorts.map((c) => ({ value: c.id, label: c.name }))
    : [
        { value: "all_users", label: "All RISE USA Users" },
        ...organizations.map((o) => ({ value: o.id, label: `Org: ${o.name}` })),
        ...cohorts.map((c) => ({ value: c.id, label: `Cohort: ${c.name}` })),
        { value: "rise-usa", label: "Course: RISE USA" },
      ];

  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Input name="title" label="Title" required placeholder="Announcement title" />
      <Textarea name="body" label="Message" required placeholder="Announcement message..." />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="audience_type"
          label="Audience"
          options={isInstructor ? [{ value: "cohort", label: "Assigned Cohort" }] : [
            { value: "all_users", label: "All RISE USA Users" },
            { value: "organization", label: "Specific Organization" },
            { value: "cohort", label: "Specific Cohort" },
            { value: "course", label: "Specific Course" },
          ]}
          defaultValue={isInstructor ? "cohort" : "all_users"}
        />
        <Select
          name="audience_id"
          label={isInstructor ? "Select Cohort" : "Specific Target"}
          options={audienceOptions}
          required={isInstructor}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="priority"
          label="Priority"
          options={[
            { value: "standard", label: "Standard" },
            { value: "important", label: "Important" },
            { value: "urgent", label: "Urgent" },
          ]}
        />
        <Input name="publish_date" label="Publish Date" type="date" defaultValue={today} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="expiration_date" label="Expiration Date (optional)" type="date" />
        <Input name="link_url" label="Link URL (optional)" placeholder="/course, /resources, etc." />
      </div>

      <Input name="attachment_url" label="Attachment URL (optional)" placeholder="Link to a file or document" />

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Publish Announcement</Button>
      </div>
    </form>
  );
}
