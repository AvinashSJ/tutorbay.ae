-- Fix RLS policies to allow anonymous inserts
DROP POLICY IF EXISTS "Authenticated users can insert analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Anon can read analytics" ON public.analytics_events;

-- Allow anonymous users to insert (for client-side tracking)
CREATE POLICY "Anon can insert analytics"
  ON public.analytics_events FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can insert analytics"
  ON public.analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow anyone to read (for dashboards)
CREATE POLICY "Everyone can read analytics"
  ON public.analytics_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow service role full access
CREATE POLICY "Service role can manage analytics"
  ON public.analytics_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);