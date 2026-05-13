-- Create Subscriber table for newsletter email collection
CREATE TABLE IF NOT EXISTS public."Subscriber" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."Subscriber" ENABLE ROW LEVEL SECURITY;

-- Index on email for uniqueness checks
CREATE INDEX IF NOT EXISTS idx_subscriber_email ON public."Subscriber"("email");

-- Service role full access
CREATE POLICY "Subscriber service role full access"
  ON public."Subscriber" TO service_role USING (true) WITH CHECK (true);

-- Anyone (including anonymous) can insert an email
CREATE POLICY "Anyone can subscribe"
  ON public."Subscriber" FOR INSERT TO anon
  WITH CHECK (true);

-- Only the owner (by email match — not auth-based) can read their own subscription
-- This is a simple public subscription table, so no SELECT for anon
