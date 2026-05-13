-- Drop old policies
DROP POLICY IF EXISTS "Users can manage own TutorProfile" ON public."TutorProfile";
DROP POLICY IF EXISTS "Service role can manage TutorProfile" ON public."TutorProfile";

-- Create policy: users can insert/update their own profile
CREATE POLICY "Users can manage own TutorProfile"
  ON public."TutorProfile"
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = "userId"::text)
  WITH CHECK (auth.uid()::text = "userId"::text);

-- Allow service role full access
CREATE POLICY "Service role can manage TutorProfile"
  ON public."TutorProfile"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);