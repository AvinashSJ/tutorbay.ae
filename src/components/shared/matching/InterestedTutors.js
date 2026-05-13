"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/libs/supabase";
import { FaCalendarAlt, FaStar, FaCheckCircle } from "react-icons/fa";
import { useSubmitSessionFeedbackMutation, useScheduleMatchSessionMutation } from "@/redux/services/userSlice";
import toast from "react-hot-toast";
import { trackScheduleDemo, trackDemoCompleted, trackTutorHired, trackTutorRejected } from "@/services/analytics";
import { useUser } from "@/hooks/useUser";
import ReviewForm from "./ReviewForm";

const STATUS_BADGE = {
  MATCHED: "bg-blue-100 text-blue-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-gray-100 text-gray-700",
};

const InterestedTutors = ({ requirementId, isOwner }) => {
  const { userId } = useUser();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleModal, setScheduleModal] = useState({ open: false, match: null });
  const [feedbackModal, setFeedbackModal] = useState({ open: false, sessionId: null, match: null });
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [reviewedMatches, setReviewedMatches] = useState(new Set());
  const [submitFeedback, { isLoading: isSubmitting }] = useSubmitSessionFeedbackMutation();
  const [scheduleSession, { isLoading: isScheduling }] = useScheduleMatchSessionMutation();

  const refresh = async () => {
    const supabase = getSupabase();
    const { data } = await supabase.rpc("admin_get_requirement_matches", { p_requirement_id: requirementId });
    if (data) setMatches(data);
  };

  useEffect(() => {
    if (!requirementId) return;
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [requirementId]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const result = await scheduleSession({
        matchId: fd.get("matchId"),
        scheduledAt: new Date(fd.get("scheduledAt")).toISOString(),
        sessionType: fd.get("sessionType"),
        locationUrl: fd.get("locationUrl") || undefined,
        meetingLink: fd.get("meetingLink") || undefined,
      }).unwrap();
      if (result?.success) {
        trackScheduleDemo(fd.get("matchId"), requirementId, userId);
        toast.success("Demo scheduled!");
        setScheduleModal({ open: false, match: null });
        refresh();
      }
    } catch (err) {
      toast.error(err?.data || "Failed to schedule");
    }
  };

  const openFeedback = async (match) => {
    const supabase = getSupabase();
    const { data: sessions } = await supabase.rpc("admin_get_match_timeline", { p_match_id: match.matchId });
    if (sessions && sessions.length > 0) {
      const scheduledSession = sessions.find((s) => s.status === "SCHEDULED");
      const sessionId = scheduledSession?.sessionId || sessions[0].sessionId;
      setFeedbackModal({ open: true, sessionId, match });
    } else {
      toast.error("No sessions found for this match.");
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const result = await submitFeedback({
        sessionId: fd.get("sessionId"),
        feedback: fd.get("feedback"),
        rating: parseInt(fd.get("rating")),
        outcome: fd.get("outcome"),
      }).unwrap();
      if (result?.success) {
        const outcome = fd.get("outcome");
        trackDemoCompleted(feedbackModal.match.matchId, fd.get("sessionId"), parseInt(fd.get("rating")), userId);
        if (outcome === "HIRED") {
          trackTutorHired(feedbackModal.match.matchId, feedbackModal.match.tutorName, userId);
        } else if (outcome === "REJECTED") {
          trackTutorRejected(feedbackModal.match.matchId, feedbackModal.match.tutorName, userId);
        }
        toast.success("Feedback submitted!");
        setFeedbackModal({ open: false, sessionId: null, match: null });
        refresh();
      }
    } catch (err) {
      toast.error(err?.data || "Failed to submit feedback");
    }
  };

  if (!isOwner) return null;

  return (
    <div className="mt-10" data-aos="fade-up">
      <h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
        Interested Tutors
      </h4>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primaryColor" />
        </div>
      ) : matches.length === 0 ? (
        <p className="text-sm text-contentColor dark:text-contentColor-dark bg-darkdeep3 dark:bg-darkdeep3-dark p-5 rounded">
          No tutors have applied yet.
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <div key={m.matchId} className="bg-darkdeep3 dark:bg-darkdeep3-dark rounded p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="font-semibold text-blackColor dark:text-blackColor-dark">
                    {m.tutorName}
                  </h5>
                  <p className="text-xs text-contentColor dark:text-contentColor-dark">
                    {m.subjects?.slice(0, 3).join(", ") || "—"}
                    {m.areas?.length ? ` • ${m.areas.slice(0, 2).join(", ")}` : ""}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[m.status] || "bg-gray-100 text-gray-700"}`}>
                  {m.status}
                </span>
              </div>

              {m.matchScore !== null && (
                <p className="text-xs text-contentColor dark:text-contentColor-dark mb-2">
                  Match Score: <span className={`font-semibold ${m.matchScore >= 80 ? "text-green-600" : m.matchScore >= 60 ? "text-yellow-600" : "text-red-600"}`}>{m.matchScore}%</span>
                </p>
              )}

              {m.tutorNotes && (
                <p className="text-xs text-contentColor dark:text-contentColor-dark italic mb-2">
                  &ldquo;{m.tutorNotes}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {m.status === "MATCHED" && (
                  <button
                    onClick={() => setScheduleModal({ open: true, match: m })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primaryColor text-white text-xs rounded hover:bg-opacity-90 transition"
                  >
                    <FaCalendarAlt /> Schedule Demo
                  </button>
                )}

                {m.status === "SCHEDULED" && (
                  <button
                    onClick={() => openFeedback(m)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-opacity-90 transition"
                  >
                    <FaStar /> Mark Complete &amp; Rate
                  </button>
                )}

                {m.status === "HIRED" && (
                  <>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded">
                      <FaCheckCircle /> Hired
                    </span>
                    {!reviewedMatches.has(m.matchId) && (
                      <div className="w-full mt-3">
                        <ReviewForm
                          reviewerId={userId}
                          revieweeId={m.tutorId}
                          requirementId={requirementId}
                          onSuccess={() => setReviewedMatches((prev) => new Set(prev).add(m.matchId))}
                        />
                      </div>
                    )}
                    {reviewedMatches.has(m.matchId) && (
                      <p className="w-full text-xs text-green-600 mt-2">Review submitted. Thank you!</p>
                    )}
                  </>
                )}
              </div>

              {m.sessionCount > 0 && (
                <p className="text-xs text-contentColor dark:text-contentColor-dark mt-2">
                  {m.sessionCount} session{m.sessionCount !== 1 ? "s" : ""}
                  {m.lastSessionDate ? ` (last: ${new Date(m.lastSessionDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })})` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {scheduleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setScheduleModal({ open: false, match: null })}>
          <div className="bg-white dark:bg-darkdeep3-dark rounded-lg p-8 max-w-md w-full shadow-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Schedule Demo — {scheduleModal.match.tutorName}</h3>
            <form onSubmit={handleScheduleSubmit}>
              <input type="hidden" name="matchId" value={scheduleModal.match.matchId} />
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Session Type</label>
                <select name="sessionType" className="w-full p-2 border border-gray-300 rounded text-sm" required>
                  <option value="DEMO_VISIT">Demo Visit (In-Person)</option>
                  <option value="DEMO_ONLINE">Demo Online</option>
                  <option value="ASSESSMENT">Assessment</option>
                  <option value="TRIAL">Trial Session</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Date & Time</label>
                <input type="datetime-local" name="scheduledAt" className="w-full p-2 border border-gray-300 rounded text-sm" required />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Location URL</label>
                <input type="url" name="locationUrl" className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="https://maps.google.com/..." />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Meeting Link</label>
                <input type="url" name="meetingLink" className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="https://zoom.us/..." />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" onClick={() => setScheduleModal({ open: false, match: null })}>Cancel</button>
                <button type="submit" disabled={isScheduling} className="px-4 py-2 bg-primaryColor text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                  {isScheduling ? "Scheduling..." : "Schedule Demo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedbackModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setFeedbackModal({ open: false, sessionId: null, match: null })}>
          <div className="bg-white dark:bg-darkdeep3-dark rounded-lg p-8 max-w-md w-full shadow-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Complete Demo — {feedbackModal.match.tutorName}</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <input type="hidden" name="sessionId" value={feedbackModal.sessionId} />
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Rating</label>
                <div className="flex gap-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFeedbackRating(star)}
                      className={`transition-colors ${star <= feedbackRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}>
                      ★
                    </button>
                  ))}
                </div>
                <input type="hidden" name="rating" value={feedbackRating} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Feedback</label>
                <textarea name="feedback" rows={3} className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="Share your experience..." />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Outcome</label>
                <select name="outcome" className="w-full p-2 border border-gray-300 rounded text-sm" required>
                  <option value="PENDING">Still Deciding</option>
                  <option value="HIRED">Hire this Tutor</option>
                  <option value="REJECTED">Not a Fit</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" onClick={() => setFeedbackModal({ open: false, sessionId: null, match: null })}>Cancel</button>
                <button type="submit" disabled={isSubmitting || !feedbackRating} className="px-4 py-2 bg-primaryColor text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestedTutors;
