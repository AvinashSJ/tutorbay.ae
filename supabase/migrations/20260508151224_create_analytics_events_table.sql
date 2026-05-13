-- Analytics Events Table for GA4 + Supabase Mirror
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_id TEXT,
  entity_type TEXT,
  metadata JSONB DEFAULT '{}',
  source TEXT DEFAULT 'web',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_analytics_events_session ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert (for client-side tracking)
CREATE POLICY "Authenticated users can insert analytics"
  ON public.analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow service role to read (for admin dashboards)
CREATE POLICY "Service role can read all analytics"
  ON public.analytics_events FOR SELECT
  TO service_role
  USING (true);

-- Allow anon for reads (for dashboards)
CREATE POLICY "Anon can read analytics"
  ON public.analytics_events FOR SELECT
  TO anon
  USING (true);