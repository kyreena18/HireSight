import { getSupabaseClient } from './supabaseClient';

const STORAGE_BUCKET = 'resumes';

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

/**
 * Upload a single resume file to Supabase Storage
 */
export async function uploadResume(
  fileUri: string,
  fileName: string,
  fileType: 'pdf' | 'docx' | 'doc'
): Promise<UploadResult> {
  const supabase = getSupabaseClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Read file as blob
  const response = await fetch(fileUri);
  const blob = await response.blob();

  // Create unique file path: user_id/filename_timestamp.ext
  const timestamp = Date.now();
  const fileExt = fileName.split('.').pop();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${userId}/${timestamp}_${sanitizedFileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, blob, {
      contentType: fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return {
    fileUrl: urlData.publicUrl,
    fileName: sanitizedFileName,
    fileSize: blob.size,
  };
}

/**
 * Delete a resume file from Supabase Storage
 */
export async function deleteResumeFile(fileUrl: string): Promise<void> {
  const supabase = getSupabaseClient();

  // Extract file path from URL
  const urlParts = fileUrl.split('/');
  const filePath = urlParts.slice(-2).join('/'); // user_id/filename

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Download a resume file
 */
export async function downloadResume(fileUrl: string): Promise<Blob> {
  const supabase = getSupabaseClient();

  // Extract file path from URL
  const urlParts = fileUrl.split('/');
  const filePath = urlParts.slice(-2).join('/');

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(filePath);

  if (error) {
    throw new Error(`Download failed: ${error.message}`);
  }

  return data;
}




