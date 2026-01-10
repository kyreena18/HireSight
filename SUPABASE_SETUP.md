# Supabase Setup Guide for HireSight

## Step 1: Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_schema.sql` into a new query
4. Run the query to create the `resumes` table and policies

## Step 2: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `resumes`
4. Make it **Public** (uncheck "Private bucket")
5. Click **Create bucket**

## Step 3: Set Storage Policies

1. Go to **Storage** → **Policies** → Select `resumes` bucket
2. Click **New Policy** → **For full customization**

### Policy 1: Allow users to upload their own files
```sql
CREATE POLICY "Users can upload own resumes"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Allow users to view their own files
```sql
CREATE POLICY "Users can view own resumes"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 3: Allow users to delete their own files
```sql
CREATE POLICY "Users can delete own resumes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 4: Allow recruiters to view all files
```sql
CREATE POLICY "Recruiters can view all resumes"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'resumes' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'recruiter'
  )
);
```

## Step 4: Verify Environment Variables

Make sure your `.env` file has:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 5: Test the Setup

1. Start your Expo app: `npm start`
2. Register/Login as a candidate
3. Try uploading a resume (PDF or DOCX)
4. Check Supabase Storage to see if the file was uploaded
5. Check the `resumes` table to see if a record was created

## Troubleshooting

- **Upload fails**: Check Storage bucket exists and policies are set correctly
- **Permission denied**: Verify RLS policies on both `resumes` table and storage bucket
- **File not found**: Ensure the file path format matches the policy (user_id/filename)




