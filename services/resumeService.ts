import { getSupabaseClient } from '@/lib/supabaseClient';
import { deleteResumeFile, uploadResume } from '@/lib/supabaseStorage';

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: 'pdf' | 'docx' | 'doc';
  upload_date: string;
  status: 'uploaded' | 'parsing' | 'parsed' | 'analyzed' | 'error';
  tags: string[];
  parsed_data?: {
    skills?: string[];
    education?: Array<{ degree: string; institution: string; year: string }>;
    experience?: Array<{ title: string; company: string; duration: string; description: string }>;
    summary?: string;
  };
  analysis_data?: {
    match_score?: number;
    suitability?: 'strong' | 'moderate' | 'weak';
    matched_skills?: string[];
    missing_skills?: string[];
    insights?: string[];
  };
  created_at: string;
  updated_at: string;
  candidate_name?: string; // For recruiters viewing all resumes
  candidate_email?: string; // For recruiters viewing all resumes
}

export interface CreateResumeInput {
  fileUri: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'doc';
  tags?: string[];
}

/**
 * Create a new resume record after uploading file
 */
export async function createResume(input: CreateResumeInput): Promise<Resume> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Upload file to storage
  const uploadResult = await uploadResume(input.fileUri, input.fileName, input.fileType);

  // Create resume record in database
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      file_name: uploadResult.fileName,
      file_url: uploadResult.fileUrl,
      file_size: uploadResult.fileSize,
      file_type: input.fileType,
      status: 'uploaded',
      tags: input.tags || [],
    })
    .select()
    .single();

  if (error) {
    // Clean up uploaded file if database insert fails
    try {
      await deleteResumeFile(uploadResult.fileUrl);
    } catch (e) {
      console.error('Failed to clean up file:', e);
    }
    throw new Error(`Failed to create resume: ${error.message}`);
  }

  return data;
}

/**
 * Get all resumes for the current user
 */
export async function getResumes(): Promise<Resume[]> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('upload_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch resumes: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all resumes (for recruiters)
 */
export async function getAllResumes(): Promise<Resume[]> {
  const supabase = getSupabaseClient();

  // Fetch resumes
  const { data: resumes, error } = await supabase
    .from('resumes')
    .select('*')
    .order('upload_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch resumes: ${error.message}`);
  }

  if (!resumes || resumes.length === 0) {
    return [];
  }

  // Fetch candidate profiles for each resume
  const userIds = [...new Set(resumes.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', userIds);

  // Create a map of user_id to profile
  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, { name: p.name, email: p.email }])
  );

  // Map the data to include candidate information
  return resumes.map((resume) => {
    const profile = profileMap.get(resume.user_id);
    return {
      ...resume,
      candidate_name: profile?.name || 'Unknown',
      candidate_email: profile?.email || '',
    };
  });
}

/**
 * Get a single resume by ID
 */
export async function getResumeById(id: string): Promise<Resume> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch resume: ${error.message}`);
  }

  return data;
}

/**
 * Update resume status (e.g., after parsing/analysis)
 */
export async function updateResumeStatus(
  id: string,
  status: Resume['status'],
  parsedData?: Resume['parsed_data'],
  analysisData?: Resume['analysis_data']
): Promise<Resume> {
  const supabase = getSupabaseClient();

  const updateData: any = { status };
  if (parsedData) updateData.parsed_data = parsedData;
  if (analysisData) updateData.analysis_data = analysisData;

  const { data, error } = await supabase
    .from('resumes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update resume: ${error.message}`);
  }

  return data;
}

/**
 * Update resume tags
 */
export async function updateResumeTags(id: string, tags: string[]): Promise<Resume> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('resumes')
    .update({ tags })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update tags: ${error.message}`);
  }

  return data;
}

/**
 * Delete a resume
 */
export async function deleteResume(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  // Get resume to get file URL
  const resume = await getResumeById(id);

  // Delete file from storage
  await deleteResumeFile(resume.file_url);

  // Delete record from database
  const { error } = await supabase.from('resumes').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete resume: ${error.message}`);
  }
}

/**
 * Replace a resume (delete old, upload new)
 */
export async function replaceResume(id: string, input: CreateResumeInput): Promise<Resume> {
  // Delete old resume
  await deleteResume(id);

  // Create new resume
  return createResume(input);
}

/**
 * Shortlist or unshortlist a resume
 */
export async function toggleShortlist(id: string, shortlist: boolean): Promise<Resume> {
  const resume = await getResumeById(id);
  const currentTags = resume.tags || [];
  
  let newTags: string[];
  if (shortlist) {
    // Add 'shortlisted' tag if not already present
    newTags = currentTags.includes('shortlisted')
      ? currentTags
      : [...currentTags, 'shortlisted'];
  } else {
    // Remove 'shortlisted' tag
    newTags = currentTags.filter((tag) => tag !== 'shortlisted');
  }

  return updateResumeTags(id, newTags);
}

/**
 * Search interface for filtering resumes
 */
export interface SearchCriteria {
  skills?: string[]; // Array of skills to search for
  education?: string[]; // Array of education levels (e.g., ['bachelor', 'master', 'phd'])
  minExperience?: number; // Minimum years of experience
  candidateName?: string; // Search by candidate name
  status?: Resume['status']; // Filter by status
  jobDescription?: string; // Job description text to match against resume content
}

/**
 * Search shortlisted resumes by criteria
 * Shortlisted resumes are identified by having 'shortlisted' in their tags array
 */
export async function searchShortlistedResumes(criteria?: SearchCriteria): Promise<Resume[]> {
  const supabase = getSupabaseClient();

  // Start building the query
  let query = supabase.from('resumes').select('*');

  // Apply status filter if provided
  if (criteria?.status) {
    query = query.eq('status', criteria.status);
  }

  // Execute the query
  const { data: resumes, error } = await query.order('upload_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch shortlisted resumes: ${error.message}`);
  }

  if (!resumes || resumes.length === 0) {
    return [];
  }

  // Filter for shortlisted resumes (have 'shortlisted' in tags array)
  const shortlistedResumes = resumes.filter((resume) =>
    resume.tags && resume.tags.includes('shortlisted')
  );

  if (shortlistedResumes.length === 0) {
    return [];
  }

  // Fetch candidate profiles for each resume
  const userIds = [...new Set(shortlistedResumes.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', userIds);

  // Create a map of user_id to profile
  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, { name: p.name, email: p.email }])
  );

  // Add candidate information to resumes
  let results = shortlistedResumes.map((resume) => {
    const profile = profileMap.get(resume.user_id);
    return {
      ...resume,
      candidate_name: profile?.name || 'Unknown',
      candidate_email: profile?.email || '',
    };
  });

  // Apply client-side filtering based on criteria
  if (criteria) {
    results = results.filter((resume) => {
      // Filter by skills
      if (criteria.skills && criteria.skills.length > 0) {
        const resumeSkills = resume.parsed_data?.skills || [];
        const resumeSkillsLower = resumeSkills.map((s: string) => s.toLowerCase());
        const hasRequiredSkills = criteria.skills.some((skill) =>
          resumeSkillsLower.some((rs: string) => rs.includes(skill.toLowerCase()))
        );
        if (!hasRequiredSkills) return false;
      }

      // Filter by education
      if (criteria.education && criteria.education.length > 0) {
        const resumeEducation = resume.parsed_data?.education || [];
        const educationText = resumeEducation
          .map((e: { degree: string; institution: string; year: string }) => `${e.degree} ${e.institution}`.toLowerCase())
          .join(' ');
        const hasRequiredEducation = criteria.education.some((edu) =>
          educationText.includes(edu.toLowerCase())
        );
        if (!hasRequiredEducation) return false;
      }

      // Filter by minimum experience
      if (criteria.minExperience && criteria.minExperience > 0) {
        const resumeExperience = resume.parsed_data?.experience || [];
        let totalYears = 0;
        resumeExperience.forEach((exp: { title: string; company: string; duration: string; description: string }) => {
          // Try to extract years from duration string (e.g., "2 years", "18 months")
          const duration = exp.duration || '';
          const yearsMatch = duration.match(/(\d+)\s*(?:year|yr)/i);
          const monthsMatch = duration.match(/(\d+)\s*(?:month|mo)/i);
          if (yearsMatch) {
            totalYears += parseInt(yearsMatch[1], 10);
          } else if (monthsMatch) {
            totalYears += parseInt(monthsMatch[1], 10) / 12;
          }
        });
        if (totalYears < criteria.minExperience) return false;
      }

      // Filter by candidate name
      if (criteria.candidateName && criteria.candidateName.trim()) {
        const candidateName = resume.candidate_name || '';
        if (
          !candidateName.toLowerCase().includes(criteria.candidateName.toLowerCase().trim())
        ) {
          return false;
        }
      }

      // Filter by job description - search in summary, skills, experience, and education
      if (criteria.jobDescription && criteria.jobDescription.trim()) {
        const jobDescLower = criteria.jobDescription.toLowerCase().trim();
        const jobDescTerms = jobDescLower.split(/\s+/).filter(term => term.length > 2); // Filter out short words

        // Build searchable text from resume data
        const searchableText = [
          resume.parsed_data?.summary || '',
          ...(resume.parsed_data?.skills || []),
          ...(resume.parsed_data?.experience || []).map((exp: { title: string; company: string; description: string }) => 
            `${exp.title} ${exp.company} ${exp.description}`
          ),
          ...(resume.parsed_data?.education || []).map((edu: { degree: string; institution: string }) => 
            `${edu.degree} ${edu.institution}`
          ),
        ].join(' ').toLowerCase();

        // Check if any significant terms from job description are found in resume
        const matchingTerms = jobDescTerms.filter(term => searchableText.includes(term));
        // Require at least 30% of terms to match, or at least 2 terms if job description is short
        const minMatches = Math.max(2, Math.ceil(jobDescTerms.length * 0.3));
        if (matchingTerms.length < minMatches) {
          return false;
        }
      }

      return true;
    });
  }

  // Sort by relevance if we have match scores, otherwise by upload date
  return results.sort((a, b) => {
    const scoreA = a.analysis_data?.match_score || 0;
    const scoreB = b.analysis_data?.match_score || 0;
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Higher score first
    }
    // Fallback to upload date
    return new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime();
  });
}