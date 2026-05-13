-- Add missing columns to existing Payment table (created via SQL Editor)
ALTER TABLE public."Payment" ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public."Payment" ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT;
ALTER TABLE public."Payment" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT now();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_tutor_id ON public."Payment"("tutorId");
CREATE INDEX IF NOT EXISTS idx_payment_status ON public."Payment"(status);
CREATE INDEX IF NOT EXISTS idx_payment_created ON public."Payment"("createdAt" DESC);

-- RLS policies
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_payments" ON public."Payment";
CREATE POLICY "service_role_all_payments" ON public."Payment"
  FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "user_select_own_payments" ON public."Payment";
CREATE POLICY "user_select_own_payments" ON public."Payment"
  FOR SELECT TO authenticated USING ("tutorId" = auth.uid()::TEXT);

-- RPC: admin_get_all_payments — superadmin view with user info
CREATE OR REPLACE FUNCTION public.admin_get_all_payments()
RETURNS TABLE(
  id TEXT,
  "tutorId" TEXT,
  email TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT,
  provider TEXT,
  "providerPaymentId" TEXT,
  "stripePaymentIntentId" TEXT,
  metadata JSONB,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  "userEmail" TEXT,
  "userFullName" TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p."tutorId",
    p.email,
    p.amount,
    p.currency,
    p.status::TEXT,
    p.provider,
    p."providerPaymentId",
    p."stripePaymentIntentId",
    p.metadata,
    p."createdAt",
    p."updatedAt",
    COALESCE(u.raw_user_meta_data->>'email', p.email) AS "userEmail",
    COALESCE(u.raw_user_meta_data->>'fullName', u.raw_user_meta_data->>'name', '') AS "userFullName"
  FROM public."Payment" p
  LEFT JOIN auth.users u ON u.id::TEXT = p."tutorId"
  ORDER BY p."createdAt" DESC;
END;
$$;
