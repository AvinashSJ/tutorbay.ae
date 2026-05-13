-- RPC: admin_get_all_matches
-- Returns ALL RequirementMatch records with tutor and requirement details
-- Used by the superadmin /matches page for the pipeline overview + list.
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
    rm."matchScore",
    rm."status",
    rm."tutorNotes",
    rm."parentNotes",
    COUNT(ms.id) AS "sessionCount",
    MAX(ms."createdAt") AS "lastSessionDate",
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
