-- Fix admin_get_requirement_matches GROUP BY error
-- PostgreSQL requires all non-aggregated SELECT columns to appear in GROUP BY

CREATE OR REPLACE FUNCTION public.admin_get_requirement_matches(
  p_requirement_id TEXT
)
RETURNS TABLE(
  "matchId" UUID,
  "tutorId" TEXT,
  "tutorName" TEXT,
  "tutorEmail" TEXT,
  "tutorPhone" TEXT,
  "subjects" TEXT[],
  "areas" TEXT[],
  "matchScore" INTEGER,
  "status" TEXT,
  "tutorNotes" TEXT,
  "parentNotes" TEXT,
  "sessionCount" BIGINT,
  "lastSessionDate" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ
)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    rm.id,
    rm."tutorId",
    u."fullName" AS "tutorName",
    u.email AS "tutorEmail",
    u.phone AS "tutorPhone",
    tp.subjects,
    tp.areas,
    rm."matchScore",
    rm."status",
    rm."tutorNotes",
    rm."parentNotes",
    COUNT(ms.id) AS "sessionCount",
    MAX(ms."createdAt") AS "lastSessionDate",
    rm."createdAt"
  FROM public."RequirementMatch" rm
  JOIN public."User" u ON u.id = rm."tutorId"
  LEFT JOIN public."TutorProfile" tp ON tp."userId" = rm."tutorId"
  LEFT JOIN public."MatchSession" ms ON ms."matchId" = rm.id
  WHERE rm."requirementId" = p_requirement_id
  GROUP BY rm.id, u.id, tp."userId", tp.subjects, tp.areas
  ORDER BY rm."createdAt" DESC;
END;
$$;
