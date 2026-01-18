import { getSupabaseClient } from '@/lib/supabaseClient';

export interface JobDescription {
  id: string;
  recruiter_id: string;
  title: string;
  company: string | null;
  description: string;
  requirements: string;
  required_skills: string[];
  preferred_skills: string[];
  min_experience: number;
  max_experience: number | null;
  education_level: string | null;
  location: string | null;
  job_type: string;
  salary_range: string | null;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface CreateJobInput {
  title: string;
  company?: string;
  description: string;
  requirements: string;
  required_skills?: string[];
  preferred_skills?: string[];
  min_experience?: number;
  max_experience?: number;
  education_level?: string;
  location?: string;
  job_type?: string;
  salary_range?: string;
  status?: 'active' | 'closed' | 'draft';
}

export async function createJob(input: CreateJobInput): Promise<JobDescription> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('job_descriptions')
    .insert({
      recruiter_id: user.id,
      title: input.title,
      company: input.company || null,
      description: input.description,
      requirements: input.requirements,
      required_skills: input.required_skills || [],
      preferred_skills: input.preferred_skills || [],
      min_experience: input.min_experience || 0,
      max_experience: input.max_experience || null,
      education_level: input.education_level || null,
      location: input.location || null,
      job_type: input.job_type || 'full-time',
      salary_range: input.salary_range || null,
      status: input.status || 'active',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return data;
}

export async function getJobs(): Promise<JobDescription[]> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('recruiter_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  return data || [];
}

export async function getAllActiveJobs(): Promise<JobDescription[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  return data || [];
}

export async function getJobById(id: string): Promise<JobDescription> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch job: ${error.message}`);
  }

  return data;
}

export async function updateJob(id: string, input: Partial<CreateJobInput>): Promise<JobDescription> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('job_descriptions')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update job: ${error.message}`);
  }

  return data;
}

export async function deleteJob(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('job_descriptions')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete job: ${error.message}`);
  }
}
