import Link from "next/link";
import type { CareerTask } from "@/lib/career/types";

/**
 * Dashboard widget showing today's active tasks (up to 5) and upcoming
 * deadlines (up to 5, ordered by due date). Only real stored tasks for the
 * signed-in user — never fabricated.
 */
export function DashboardTasks({
  today,
  upcoming,
}: {
  today: CareerTask[];
  upcoming: CareerTask[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TaskListCard
        title="Today’s Tasks"
        empty="No tasks due today — you're all caught up!"
        tasks={today}
        today={todayStr()}
      />
      <TaskListCard
        title="Upcoming Deadlines"
        empty="No upcoming deadlines."
        tasks={upcoming}
        today={todayStr()}
      />
    </div>
  );
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function TaskListCard({
  title,
  empty,
  tasks,
  today,
}: {
  title: string;
  empty: string;
  tasks: CareerTask[];
  today: string;
}) {
  return (
    <div className="rounded-xl border border-career-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-career-border px-5 py-4">
        <h2 className="font-semibold text-career-navy">{title}</h2>
        <Link
          href="/app/tasks"
          className="text-sm font-medium text-career-blue hover:underline"
        >
          View all
        </Link>
      </div>
      {tasks.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-career-slate">{empty}</p>
        </div>
      ) : (
        <ul className="divide-y divide-career-border">
          {tasks.map((task) => {
            const overdue =
              (task.status === "To Do" || task.status === "In Progress") &&
              !!task.due_date &&
              task.due_date < today;
            const dueToday = task.due_date === today;
            return (
              <li key={task.id}>
                <Link
                  href="/app/tasks"
                  className="flex items-center justify-between px-5 py-3 transition hover:bg-career-surface"
                >
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-medium ${
                        task.status === "Completed"
                          ? "text-career-slate line-through"
                          : "text-career-navy"
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-career-blue">
                        {task.task_type}
                      </span>
                      {overdue && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                          Overdue
                        </span>
                      )}
                      {dueToday && !task.status.includes("Completed") && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          Due today
                        </span>
                      )}
                      {task.priority === "Urgent" && task.status !== "Completed" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-career-slate">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
