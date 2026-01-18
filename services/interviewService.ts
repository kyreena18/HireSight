import { getSupabaseClient } from '@/lib/supabaseClient';

export interface Interview {
  id: string;
  application_id: string;
  candidate_id: string;
  recruiter_id: string;
  job_id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  meeting_link: string | null;
  meeting_platform: string | null;
  location: string | null;
  interview_type: string;
  status: string;
  interviewer_notes: string | null;
  rating: number | null;
  recommendation: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInterviewInput {
  application_id: string;
  candidate_id: string;
  job_id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes?: number;
  meeting_link?: string;
  meeting_platform?: string;
  location?: string;
  interview_type?: string;
}

export async function createInterview(input: CreateInterviewInput): Promise<Interview> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('interviews')
    .insert({
      application_id: input.application_id,
      candidate_id: input.candidate_id,
      recruiter_id: user.id,
      job_id: input.job_id,
      title: input.title,
      scheduled_date: input.scheduled_date,
      scheduled_time: input.scheduled_time,
      duration_minutes: input.duration_minutes || 60,
      meeting_link: input.meeting_link || null,
      meeting_platform: input.meeting_platform || null,
      location: input.location || null,
      interview_type: input.interview_type || 'technical',
      status: 'scheduled',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create interview: ${error.message}`);
  }

  return data;
}

export async function getCandidateInterviews(): Promise<Interview[]> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('candidate_id', user.id)
    .order('scheduled_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch interviews: ${error.message}`);
  }

  return data || [];
}

export async function getRecruiterInterviews(): Promise<Interview[]> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('recruiter_id', user.id)
    .order('scheduled_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch interviews: ${error.message}`);
  }

  return data || [];
}

export async function getInterviewById(id: string): Promise<Interview> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch interview: ${error.message}`);
  }

  return data;
}

export async function updateInterview(
  id: string,
  updates: Partial<CreateInterviewInput>
): Promise<Interview> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('interviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update interview: ${error.message}`);
  }

  return data;
}

export async function updateInterviewStatus(
  id: string,
  status: string,
  notes?: string,
  rating?: number,
  recommendation?: string
): Promise<Interview> {
  const supabase = getSupabaseClient();

  const updates: any = { status };
  if (notes) updates.interviewer_notes = notes;
  if (rating) updates.rating = rating;
  if (recommendation) updates.recommendation = recommendation;

  const { data, error } = await supabase
    .from('interviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update interview: ${error.message}`);
  }

  return data;
}

export async function deleteInterview(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete interview: ${error.message}`);
  }
}
