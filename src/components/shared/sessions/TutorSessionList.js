"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/libs/supabase";
import { useUser } from "@/hooks/useUser";
import ReviewForm from "@/components/shared/matching/ReviewForm";

const STATUS_BADGE = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-yellow-100 text-yellow-700",
};

const TutorSessionList = () => {
  const { userId } = useUser();
  const [sessions, setSessions] = useState([]);
  const [myReviews, setMyReviews] = useState(new Map());
  const [reviewedKeys, setReviewedKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const supabase = getSupabase();
        const [sessionRes, reviewRes] = await Promise.all([
          supabase.rpc("get_tutor_sessions", { p_tutor_id: userId }),
          supabase.from("Review").select("id, revieweeId, requirementId, rating, review, createdAt").eq("reviewerId", userId),
        ]);
        if (sessionRes.error) throw sessionRes.error;
        setSessions(sessionRes.data || []);
        const map = new Map();
        (reviewRes.data || []).forEach((r) => {
          map.set(`${r.revieweeId}:${r.requirementId}`, r);
        });
        setMyReviews(map);
      } catch (err) {
        setError(err.message || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [userId]);

  const upcoming = sessions.filter((s) => s.status === "SCHEDULED");
  const past = sessions.filter((s) => s.status !== "SCHEDULED");

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        No sessions found. Apply to requirements and schedule demos to get started.
      </div>
    );
  }

  const renderSession = (session) => {
    const reviewKey = `${session.ownerId}:${session.requirementId}`;
    const existingReview = myReviews.get(reviewKey);
    const justReviewed = reviewedKeys.has(reviewKey);

    return (
    <div key={session.sessionId} className="bg-whiteColor dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-blackColor dark:text-blackColor-dark text-sm">
            {session.requirementTitle || session.requirementSubject}
          </h4>
          <p className="text-xs text-contentColor dark:text-contentColor-dark mt-0.5">
            {session.sessionType?.replace(/_/g, " ")}
          </p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[session.status] || "bg-gray-100 text-gray-700"}`}>
          {session.status}
        </span>
      </div>
      <p className="text-xs text-contentColor dark:text-contentColor-dark flex items-center gap-1 mb-2">
        <i className="icofont-clock-time" /> {formatDate(session.scheduledAt)}
      </p>
      {session.ownerName && (
        <p className="text-xs text-contentColor dark:text-contentColor-dark flex items-center gap-1 mb-2">
          <i className="icofont-user" /> {session.ownerName}
        </p>
      )}
      {session.locationUrl && (
        <a href={session.locationUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primaryColor hover:underline flex items-center gap-1">
          <i className="icofont-location-pin" /> View Location
        </a>
      )}
      {session.meetingLink && (
        <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primaryColor hover:underline flex items-center gap-1 mt-1">
          <i className="icofont-video-alt" /> Join Meeting
        </a>
      )}
      {session.feedback && (
        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-contentColor dark:text-contentColor-dark">
          <p><span className="font-semibold">Parent Feedback:</span> {session.feedback}</p>
          {session.rating && <p><span className="font-semibold">Parent Rating:</span> {session.rating}/5</p>}
          {session.outcome && <p><span className="font-semibold">Outcome:</span> {session.outcome}</p>}
        </div>
      )}
      {(existingReview || justReviewed) ? (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-contentColor dark:text-contentColor-dark">
          {justReviewed ? (
            <p className="font-semibold text-green-600">Review submitted. Thank you!</p>
          ) : (
            <>
              <p><span className="font-semibold">Your Rating:</span> {existingReview.rating}/5</p>
              {existingReview.review && <p className="mt-1"><span className="font-semibold">Your Feedback:</span> {existingReview.review}</p>}
            </>
          )}
        </div>
      ) : session.status === "COMPLETED" && (
        <div className="mt-3 pt-3 border-t border-borderColor dark:border-borderColor-dark">
          <p className="text-xs font-semibold text-blackColor dark:text-blackColor-dark mb-2">Rate {session.ownerName || "Parent/Student"}</p>
          <ReviewForm
            reviewerId={userId}
            revieweeId={session.ownerId}
            requirementId={session.requirementId}
            onSuccess={() => {
              setReviewedKeys((prev) => new Set(prev).add(reviewKey));
            }}
          />
        </div>
      )}
    </div>
  );};

  return (
    <div className="space-y-6">
      {/* Upcoming Sessions */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-3 flex items-center gap-2">
            <i className="icofont-calendar text-primaryColor" /> Upcoming Sessions
            <span className="text-sm font-normal text-contentColor">({upcoming.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcoming.map(renderSession)}
          </div>
        </div>
      )}

      {/* Past Sessions */}
      {past.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-3 flex items-center gap-2">
            <i className="icofont-history text-primaryColor" /> Past Sessions
            <span className="text-sm font-normal text-contentColor">({past.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {past.map(renderSession)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorSessionList;
