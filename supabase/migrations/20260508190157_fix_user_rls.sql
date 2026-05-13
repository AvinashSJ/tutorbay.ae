-- Fix User table RLS policies
DROP POLICY IF EXISTS "users_own_row" ON public."User";

-- Allow authenticated users to read their own profile
CREATE POLICY "users_can_read_own" ON public."User"
  FOR SELECT
  TO authenticated
  USING (id = (auth.uid())::text);

-- Allow authenticated users to update their own profile
CREATE POLICY "users_can_update_own" ON public."User"
  FOR UPDATE
  TO authenticated
  USING (id = (auth.uid())::text);

-- Allow authenticated users to insert (for signup)
CREATE POLICY "users_can_insert" ON public."User"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "service_role_all" ON public."User"
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);