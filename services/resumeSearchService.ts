/**
 * Resume Search Service
 * Integrates with Flask backend for semantic resume search
 */

const FLASK_API_BASE_URL = process.env.EXPO_PUBLIC_FLASK_API_URL || 'http://localhost:6060';

export interface SearchResult {
  id: string;
  name: string;
  similarity: number;
  match_percent?: number;
  preview: string;
  resume: string | null;
  found_in_resume: boolean;
  keywords_found: string[];
  match_type: string;
}

export interface SearchResponse {
  results: SearchResult[];
  message: string;
}

/**
 * Search resumes by Job Description
 */
export async function searchByJobDescription(jd: string): Promise<SearchResponse> {
  try {
    const formData = new FormData();
    formData.append('jd', jd);

    const response = await fetch(`${FLASK_API_BASE_URL}/api/search/jd`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching by JD:', error);
    throw new Error(`Failed to search resumes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search resumes by Skills and Years of Experience
 */
export async function searchBySkills(skills: string, years: string = '0'): Promise<SearchResponse> {
  try {
    const formData = new FormData();
    formData.append('skills', skills);
    formData.append('years', years);

    const response = await fetch(`${FLASK_API_BASE_URL}/api/search/skills`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching by skills:', error);
    throw new Error(`Failed to search resumes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search resumes by Education Level
 */
export async function searchByEducation(levels: string): Promise<SearchResponse> {
  try {
    const formData = new FormData();
    formData.append('levels', levels);

    const response = await fetch(`${FLASK_API_BASE_URL}/api/search/education`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching by education:', error);
    throw new Error(`Failed to search resumes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * General search (can include interview notes)
 */
export async function generalSearch(query: string, includeNotes: boolean = false): Promise<SearchResponse> {
  try {
    const formData = new FormData();
    formData.append('q', query);
    formData.append('include_notes', includeNotes ? 'y' : 'n');

    const response = await fetch(`${FLASK_API_BASE_URL}/api/search/general`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in general search:', error);
    throw new Error(`Failed to search resumes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


