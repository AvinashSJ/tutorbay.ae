-- ============================================================
-- RPC: get_tutor_sessions (updated with owner info)
-- Returns all MatchSessions for a given tutor, with requirement
-- and parent/student owner details for tutor feedback.
-- ============================================================
DROP FUNCTION IF EXISTS public.get_tutor_sessions(text);
CREATE FUNCTION public.get_tutor_sessions(
  p_tutor_id TEXT
)
RETURNS TABLE(
  "sessionId" UUID,
  "matchId" UUID,
  "requirementId" TEXT,
  "requirementTitle" TEXT,
  "requirementSubject" TEXT,
  "ownerId" TEXT,
  "ownerName" TEXT,
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
    r."ownerId",
    u."fullName" AS "ownerName",
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
  JOIN public."User" u ON u.id = r."ownerId"
  WHERE rm."tutorId" = p_tutor_id
  ORDER BY ms."scheduledAt" DESC;
END;
$$;
