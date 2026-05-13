-- ============================================================
-- RPC: tutor_apply_to_requirement
-- Creates a RequirementMatch record when a tutor applies.
-- ============================================================
CREATE OR REPLACE FUNCTION public.tutor_apply_to_requirement(
  p_requirement_id TEXT,
  p_tutor_id TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match_id UUID;
  v_existing RECORD;
BEGIN
  -- Check if tutor already applied
  SELECT id, status INTO v_existing
  FROM public."RequirementMatch"
  WHERE "requirementId" = p_requirement_id AND "tutorId" = p_tutor_id;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'You have already applied to this requirement.',
      'matchId', v_existing.id,
      'status', v_existing.status
    );
  END IF;

  INSERT INTO public."RequirementMatch" ("requirementId", "tutorId", "tutorNotes", "status")
  VALUES (p_requirement_id, p_tutor_id, p_notes, 'MATCHED')
  RETURNING id INTO v_match_id;

  RETURN jsonb_build_object(
    'success', true,
    'matchId', v_match_id,
    'status', 'MATCHED'
  );
END;
$$;

-- ============================================================
-- RPC: schedule_match_session
-- Creates a MatchSession record (demo/visit).
-- ============================================================
CREATE OR REPLACE FUNCTION public.schedule_match_session(
  p_match_id UUID,
  p_scheduled_at TIMESTAMP,
  p_session_type TEXT,
  p_location_url TEXT DEFAULT NULL,
  p_meeting_link TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_session_id UUID;
BEGIN
  INSERT INTO public."MatchSession" ("matchId", "scheduledAt", "sessionType", "locationUrl", "meetingLink", "status")
  VALUES (p_match_id, p_scheduled_at, p_session_type, p_location_url, p_meeting_link, 'SCHEDULED')
  RETURNING id INTO v_session_id;

  -- Update RequirementMatch status to SCHEDULED
  UPDATE public."RequirementMatch"
  SET "status" = 'SCHEDULED', "updatedAt" = now()
  WHERE id = p_match_id AND "status" = 'MATCHED';

  RETURN jsonb_build_object(
    'success', true,
    'sessionId', v_session_id,
    'status', 'SCHEDULED'
  );
END;
$$;

-- ============================================================
-- RPC: update_session_status
-- Marks a session as COMPLETED, CANCELLED, or NO_SHOW.
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_session_status(
  p_session_id UUID,
  p_status TEXT
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match_id UUID;
BEGIN
  IF p_status NOT IN ('COMPLETED', 'CANCELLED', 'NO_SHOW') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid status. Use COMPLETED, CANCELLED, or NO_SHOW.');
  END IF;

  UPDATE public."MatchSession"
  SET "status" = p_status, "updatedAt" = now()
  WHERE id = p_session_id
  RETURNING "matchId" INTO v_match_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Session not found.');
  END IF;

  RETURN jsonb_build_object('success', true, 'matchId', v_match_id, 'sessionStatus', p_status);
END;
$$;

-- ============================================================
-- RPC: submit_session_feedback
-- Adds feedback + rating + outcome after a completed session.
-- Also updates the parent RequirementMatch status based on outcome.
-- ============================================================
CREATE OR REPLACE FUNCTION public.submit_session_feedback(
  p_session_id UUID,
  p_feedback TEXT,
  p_rating INTEGER,
  p_outcome TEXT
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_match_id UUID;
  v_requirement_id TEXT;
BEGIN
  IF p_rating < 1 OR p_rating > 5 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Rating must be between 1 and 5.');
  END IF;

  IF p_outcome NOT IN ('HIRED', 'REJECTED', 'PENDING') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Outcome must be HIRED, REJECTED, or PENDING.');
  END IF;

  UPDATE public."MatchSession"
  SET
    "feedback" = p_feedback,
    "rating" = p_rating,
    "outcome" = p_outcome,
    "status" = 'COMPLETED',
    "updatedAt" = now()
  WHERE id = p_session_id AND "status" = 'SCHEDULED'
  RETURNING "matchId" INTO v_match_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Session not found or already completed.');
  END IF;

  -- Update the match status based on outcome
  IF p_outcome = 'HIRED' THEN
    UPDATE public."RequirementMatch"
    SET "status" = 'HIRED', "updatedAt" = now()
    WHERE id = v_match_id;

    -- Close the requirement if hired
    SELECT "requirementId" INTO v_requirement_id
    FROM public."RequirementMatch" WHERE id = v_match_id;

    UPDATE public."Requirement"
    SET "status" = 'CLOSED', "updatedAt" = now()
    WHERE id = v_requirement_id;
  ELSIF p_outcome = 'REJECTED' THEN
    UPDATE public."RequirementMatch"
    SET "status" = 'REJECTED', "updatedAt" = now()
    WHERE id = v_match_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'matchId', v_match_id,
    'outcome', p_outcome
  );
END;
$$;

-- ============================================================
-- RPC: admin_get_pipeline_stats
-- Returns counts at each pipeline stage for the superadmin dashboard.
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_get_pipeline_stats()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'totalRequirements', (SELECT COUNT(*) FROM public."Requirement"),
    'publishedRequirements', (SELECT COUNT(*) FROM public."Requirement" WHERE "status" = 'PUBLISHED'),
    'closedRequirements', (SELECT COUNT(*) FROM public."Requirement" WHERE "status" = 'CLOSED'),
    'totalMatches', (SELECT COUNT(*) FROM public."RequirementMatch"),
    'matched', (SELECT COUNT(*) FROM public."RequirementMatch" WHERE "status" = 'MATCHED'),
    'scheduled', (SELECT COUNT(*) FROM public."RequirementMatch" WHERE "status" = 'SCHEDULED'),
    'hired', (SELECT COUNT(*) FROM public."RequirementMatch" WHERE "status" = 'HIRED'),
    'rejected', (SELECT COUNT(*) FROM public."RequirementMatch" WHERE "status" = 'REJECTED'),
    'totalSessions', (SELECT COUNT(*) FROM public."MatchSession"),
    'completedSessions', (SELECT COUNT(*) FROM public."MatchSession" WHERE "status" = 'COMPLETED'),
    'pendingSessions', (SELECT COUNT(*) FROM public."MatchSession" WHERE "status" = 'SCHEDULED'),
    'averageRating', (SELECT ROUND(AVG(rating), 2) FROM public."MatchSession" WHERE rating IS NOT NULL)
  ) INTO v_stats;

  RETURN v_stats;
END;
$$;

-- ============================================================
-- RPC: admin_get_requirement_matches
-- Returns all matches for a given requirement with tutor details.
-- ============================================================
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
  GROUP BY rm.id, u.id, tp."userId"
  ORDER BY rm."createdAt" DESC;
END;
$$;

-- ============================================================
-- RPC: admin_get_match_timeline
-- Returns chronological session events for a given match.
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_get_match_timeline(
  p_match_id UUID
)
RETURNS TABLE(
  "sessionId" UUID,
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
    ms.id,
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
  WHERE ms."matchId" = p_match_id
  ORDER BY ms."scheduledAt" DESC;
END;
$$;
