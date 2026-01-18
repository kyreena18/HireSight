import { getSupabaseClient } from '@/lib/supabaseClient';

export interface Application {
  id: string;
  resume_id: string;
  job_id: string;
  candidate_id: string;
  match_score: number;
  suitability: string;
  matched_skills: string[];
  missing_skills: string[];
  insights: any;
  status: string;
  applied_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  resume_id: string;
  job_id: string;
  match_score?: number;
  suitability?: string;
  matched_skills?: string[];
  missing_skills?: string[];
  insights?: any;
}

export async function createApplication(input: CreateApplicationInput): Promise<Application> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      resume_id: input.resume_id,
      job_id: input.job_id,
      candidate_id: user.id,
      match_score: input.match_score || 0,
      suitability: input.suitability || 'not-suitable',
      matched_skills: input.matched_skills || [],
      missing_skills: input.missing_skills || [],
      insights: input.insights || [],
      status: 'under-review',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create application: ${error.message}`);
  }

  return data;
}

export async function getCandidateApplications(): Promise<Application[]> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('candidate_id', user.id)
    .order('applied_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return data || [];
}

export async function getJobApplications(jobId: string): Promise<Application[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return data || [];
}

export async function getApplicationById(id: string): Promise<Application> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch application: ${error.message}`);
  }

  return data;
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  notes?: string
): Promise<Application> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('applications')
    .update({
      status,
      notes: notes || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update application: ${error.message}`);
  }

  return data;
}

export async function deleteApplication(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete application: ${error.message}`);
  }
}
