-- Fix: allow both anon and authenticated users to subscribe
DROP POLICY IF EXISTS "Anyone can subscribe" ON public."Subscriber";

CREATE POLICY "Anyone can subscribe"
  ON public."Subscriber" FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
