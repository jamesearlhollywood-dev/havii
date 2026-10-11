import type { Course } from "./course-types";
import { module1 } from "./modules/module1";
import { module2 } from "./modules/module2";
import { module3 } from "./modules/module3";
import { module4 } from "./modules/module4";
import { module5 } from "./modules/module5";
import { module6 } from "./modules/module6";

export const course: Course = {
  id: "rise-usa",
  title: "RISE USA: Roadmap to Income, Savings, and Equity",
  subtitle: "A financial-literacy and financial-readiness program for high school juniors and seniors.",
  description:
    "RISE USA gives you the real-world financial knowledge you need to build a strong financial future. Six modules cover income, banking, budgeting, credit, education financing, investing, and the financial decisions of adult life. Start Small. Scale Smart. Stay Consistent. Build What Lasts.",
  brandMessage: "Build What Lasts.",
  philosophy: "Start Small. Scale Smart. Stay Consistent.",
  modules: [module1, module2, module3, module4, module5, module6],
};

export const modules = course.modules;

export function getModule(moduleId: string) {
  return modules.find((m) => m.id === moduleId);
}

export function getModuleByNumber(num: number) {
  return modules.find((m) => m.number === num);
}

export function getLesson(moduleId: string, lessonId: string) {
  const mod = getModule(moduleId);
  return mod?.lessons.find((l) => l.id === lessonId);
}

export function getNextLesson(moduleId: string, lessonId: string) {
  const mod = getModule(moduleId);
  if (!mod) return null;
  const idx = mod.lessons.findIndex((l) => l.id === lessonId);
  if (idx === -1 || idx >= mod.lessons.length - 1) return null;
  return mod.lessons[idx + 1];
}

export function getPrevLesson(moduleId: string, lessonId: string) {
  const mod = getModule(moduleId);
  if (!mod) return null;
  const idx = mod.lessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return null;
  return mod.lessons[idx - 1];
}

export const blueprintSections = [
  { number: 1, key: "income_banking", title: "Income, Paycheck & Banking Plan", moduleId: "module-1" },
  { number: 2, key: "budget_savings", title: "Monthly Budget & Emergency Savings Plan", moduleId: "module-2" },
  { number: 3, key: "credit_borrowing", title: "Credit & Borrowing Rules", moduleId: "module-3" },
  { number: 4, key: "education_financing", title: "Education Financing Plan", moduleId: "module-4" },
  { number: 5, key: "saving_investing", title: "Saving & Investing Plan", moduleId: "module-5" },
  { number: 6, key: "protection_plan", title: "Transportation, Housing, Insurance & Protection Plan", moduleId: "module-6" },
];

export const PASSING_SCORE = 70;
export const TOTAL_LESSONS = modules.reduce((sum, m) => sum + m.lessons.length, 0);
