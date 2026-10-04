"use server";

// Job Offers — server actions for Salary Research, Offer Comparison, Negotiation.
// Offer storage lives in job_offers (RLS-protected, user-isolated). A JobOffer may
// link to a JobApplication; the user explicitly chooses whether to update the
// application status — status is NEVER changed silently. Salary market data is
// fetched via the provider-agnostic compensation abstraction in
// src/lib/career/salary-research.ts (never fabricated). AI negotiation strategy
// + document drafts delegate to src/lib/career/negotiation.ts. Drafts are saved
// to generated_documents only after the user confirms. A response_deadline can
// create a CareerTask ("Respond to [Company] offer").

import { createClient } from "@/lib/supabase/server";
import { runSalaryEstimate } from "@/lib/career/salary-research";
import { negotiationStrategy, draftNegotiationDocument } from "@/lib/career/negotiation";
import { getCareerProfile } from "@/lib/career/assistant-context";
import type {
  BonusType,
  JobOffer,
  JobOfferInput,
  NegotiationDocumentResult,
  NegotiationDocumentType,
  NegotiationStrategyInput,
  NegotiationStrategyResult,
  OfferStatus,
  SalaryResearchRequest,
  SalaryResearchResult,
  WorkMode,
} from "@/lib/career/types";
import type { OfferActionState } from "@/actions/types";

interface OfferRow {
  id: string;
  user_id: string;
  job_application_id: string | null;
  company: string;
  role_title: string | null;
  base_salary: number | null;
  bonus_amount: number | null;
  bonus_type: BonusType | null;
  equity_value: number | null;
  signing_bonus: number | null;
  retirement_match: number | null;
  health_benefit_value: number | null;
  paid_time_off_days: number | null;
  remote_stipend: number | null;
  relocation_assistance: number | null;
  other_compensation: string | null;
  total_estimated_compensation: number | null;
  location: string | null;
  work_mode: WorkMode | null;
  start_date: string | null;
  response_deadline: string | null;
  offer_status: OfferStatus;
  notes: string | null;
  created_at: string;
}

function rowToOffer(row: OfferRow): JobOffer {
  return {
    id: row.id,
    user_id: row.user_id,
    job_application_id: row.job_application_id,
    company: row.company,
    role_title: row.role_title,
    base_salary: row.base_salary,
    bonus_amount: row.bonus_amount,
    bonus_type: row.bonus_type,
    equity_value: row.equity_value,
    signing_bonus: row.signing_bonus,
    retirement_match: row.retirement_match,
    health_benefit_value: row.health_benefit_value,
    paid_time_off_days: row.paid_time_off_days,
    remote_stipend: row.remote_stipend,
    relocation_assistance: row.relocation_assistance,
    other_compensation: row.other_compensation,
    total_estimated_compensation: row.total_estimated_compensation,
    location: row.location,
    work_mode: row.work_mode,
    start_date: row.start_date,
    response_deadline: row.response_deadline,
    offer_status: row.offer_status,
    notes: row.notes,
    created_date: row.created_at,
  };
}



async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// ---------------------------------------------------------------------------
// List offers
// ---------------------------------------------------------------------------

export async function listOffersAction(): Promise<{
  error?: string;
  offers: JobOffer[];
}> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", offers: [] };
  }
  if (!userId) return { error: "Not authenticated.", offers: [] };

  const { data, error } = await supabase
    .from("job_offers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { error: "Could not load offers.", offers: [] };
  return { offers: (data as OfferRow[]).map(rowToOffer) };
}

export async function getOfferAction(
  id: string
): Promise<{ error?: string; offer: JobOffer | null }> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated.", offer: null };

    const { data, error } = await supabase
      .from("job_offers")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (error || !data) return { error: "Offer not found.", offer: null };
    return { offer: rowToOffer(data as OfferRow) };
  } catch {
    return { error: "Offer not found.", offer: null };
  }
}

// ---------------------------------------------------------------------------
// Create / update / delete offer
// ---------------------------------------------------------------------------

export async function createOfferAction(
  input: JobOfferInput
): Promise<OfferActionState & { id?: string }> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { data, error } = await supabase
      .from("job_offers")
      .insert({
        user_id: user.id,
        job_application_id: input.job_application_id || null,
        company: input.company.trim(),
        role_title: input.role_title?.trim() || null,
        base_salary: input.base_salary,
        bonus_amount: input.bonus_amount,
        bonus_type: input.bonus_type,
        equity_value: input.equity_value,
        signing_bonus: input.signing_bonus,
        retirement_match: input.retirement_match,
        health_benefit_value: input.health_benefit_value,
        paid_time_off_days: input.paid_time_off_days,
        remote_stipend: input.remote_stipend,
        relocation_assistance: input.relocation_assistance,
        other_compensation: input.other_compensation?.trim() || null,
        total_estimated_compensation: input.total_estimated_compensation,
        location: input.location?.trim() || null,
        work_mode: input.work_mode,
        start_date: input.start_date || null,
        response_deadline: input.response_deadline || null,
        offer_status: input.offer_status,
        notes: input.notes?.trim() || null,
      })
      .select("id")
      .single();
    if (error) return { error: "Could not create the offer." };
    return { success: "Offer added.", id: data.id };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not create the offer." };
  }
}

export async function updateOfferAction(
  id: string,
  input: JobOfferInput
): Promise<OfferActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("job_offers")
      .update({
        job_application_id: input.job_application_id || null,
        company: input.company.trim(),
        role_title: input.role_title?.trim() || null,
        base_salary: input.base_salary,
        bonus_amount: input.bonus_amount,
        bonus_type: input.bonus_type,
        equity_value: input.equity_value,
        signing_bonus: input.signing_bonus,
        retirement_match: input.retirement_match,
        health_benefit_value: input.health_benefit_value,
        paid_time_off_days: input.paid_time_off_days,
        remote_stipend: input.remote_stipend,
        relocation_assistance: input.relocation_assistance,
        other_compensation: input.other_compensation?.trim() || null,
        total_estimated_compensation: input.total_estimated_compensation,
        location: input.location?.trim() || null,
        work_mode: input.work_mode,
        start_date: input.start_date || null,
        response_deadline: input.response_deadline || null,
        offer_status: input.offer_status,
        notes: input.notes?.trim() || null,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not update the offer." };
    return { success: "Offer updated." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not update the offer." };
  }
}

export async function deleteOfferAction(id: string): Promise<OfferActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("job_offers")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not delete the offer." };
    return { success: "Offer deleted." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not delete the offer." };
  }
}

// ---------------------------------------------------------------------------
// Salary research (compensation provider — never fabricated)
// ---------------------------------------------------------------------------

export async function salaryResearchAction(
  req: SalaryResearchRequest
): Promise<SalaryResearchResult> {
  return runSalaryEstimate(req);
}

// ---------------------------------------------------------------------------
// Negotiation strategy (AI service operation)
// ---------------------------------------------------------------------------

export async function negotiationStrategyAction(
  input: NegotiationStrategyInput
): Promise<NegotiationStrategyResult> {
  const empty: NegotiationStrategyResult = {
    strategy: null,
    ai_configured: false,
    data_sources: { market_data_verified: false, user_entered: [], ai_generated: false },
  };
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { ...empty, error: "Not authenticated." };

    const { data: offerRow } = await supabase
      .from("job_offers")
      .select("*")
      .eq("id", input.job_offer_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!offerRow) return { ...empty, error: "Offer not found." };
    const offer = rowToOffer(offerRow as OfferRow);

    const profile = await getCareerProfile(supabase, user.id);

    // Optional verified market data (only if a compensation provider is connected)
    let marketData = null;
    if (offer.role_title || offer.location) {
      const res = await runSalaryEstimate({
        title: offer.role_title || "",
        location: offer.location || "",
        years_experience: profile?.years_experience ?? null,
        industry: null,
        company_size: null,
        work_mode: offer.work_mode,
      });
      marketData = res.estimate;
    }

    return negotiationStrategy({ offer, profile, input, marketData });
  } catch (e) {
    return { ...empty, error: "Could not generate a strategy." };
  }
}

// ---------------------------------------------------------------------------
// Negotiation documents — draft + save to GeneratedDocument
// ---------------------------------------------------------------------------

export async function draftNegotiationDocumentAction(args: {
  type: NegotiationDocumentType;
  job_offer_id: string;
  senderName?: string | null;
  extraContext?: string | null;
}): Promise<NegotiationDocumentResult & { error?: string }> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user)
      return { error: "Not authenticated.", subject: "", body: "", ai_provider: null, model: null, saved: false };

    const { data: offerRow } = await supabase
      .from("job_offers")
      .select("*")
      .eq("id", args.job_offer_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!offerRow)
      return { error: "Offer not found.", subject: "", body: "", ai_provider: null, model: null, saved: false };

    const offer = rowToOffer(offerRow as OfferRow);
    return draftNegotiationDocument({
      type: args.type,
      offer,
      senderName: args.senderName,
      extraContext: args.extraContext,
    });
  } catch {
    return { error: "Could not draft the document.", subject: "", body: "", ai_provider: null, model: null, saved: false };
  }
}

export async function saveNegotiationDocumentAction(args: {
  type: NegotiationDocumentType;
  job_offer_id: string;
  subject: string;
  body: string;
  ai_provider: string | null;
  model: string | null;
}): Promise<{ error?: string; success?: string; document_id?: string }> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    // Verify ownership of the offer
    const { data: offerRow } = await supabase
      .from("job_offers")
      .select("id, company, role_title, job_application_id")
      .eq("id", args.job_offer_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!offerRow) return { error: "Offer not found." };

    const labelMap: Record<NegotiationDocumentType, string> = {
      salary_negotiation_email: "Salary negotiation email",
      counteroffer_email: "Counteroffer email",
      benefits_negotiation_email: "Benefits negotiation email",
      offer_acceptance_email: "Offer acceptance email",
      offer_decline_email: "Offer decline email",
    };

    const { data, error } = await supabase
      .from("generated_documents")
      .insert({
        user_id: user.id,
        document_type: args.type,
        title: `${labelMap[args.type]} — ${offerRow.company}`,
        content: `Subject: ${args.subject}\n\n${args.body}`,
        job_application_id: offerRow.job_application_id,
        prompt_context: "Negotiation document",
        ai_provider: args.ai_provider,
        model_name: args.model,
      })
      .select("id")
      .single();
    if (error) return { error: "Could not save the document." };
    return { success: "Document saved.", document_id: data.id };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not save the document." };
  }
}

// ---------------------------------------------------------------------------
// Deadline → CareerTask ("Respond to [Company] offer")
// ---------------------------------------------------------------------------

export async function createOfferDeadlineTaskAction(
  job_offer_id: string
): Promise<OfferActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { data: offer } = await supabase
      .from("job_offers")
      .select("id, company, response_deadline, job_application_id")
      .eq("id", job_offer_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!offer) return { error: "Offer not found." };
    if (!offer.response_deadline)
      return { error: "This offer has no response deadline." };

    const title = `Respond to ${offer.company} offer`;

    // Dedupe — avoid creating a duplicate task for the same offer
    const { data: existing } = await supabase
      .from("career_tasks")
      .select("id")
      .eq("user_id", user.id)
      .eq("title", title)
      .eq("task_type", "Offer")
      .maybeSingle();
    if (existing) return { success: "A reminder task already exists for this offer." };

    const { error } = await supabase.from("career_tasks").insert({
      user_id: user.id,
      title,
      description: `Respond to the offer from ${offer.company} before the deadline.`,
      task_type: "Offer",
      related_job_application_id: offer.job_application_id || null,
      due_date: offer.response_deadline,
      priority: "High",
      status: "To Do",
      reminder_enabled: true,
      reminder_date: offer.response_deadline,
      reminder_time: "09:00",
    });
    if (error) return { error: "Could not create the task." };
    return { success: "Reminder task created." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not create the task." };
  }
}

// ---------------------------------------------------------------------------
// Application integration — explicitly update a linked JobApplication status.
// Never changes status silently; the user triggers this from the UI.
// ---------------------------------------------------------------------------

export async function linkOfferToApplicationAction(
  job_offer_id: string,
  job_application_id: string | null
): Promise<OfferActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { error } = await supabase
      .from("job_offers")
      .update({ job_application_id: job_application_id || null })
      .eq("id", job_offer_id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not link the offer." };
    return { success: "Offer linked to application." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not link the offer." };
  }
}

export async function updateApplicationStatusFromOfferAction(args: {
  job_offer_id: string;
  status: "Offer";
}): Promise<OfferActionState> {
  try {
    const { supabase, user } = await getAuthedClient();
    if (!user) return { error: "Not authenticated." };

    const { data: offer } = await supabase
      .from("job_offers")
      .select("job_application_id")
      .eq("id", args.job_offer_id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!offer) return { error: "Offer not found." };
    if (!offer.job_application_id)
      return { error: "This offer is not linked to a job application." };

    const { error } = await supabase
      .from("job_applications")
      .update({ status: args.status, updated_at: new Date().toISOString() })
      .eq("id", offer.job_application_id)
      .eq("user_id", user.id);
    if (error) return { error: "Could not update the application status." };
    return { success: "Application status updated to Offer." };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    return { error: "Could not update the application status." };
  }
}

// ---------------------------------------------------------------------------
// Offers for a specific job application (used on Job Detail)
// ---------------------------------------------------------------------------

export async function getOffersForJobAction(
  job_application_id: string
): Promise<{ error?: string; offers: JobOffer[] }> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { error: "Unable to connect to the database.", offers: [] };
  }
  if (!userId) return { error: "Not authenticated.", offers: [] };

  const { data, error } = await supabase
    .from("job_offers")
    .select("*")
    .eq("user_id", userId)
    .eq("job_application_id", job_application_id)
    .order("created_at", { ascending: false });
  if (error) return { error: "Could not load offers.", offers: [] };
  return { offers: (data as OfferRow[]).map(rowToOffer) };
}

// ---------------------------------------------------------------------------
// Dashboard: upcoming offer deadlines (real data only)
// ---------------------------------------------------------------------------

export async function getDashboardOfferDeadlinesAction(): Promise<{
  deadlines: { id: string; company: string; role_title: string | null; response_deadline: string; offer_status: string }[];
}> {
  let supabase;
  let userId: string | null = null;
  try {
    const ctx = await getAuthedClient();
    supabase = ctx.supabase;
    userId = ctx.user?.id ?? null;
  } catch {
    return { deadlines: [] };
  }
  if (!userId) return { deadlines: [] };

  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("job_offers")
    .select("id, company, role_title, response_deadline, offer_status")
    .eq("user_id", userId)
    .not("response_deadline", "is", null)
    .gte("response_deadline", today)
    .in("offer_status", ["Received", "Negotiating"])
    .order("response_deadline", { ascending: true })
    .limit(5);

  return { deadlines: data ?? [] };
}


