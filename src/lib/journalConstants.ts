// Journal prompts kept outside the "use server" module so the server-action
// file only exports async functions (Next.js 16 requirement).

export const JOURNAL_PROMPTS = [
  "What has been on your mind today?",
  "What is one thing you wish someone understood?",
  "What helped you through a difficult moment?",
  "What is one small thing you are looking forward to?",
] as const;
