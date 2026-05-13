-- RPC: find_matching_requirements
-- Given a tutor userId, returns PUBLISHED requirements ranked by match score.
-- Scoring: subject +50, area +30, mode +20
CREATE OR REPLACE FUNCTION public.find_matching_requirements(
  p_tutorId TEXT
)
RETURNS TABLE(
  "id" UUID,
  "ownerId" TEXT,
  "title" TEXT,
  "subject" TEXT,
  "area" TEXT,
  "tuitionType" TEXT,
  "notes" TEXT,
  "matchScore" INTEGER,
  "publishedAt" TIMESTAMP,
  "createdAt" TIMESTAMP
)
LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_tutorSubjects TEXT[];
  v_tutorAreas TEXT[];
  v_tutorMode TEXT;
BEGIN
  SELECT tp.subjects, tp.areas, tp."modeOfTeaching"
  INTO v_tutorSubjects, v_tutorAreas, v_tutorMode
  FROM "TutorProfile" tp
  WHERE tp."userId" = p_tutorId;

  IF v_tutorSubjects IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    r.id::UUID,
    r."ownerId",
    r.title,
    r.subject,
    r.area,
    r."tuitionType"::TEXT,
    r.notes,
    (
      (CASE WHEN r.subject = ANY(v_tutorSubjects) THEN 50 ELSE 0 END) +
      (CASE WHEN v_tutorAreas IS NOT NULL AND r.area = ANY(v_tutorAreas) THEN 30 ELSE 0 END) +
      (CASE WHEN v_tutorMode IS NOT NULL AND (
          LOWER(v_tutorMode) = 'both' OR
          (LOWER(v_tutorMode) = 'online' AND r."tuitionType"::TEXT = 'ONLINE') OR
          (LOWER(v_tutorMode) = 'offline' AND r."tuitionType"::TEXT IN ('HOME', 'INSTITUTE'))
        ) THEN 20 ELSE 0 END)
    )::INTEGER AS "matchScore",
    r."publishedAt",
    r."createdAt"
  FROM "Requirement" r
  WHERE r.status = 'PUBLISHED'
    AND r.subject = ANY(v_tutorSubjects)
  ORDER BY "matchScore" DESC, r."publishedAt" DESC NULLS LAST;
END;
$$;
