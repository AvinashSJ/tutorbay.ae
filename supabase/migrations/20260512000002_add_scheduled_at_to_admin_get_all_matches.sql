-- Add scheduledAt column + inline matchScore calculation to admin_get_all_matches
-- Returns the scheduled session date for SCHEDULED sessions
-- Calculates matchScore on-the-fly when not stored

DROP FUNCTION IF EXISTS public.admin_get_all_matches();

CREATE OR REPLACE FUNCTION public.admin_get_all_matches()
RETURNS TABLE(
  "matchId" UUID,
  "requirementId" TEXT,
  "requirementTitle" TEXT,
  "requirementSubject" TEXT,
  "requirementArea" TEXT,
  "requirementStatus" TEXT,
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
  "scheduledAt" TIMESTAMP,
  "createdAt" TIMESTAMPTZ
)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    rm.id AS "matchId",
    rm."requirementId",
    r.title AS "requirementTitle",
    r.subject AS "requirementSubject",
    r.area AS "requirementArea",
    r.status::TEXT AS "requirementStatus",
    rm."tutorId",
    u."fullName" AS "tutorName",
    u.email AS "tutorEmail",
    u.phone AS "tutorPhone",
    tp.subjects,
    tp.areas,
    COALESCE(
      rm."matchScore",
      (CASE WHEN r.subject = ANY(tp.subjects) THEN 50 ELSE 0 END) +
      (CASE WHEN tp.areas IS NOT NULL AND r.area = ANY(tp.areas) THEN 30 ELSE 0 END)
    )::INTEGER AS "matchScore",
    rm."status",
    rm."tutorNotes",
    rm."parentNotes",
    COUNT(ms.id) AS "sessionCount",
    MAX(ms."createdAt") AS "lastSessionDate",
    MIN(ms."scheduledAt") FILTER (WHERE ms."status" = 'SCHEDULED') AS "scheduledAt",
    rm."createdAt"
  FROM public."RequirementMatch" rm
  JOIN public."Requirement" r ON r.id = rm."requirementId"
  JOIN public."User" u ON u.id = rm."tutorId"
  LEFT JOIN public."TutorProfile" tp ON tp."userId" = rm."tutorId"
  LEFT JOIN public."MatchSession" ms ON ms."matchId" = rm.id
  GROUP BY rm.id, r.id, r.title, r.subject, r.area, r.status, u.id, u."fullName", u.email, u.phone, tp."userId", tp.subjects, tp.areas
  ORDER BY rm."createdAt" DESC;
END;
$$;
