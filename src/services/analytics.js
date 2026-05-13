import { getSupabase } from "@/libs/supabase";

const supabase = getSupabase();

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  REQUIREMENT_VIEW: "requirement_view",
  TUTOR_PROFILE_VIEW: "tutor_profile_view",
  UNLOCK_CONTACT_CLICK: "unlock_contact_click",
  UNLOCK_CONTACT_SUCCESS: "unlock_contact_success",
  UNLOCK_CONTACT_FAILED: "unlock_contact_failed",
  APPLY_TUTOR_CLICK: "apply_tutor_click",
  APPLY_REQUIREMENT: "apply_requirement",
  SCHEDULE_DEMO: "schedule_demo",
  DEMO_COMPLETED: "demo_completed",
  TUTOR_HIRED: "tutor_hired",
  TUTOR_REJECTED: "tutor_rejected",
  SAVE_REQUIREMENT_CLICK: "save_requirement_click",
  USER_SIGNUP: "user_signup",
  USER_LOGIN: "user_login",
  SEARCH_QUERY: "search_query",
  SUBSCRIBE_NEWSLETTER: "subscribe_newsletter",
};

function getSessionId() {
  if (typeof window === "undefined") return null;
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

function sendToGA(eventName, params = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

async function sendToSupabase(eventName, data = {}) {
  if (!supabase) return;
  try {
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      user_id: data.userId || null,
      entity_id: data.entityId || null,
      entity_type: data.entityType || null,
      metadata: data.metadata || {},
      source: "web",
      session_id: getSessionId(),
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Analytics] Supabase insert failed:", err);
  }
}

export function trackEvent(eventName, options = {}) {
  const { userId, entityId, entityType, metadata, gaParams, skipGA, skipSupabase } = options;

  if (!skipGA) {
    sendToGA(eventName, gaParams || metadata || {});
  }
  if (!skipSupabase) {
    sendToSupabase(eventName, { userId, entityId, entityType, metadata });
  }
}

export function trackPageView(path, title, userId = null) {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    entityType: "page",
    entityId: path,
    metadata: { path, title },
    gaParams: { page_path: path, page_title: title },
  });
}

export function trackRequirementView(requirement, userId = null) {
  trackEvent(ANALYTICS_EVENTS.REQUIREMENT_VIEW, {
    userId,
    entityId: requirement.id,
    entityType: "requirement",
    metadata: {
      subject: requirement.subject,
      title: requirement.title,
      area: requirement.area,
      curriculum: requirement.curriculum,
      grade: requirement.grade,
      mode: requirement.modeOfTeaching,
      fee: requirement.expectedFeePerHour,
      status: requirement.status,
    },
    gaParams: {
      currency: "AED",
      value: requirement.expectedFeePerHour || 0,
    },
  });
}

export function trackTutorProfileView(tutor, userId = null) {
  trackEvent(ANALYTICS_EVENTS.TUTOR_PROFILE_VIEW, {
    userId,
    entityId: tutor.id,
    entityType: "tutor",
    metadata: {
      name: tutor.firstName,
      subjects: tutor.subjects,
      curriculum: tutor.curriculum,
      location: tutor.location,
      rating: tutor.rating,
      hourlyRate: tutor.hourlyRate,
    },
  });
}

export function trackUnlockContact(entityId, entityType, userId = null) {
  trackEvent(ANALYTICS_EVENTS.UNLOCK_CONTACT_CLICK, {
    userId,
    entityId,
    entityType,
    metadata: {},
  });
}

export function trackUnlockSuccess(entityId, entityType, userId = null) {
  trackEvent(ANALYTICS_EVENTS.UNLOCK_CONTACT_SUCCESS, {
    userId,
    entityId,
    entityType,
    metadata: { result: "success" },
  });
}

export function trackUnlockFailed(entityId, entityType, error, userId = null) {
  trackEvent(ANALYTICS_EVENTS.UNLOCK_CONTACT_FAILED, {
    userId,
    entityId,
    entityType,
    metadata: { error: error?.message || String(error) },
  });
}

export function trackApplyTutor(entityId, entityType, userId = null) {
  trackEvent(ANALYTICS_EVENTS.APPLY_TUTOR_CLICK, {
    userId,
    entityId,
    entityType,
    metadata: {},
  });
}

export function trackApplyRequirement(requirementId, userId = null) {
  trackEvent(ANALYTICS_EVENTS.APPLY_REQUIREMENT, {
    userId,
    entityId: requirementId,
    entityType: "requirement",
    metadata: {},
  });
}

export function trackScheduleDemo(matchId, requirementId, userId = null) {
  trackEvent(ANALYTICS_EVENTS.SCHEDULE_DEMO, {
    userId,
    entityId: matchId,
    entityType: "match",
    metadata: { requirementId },
  });
}

export function trackDemoCompleted(matchId, sessionId, rating, userId = null) {
  trackEvent(ANALYTICS_EVENTS.DEMO_COMPLETED, {
    userId,
    entityId: sessionId,
    entityType: "session",
    metadata: { matchId, rating },
  });
}

export function trackTutorHired(matchId, tutorName, userId = null) {
  trackEvent(ANALYTICS_EVENTS.TUTOR_HIRED, {
    userId,
    entityId: matchId,
    entityType: "match",
    metadata: { tutorName },
  });
}

export function trackTutorRejected(matchId, tutorName, userId = null) {
  trackEvent(ANALYTICS_EVENTS.TUTOR_REJECTED, {
    userId,
    entityId: matchId,
    entityType: "match",
    metadata: { tutorName },
  });
}

export function trackSaveRequirement(entityId, saved, userId = null) {
  trackEvent(ANALYTICS_EVENTS.SAVE_REQUIREMENT_CLICK, {
    userId,
    entityId,
    entityType: "requirement",
    metadata: { action: saved ? "saved" : "unsaved" },
  });
}

export function trackUserSignup(method, userId = null) {
  trackEvent(ANALYTICS_EVENTS.USER_SIGNUP, {
    userId,
    metadata: { method },
    gaParams: { method },
  });
}

export function trackUserLogin(method, userId = null) {
  trackEvent(ANALYTICS_EVENTS.USER_LOGIN, {
    userId,
    metadata: { method },
    gaParams: { method },
  });
}

export function trackSearch(query, filters = {}, userId = null) {
  trackEvent(ANALYTICS_EVENTS.SEARCH_QUERY, {
    userId,
    metadata: { query, filters },
    gaParams: { search_term: query },
  });
}

export function trackNewsletterSubscribe(email, userId = null) {
  trackEvent(ANALYTICS_EVENTS.SUBSCRIBE_NEWSLETTER, {
    userId,
    entityType: "subscriber",
    metadata: { email },
    gaParams: { email },
  });
}

export async function syncToServer(eventName, options = {}) {
  const { userId, entityId, entityType, metadata } = options;
  if (typeof window === "undefined") return;

  try {
    const { supabase: sb } = await import("@/libs/supabase");
    const supabase = sb();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.functions.invoke("analytics-sync", {
      body: {
        events: [
          {
            event_name: eventName,
            user_id: userId || user?.id || null,
            entity_id: entityId,
            entity_type: entityType,
            metadata,
            source: "web",
            session_id: getSessionId(),
            timestamp: new Date().toISOString(),
          },
        ],
      },
    });
  } catch (err) {
    console.error("[Analytics] Server sync failed:", err);
  }
}