-- ============================================================
-- Fix RPC security for public-read endpoints
-- Adds SECURITY DEFINER so anon/unauthenticated users can read
-- public data (tutors, published requirements).
-- ============================================================

-- ============================================================
-- 1. get_all_tutors — used by home page "Our Tutors" section
-- ============================================================
DROP FUNCTION IF EXISTS public.get_all_tutors();
CREATE FUNCTION public.get_all_tutors()
RETURNS TABLE(
  "id" TEXT,
  "fullName" TEXT,
  "profileImage" TEXT,
  "tutorProfile" JSONB
)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u."fullName",
    u."profileImage",
    jsonb_build_object(
      'subjects', tp.subjects,
      'areas', tp.areas,
      'modeOfTeaching', tp."modeOfTeaching",
      'expectedFeePerHour', tp."expectedFeePerHour",
      'bio', tp.bio,
      'location', tp.location,
      'availability', tp.availability
    ) AS "tutorProfile"
  FROM "User" u
  JOIN "TutorProfile" tp ON tp."userId" = u.id::TEXT
  WHERE u.role = 'TUTOR'
    AND tp."applicationStatus" = 'APPROVED'
  ORDER BY u."fullName" ASC;
END;
$$;

-- ============================================================
-- 2. find_matching_tutors — used by home page subject filter
-- ============================================================
DROP FUNCTION IF EXISTS public.find_matching_tutors(text,text,text,integer,text);
CREATE FUNCTION public.find_matching_tutors(
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
  "profileImage" TEXT,
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
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u."fullName",
    u.phone,
    u.email,
    u."profileImage",
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
  GROUP BY u.id, tp."userId", tp.subjects, tp.areas, tp."modeOfTeaching", tp."expectedFeePerHour", tp.bio, tp.location, tp.availability, tp."emirateId", u."fullName", u.phone, u.email, u."profileImage"
  ORDER BY "matchScore" DESC, "avgRating" DESC NULLS LAST;
END;
$$;

-- ============================================================
-- 3. RPC: get_published_requirements — public read for home page
-- SECURITY DEFINER so anon users can browse published requirements
-- ============================================================
DROP FUNCTION IF EXISTS public.get_published_requirements();
CREATE FUNCTION public.get_published_requirements()
RETURNS TABLE(
  "id" TEXT,
  "ownerId" TEXT,
  "ownerRole" TEXT,
  "title" TEXT,
  "subject" TEXT,
  "area" TEXT,
  "tuitionType" TEXT,
  "notes" TEXT,
  "status" TEXT,
  "publishedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ
)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id::TEXT,
    r."ownerId"::TEXT,
    r."ownerRole"::TEXT,
    r.title::TEXT,
    r.subject::TEXT,
    r.area::TEXT,
    r."tuitionType"::TEXT,
    r.notes::TEXT,
    r.status::TEXT,
    r."publishedAt"::TIMESTAMPTZ,
    r."createdAt"::TIMESTAMPTZ
  FROM "Requirement" r
  WHERE r.status = 'PUBLISHED'
  ORDER BY r."publishedAt" DESC;
END;
$$;
