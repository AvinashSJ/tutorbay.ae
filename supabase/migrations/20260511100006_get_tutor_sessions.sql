-- RPC: get_tutor_sessions
-- Returns all MatchSessions for a given tutor, with requirement details.
-- Used on the tutor's "My Sessions" page in tutorbay.ae.
CREATE OR REPLACE FUNCTION public.get_tutor_sessions(
  p_tutor_id TEXT
)
RETURNS TABLE(
  "sessionId" UUID,
  "matchId" UUID,
  "requirementId" TEXT,
  "requirementTitle" TEXT,
  "requirementSubject" TEXT,
  "sessionType" TEXT,
  "scheduledAt" TIMESTAMP,
  "status" TEXT,
  "feedback" TEXT,
  "rating" INTEGER,
  "outcome" TEXT,
  "locationUrl" TEXT,
  "meetingLink" TEXT,
  "createdAt" TIMESTAMPTZ
)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    ms.id AS "sessionId",
    ms."matchId",
    rm."requirementId",
    r.title AS "requirementTitle",
    r.subject AS "requirementSubject",
    ms."sessionType",
    ms."scheduledAt",
    ms."status",
    ms."feedback",
    ms."rating",
    ms."outcome",
    ms."locationUrl",
    ms."meetingLink",
    ms."createdAt"
  FROM public."MatchSession" ms
  JOIN public."RequirementMatch" rm ON rm.id = ms."matchId"
  JOIN public."Requirement" r ON r.id = rm."requirementId"
  WHERE rm."tutorId" = p_tutor_id
  ORDER BY ms."scheduledAt" DESC;
END;
$$;
