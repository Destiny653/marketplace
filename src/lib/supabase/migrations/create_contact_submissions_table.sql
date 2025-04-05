-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create an index for faster lookups by status
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_submission_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
DROP TRIGGER IF EXISTS update_contact_submission_timestamp ON public.contact_submissions;
CREATE TRIGGER update_contact_submission_timestamp
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_contact_submission_timestamp();

-- Add RLS policies
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert contact submissions
DROP POLICY IF EXISTS "Allow users to submit contact forms" ON public.contact_submissions;
CREATE POLICY "Allow users to submit contact forms"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow only admins to view and update contact submissions
DROP POLICY IF EXISTS "Allow admins to view contact submissions" ON public.contact_submissions;
CREATE POLICY "Allow admins to view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

DROP POLICY IF EXISTS "Allow admins to update contact submissions" ON public.contact_submissions;
CREATE POLICY "Allow admins to update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));