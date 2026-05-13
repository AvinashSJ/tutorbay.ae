-- RPC: find_matching_tutors
-- Given a requirement's key fields, returns approved tutors ranked by match score.
-- Scoring: subject +40, area +25, mode +15, fee budget +10, same emirate +10
CREATE OR REPLACE FUNCTION public.find_matching_tutors(
  p_subject TEXT,
  p_area TEXT DEFAULT NULL,
  p_mode TEXT DEFAULT NULL,
  p_maxFee INTEGER DEFAULT NULL,
  p_emirateId TEXT DEFAULT NULL
)
RETURNS TABLE(
  "userId" UUID,
  "fullName" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "subjects" TEXT[],
  "areas" TEXT[],
  "modeOfTeaching" TEXT,
  "expectedFeePerHour" INTEGER,
  "bio" TEXT,
  "location" JSONB,
  "availability" JSONB,
  "matchScore" INTEGER,
  "avgRating" NUMERIC,
  "reviewCount" BIGINT
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u."fullName",
    u.phone,
    u.email,
    tp.subjects,
    tp.areas,
    tp."modeOfTeaching",
    tp."expectedFeePerHour",
    tp.bio,
    tp.location,
    tp.availability,
    (CASE WHEN p_subject = ANY(tp.subjects) THEN 40 ELSE 0 END) +
    (CASE WHEN p_area IS NOT NULL AND p_area = ANY(tp.areas) THEN 25 ELSE 0 END) +
    (CASE WHEN p_mode IS NOT NULL AND LOWER(tp."modeOfTeaching") IN (LOWER(p_mode), 'both') THEN 15 ELSE 0 END) +
    (CASE WHEN p_maxFee IS NOT NULL AND (tp."expectedFeePerHour" IS NULL OR tp."expectedFeePerHour" <= p_maxFee) THEN 10 ELSE 0 END) +
    (CASE WHEN p_emirateId IS NOT NULL AND tp."emirateId" = p_emirateId THEN 10 ELSE 0 END)
    AS "matchScore",
    ROUND(AVG(r.rating), 1) AS "avgRating",
    COUNT(r.id) AS "reviewCount"
  FROM "User" u
  JOIN "TutorProfile" tp ON tp."userId" = u.id::TEXT
  LEFT JOIN "Review" r ON r."revieweeId" = u.id::TEXT
  WHERE u.role = 'TUTOR'
    AND tp."applicationStatus" = 'APPROVED'
    AND p_subject = ANY(tp.subjects)
  GROUP BY u.id, tp."userId", tp.subjects, tp.areas, tp."modeOfTeaching", tp."expectedFeePerHour", tp.bio, tp.location, tp.availability, tp."emirateId"
  ORDER BY "matchScore" DESC, "avgRating" DESC NULLS LAST;
END;
$$;
