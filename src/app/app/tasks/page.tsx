import { listTasksAction } from "@/actions/career-tasks";
import { getJobApplications } from "@/actions/job-application";
import { TasksView } from "@/components/career/TasksView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tasks" };

export default async function TasksPage() {
  const [tasksResult, jobs] = await Promise.all([
    listTasksAction(),
    getJobApplications(),
  ]);

  const jobLookup = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
  }));

  return (
    <TasksView initialTasks={tasksResult.tasks} jobs={jobLookup} />
  );
}
