/**
 * Resume parsing service interface.
 *
 * The parser takes raw resume text (extracted from a PDF/DOCX) and returns
 * structured, normalized data.  The implementation is intentionally separate
 * from the UI so we can swap a local heuristic parser for an external resume
 * parsing API later without touching components or server actions.
 */

import type { ParsedResumeData } from "@/lib/career/types";

export interface ResumeParser {
  /** Parse raw resume text into structured data. */
  parse(rawText: string): ParsedResumeData;
}

// ---------------------------------------------------------------------------
// Local heuristic parser
// ---------------------------------------------------------------------------

const SECTION_PATTERNS: Record<keyof ParsedResumeData, RegExp> = {
  candidate_name: /(?:^|\n)\s*(?:name|full name)\s*[:\-]\s*(.+?)(?:\n|$)/i,
  headline: /(?:^|\n)\s*(?:headline|title|professional title|current title)\s*[:\-]\s*(.+?)(?:\n|$)/i,
  summary: /(?:^|\n)\s*(?:summary|profile|objective|about|professional summary)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:experience|work|employment|education|skills|certifications?|projects|awards)\b|$)/i,
  skills: /(?:^|\n)\s*(?:skills|technical skills|core competencies|key skills)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:experience|work|employment|education|certifications?|projects|awards|languages)\b|$)/i,
  work_experience: /(?:^|\n)\s*(?:experience|work experience|employment history|professional experience|work history)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:education|skills|certifications?|projects|awards|languages)\b|$)/i,
  education: /(?:^|\n)\s*(?:education|academic background|education history)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:experience|work|skills|certifications?|projects|awards|languages)\b|$)/i,
  certifications: /(?:^|\n)\s*(?:certifications?|certificates?|licenses?|credentials?)\s*[:\-]?\s*\n([\s\S]*?)(?=\n\s*(?:experience|work|education|skills|projects|awards|languages)\b|$)/i,
  keywords: /(?:^|\n)\s*(?:keywords|key terms)\s*[:\-]?\s*\n([\s\S]*?)(?=\n|$)/i,
};

const DATE_RANGE_RE =
  /((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2})\s*[/\s.,-]*\s*\d{4})\s*(?:[-–—to]+\s*|until\s*)?\s*((?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{1,2})\s*[/\s.,-]*\s*\d{4}|present|current|now)?/i;

const SKILL_HINTS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby",
  "php", "swift", "kotlin", "scala", "sql", "nosql", "postgresql", "mysql",
  "mongodb", "redis", "react", "vue", "angular", "svelte", "next.js", "node.js",
  "express", "django", "flask", "fastapi", "spring", "rails", "graphql", "rest",
  "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins",
  "git", "ci/cd", "html", "css", "tailwind", "sass", "webpack", "vite", "redux",
  "tableau", "power bi", "excel", "pandas", "numpy", "scikit-learn", "tensorflow",
  "pytorch", "machine learning", "deep learning", "nlp", "data analysis",
  "project management", "agile", "scrum", "kanban", "jira", "confluence",
  "figma", "sketch", "photoshop", "illustrator", "marketing", "seo", "sem",
  "salesforce", "hubspot", "crm", "erp", "sap", "oracle", "leadership",
  "communication", "collaboration", "problem solving", "critical thinking",
];

function clean(text: string): string {
  return text.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
}

function splitListItems(text: string): string[] {
  return text
    .split(/[\n•·▪◦‣\-–—|,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 80);
}

function extractName(rawText: string): string | null {
  // Try explicit label first
  const m = rawText.match(SECTION_PATTERNS.candidate_name);
  if (m) return clean(m[1]).slice(0, 100);

  // Otherwise, first non-empty line that looks like a name (1-5 words, mostly letters)
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 && /^[A-Za-z][A-Za-z\s'.-]+$/.test(line) && line.length < 60) {
      // Skip lines that look like section headers or contact info
      if (/@|tel|phone|address|www\.|http/i.test(line)) continue;
      if (/\b(summary|experience|education|skills|objective)\b/i.test(line)) continue;
      return line.slice(0, 100);
    }
  }
  return null;
}

function extractHeadline(rawText: string): string | null {
  const m = rawText.match(SECTION_PATTERNS.headline);
  if (m) return clean(m[1]).slice(0, 200);

  // Line right after the name — often a job title
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = 1; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (/@|tel|phone|www\.|http|\d{3,}/i.test(line)) continue;
    if (/\b(summary|experience|education|skills|objective)\b/i.test(line)) break;
    // Looks like a job title if it has common title words or is short
    if (line.length < 120 && /\b(senior|junior|lead|principal|manager|engineer|developer|designer|analyst|consultant|specialist|director|architect|administrator|coordinator|officer|associate|intern)\b/i.test(line)) {
      return line.slice(0, 200);
    }
  }
  return null;
}

function extractSection(rawText: string, key: keyof typeof SECTION_PATTERNS): string {
  const m = rawText.match(SECTION_PATTERNS[key]);
  return m ? clean(m[1]) : "";
}

function extractWorkExperience(sectionText: string) {
  if (!sectionText) return [];
  const entries: { job_title: string | null; employer: string | null; start_date: string | null; end_date: string | null; description: string | null }[] = [];

  // Split on blank lines or common separators between jobs
  const blocks = sectionText.split(/\n\s*\n/).filter((b) => b.trim().length > 3);

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    // First line: "Job Title — Company" or "Job Title | Company"
    const firstLine = lines[0];
    let jobTitle: string | null = firstLine;
    let employer: string | null = null;

    const sepMatch = firstLine.match(/\s+[\-–—|@,]\s+(.*)/);
    if (sepMatch) {
      employer = sepMatch[1].trim();
      jobTitle = firstLine.slice(0, sepMatch.index).trim();
    }

    // Or "Company — Job Title"
    if (!employer && firstLine.includes(" at ")) {
      const atMatch = firstLine.match(/^(.+?)\s+at\s+(.+)$/);
      if (atMatch) {
        employer = atMatch[2].trim();
        jobTitle = atMatch[1].trim();
      }
    }

    // Find date range in first 2 lines
    let start_date: string | null = null;
    let end_date: string | null = null;
    for (const line of lines.slice(0, 2)) {
      const dr = line.match(DATE_RANGE_RE);
      if (dr) {
        start_date = dr[1]?.trim() ?? null;
        end_date = dr[2]?.trim() ?? null;
        break;
      }
    }

    // Description = remaining lines
    const descLines = lines.slice(1).filter((l) => !DATE_RANGE_RE.test(l));
    const description = descLines.length > 0 ? descLines.join(" ").slice(0, 500) : null;

    entries.push({
      job_title: jobTitle?.slice(0, 200) || null,
      employer: employer?.slice(0, 200) || null,
      start_date,
      end_date,
      description,
    });
  }

  return entries.length > 0 ? entries : [];
}

function extractEducation(sectionText: string) {
  if (!sectionText) return [];
  const entries: { institution: string | null; degree: string | null; field: string | null; start_date: string | null; end_date: string | null }[] = [];
  const blocks = sectionText.split(/\n\s*\n/).filter((b) => b.trim().length > 3);

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    const firstLine = lines[0];
    let degree: string | null = null;
    let institution: string | null = firstLine;

    // "Degree — Institution" or "Degree, Institution"
    const sepMatch = firstLine.match(/[,–—|]\s*(.*)/);
    if (sepMatch) {
      institution = sepMatch[1].trim();
      degree = firstLine.slice(0, sepMatch.index).trim();
    }

    // Look for degree keywords
    if (!degree) {
      const degMatch = firstLine.match(/\b(b\.?s\.?c?\.?|b\.?a\.?|b\.?eng\.?|m\.?s\.?c?\.?|m\.?a\.?|m\.?ba|ph\.?d|associate|bachelor|master|doctorate|diploma|certificate)\b/i);
      if (degMatch) {
        degree = firstLine.slice(0, 200);
        institution = lines[1]?.slice(0, 200) || null;
      }
    }

    let start_date: string | null = null;
    let end_date: string | null = null;
    for (const line of lines) {
      const dr = line.match(DATE_RANGE_RE);
      if (dr) {
        start_date = dr[1]?.trim() ?? null;
        end_date = dr[2]?.trim() ?? null;
        break;
      }
    }

    const fieldMatch = block.match(/\b(in|of)\s+(computer science|engineering|business|marketing|finance|data science|information technology|psychology|communications?|economics?|mathematics?)\b/i);
    const field = fieldMatch ? fieldMatch[2] : null;

    entries.push({
      institution: institution?.slice(0, 200) || null,
      degree: degree?.slice(0, 200) || null,
      field,
      start_date,
      end_date,
    });
  }

  return entries.length > 0 ? entries : [];
}

function extractKeywords(rawText: string, skills: string[]): string[] {
  const lower = rawText.toLowerCase();
  const found = new Set<string>();
  for (const hint of SKILL_HINTS) {
    if (lower.includes(hint)) {
      found.add(hint);
    }
  }
  // Add skills section items as keywords too
  for (const s of skills) {
    found.add(s.toLowerCase());
  }
  return Array.from(found).slice(0, 50);
}

/** Local heuristic parser — no external API calls. */
export class LocalResumeParser implements ResumeParser {
  parse(rawText: string): ParsedResumeData {
    const text = clean(rawText);
    if (!text) {
      return {
        candidate_name: null,
        headline: null,
        summary: null,
        skills: [],
        work_experience: [],
        education: [],
        certifications: [],
        keywords: [],
      };
    }

    const skillsSection = extractSection(text, "skills");
    const skills = splitListItems(skillsSection);
    const summary = extractSection(text, "summary") || null;
    const workSection = extractSection(text, "work_experience");
    const educationSection = extractSection(text, "education");
    const certsSection = extractSection(text, "certifications");
    const certifications = splitListItems(certsSection);

    return {
      candidate_name: extractName(text),
      headline: extractHeadline(text),
      summary: summary && summary.length > 10 ? summary : null,
      skills,
      work_experience: extractWorkExperience(workSection),
      education: extractEducation(educationSection),
      certifications,
      keywords: extractKeywords(text, skills),
    };
  }
}

/** Singleton local parser instance. */
export const localResumeParser = new LocalResumeParser();
