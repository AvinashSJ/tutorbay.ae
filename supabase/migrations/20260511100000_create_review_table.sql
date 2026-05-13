-- Create Review table for ratings & reviews between parents/students and tutors
CREATE TABLE IF NOT EXISTS public."Review" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "reviewerId" TEXT REFERENCES public."User"(id) ON DELETE CASCADE,
  "revieweeId" TEXT REFERENCES public."User"(id) ON DELETE CASCADE,
  "requirementId" TEXT REFERENCES public."Requirement"(id) ON DELETE SET NULL,
  "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
  "review" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."Review" ENABLE ROW LEVEL SECURITY;

-- Reviewers can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON public."Review" FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = "reviewerId");

-- Reviews are readable by anyone authenticated
CREATE POLICY "Reviews are readable"
  ON public."Review" FOR SELECT TO authenticated
  USING (true);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_review_reviewee ON public."Review"("revieweeId");
CREATE INDEX IF NOT EXISTS idx_review_reviewer ON public."Review"("reviewerId");
CREATE INDEX IF NOT EXISTS idx_review_requirement ON public."Review"("requirementId");
