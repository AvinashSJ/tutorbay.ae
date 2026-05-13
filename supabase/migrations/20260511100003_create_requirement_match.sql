-- Create RequirementMatch table — tracks tutor-requirement pipeline status
CREATE TABLE IF NOT EXISTS public."RequirementMatch" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "requirementId" TEXT NOT NULL REFERENCES public."Requirement"(id) ON DELETE CASCADE,
  "tutorId" TEXT NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE,
  "matchScore" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'MATCHED',
  "tutorNotes" TEXT,
  "parentNotes" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_tutor_requirement UNIQUE ("requirementId", "tutorId")
);

ALTER TABLE public."RequirementMatch" ENABLE ROW LEVEL SECURITY;

-- Create MatchSession table — individual demo/visit events per match
CREATE TABLE IF NOT EXISTS public."MatchSession" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "matchId" UUID NOT NULL REFERENCES public."RequirementMatch"(id) ON DELETE CASCADE,
  "sessionType" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
  "feedback" TEXT,
  "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
  "outcome" TEXT,
  "locationUrl" TEXT,
  "meetingLink" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "updatedAt" TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public."MatchSession" ENABLE ROW LEVEL SECURITY;

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_match_requirement ON public."RequirementMatch"("requirementId");
CREATE INDEX IF NOT EXISTS idx_match_tutor ON public."RequirementMatch"("tutorId");
CREATE INDEX IF NOT EXISTS idx_match_status ON public."RequirementMatch"("status");
CREATE INDEX IF NOT EXISTS idx_session_match ON public."MatchSession"("matchId");
CREATE INDEX IF NOT EXISTS idx_session_status ON public."MatchSession"("status");

-- RLS: Service role full access; authenticated users can read/insert their own
CREATE POLICY "RequirementMatch service role full access"
  ON public."RequirementMatch" TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "MatchSession service role full access"
  ON public."MatchSession" TO service_role USING (true) WITH CHECK (true);

-- Tutors can see their own matches
CREATE POLICY "Tutors read own matches"
  ON public."RequirementMatch" FOR SELECT TO authenticated
  USING (auth.uid()::text = "tutorId");

-- Tutors can insert their own applications
CREATE POLICY "Tutors insert own matches"
  ON public."RequirementMatch" FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = "tutorId");

-- Parents can see matches on their own requirements
CREATE POLICY "Parents read own requirement matches"
  ON public."RequirementMatch" FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Requirement" r
      WHERE r.id = "requirementId" AND r."ownerId" = auth.uid()::text
    )
  );

-- Parents can update matches on their own requirements (e.g., change status, add notes)
CREATE POLICY "Parents update own requirement matches"
  ON public."RequirementMatch" FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."Requirement" r
      WHERE r.id = "requirementId" AND r."ownerId" = auth.uid()::text
    )
  );

-- Both sides can read sessions for their own matches
CREATE POLICY "Sessions readable by related users"
  ON public."MatchSession" FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."RequirementMatch" rm
      WHERE rm.id = "matchId"
        AND (rm."tutorId" = auth.uid()::text
          OR EXISTS (
            SELECT 1 FROM public."Requirement" r
            WHERE r.id = rm."requirementId" AND r."ownerId" = auth.uid()::text
          ))
    )
  );

-- Parents can insert sessions (schedule demo/visit)
CREATE POLICY "Parents insert sessions"
  ON public."MatchSession" FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public."RequirementMatch" rm
      JOIN public."Requirement" r ON r.id = rm."requirementId"
      WHERE rm.id = "matchId" AND r."ownerId" = auth.uid()::text
    )
  );

-- Both sides can update sessions (mark completed, add feedback)
CREATE POLICY "Users update own sessions"
  ON public."MatchSession" FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public."RequirementMatch" rm
      WHERE rm.id = "matchId"
        AND (rm."tutorId" = auth.uid()::text
          OR EXISTS (
            SELECT 1 FROM public."Requirement" r
            WHERE r.id = rm."requirementId" AND r."ownerId" = auth.uid()::text
          ))
    )
  );
