"use client";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { FaLock, FaUnlockAlt, FaCheckCircle, FaUserGraduate, FaCalendarAlt } from "react-icons/fa";
import { useUnlockRequirementContactMutation, useGetWalletBalanceQuery, useGetUnlockedRequirementsQuery } from "@/redux/services/walletSlice";
import { useGetTutorRequirementMatchesQuery, useTutorApplyToRequirementMutation, useScheduleMatchSessionMutation } from "@/redux/services/userSlice";
import { useUser } from "@/hooks/useUser";
import { WALLET_CONFIG } from "@/data/walletConfig";
import toast from "react-hot-toast";
import { trackUnlockContact, trackUnlockSuccess, trackUnlockFailed, trackApplyRequirement, trackScheduleDemo } from "@/services/analytics";

const UNLOCK_COST = WALLET_CONFIG.UNLOCK_REQUIREMENT_COST;

const RequirementActions = ({ requirementId }) => {
  const { userId } = useUser();

  const { data: wallet } = useGetWalletBalanceQuery();
  const { data: unlockedReqs } = useGetUnlockedRequirementsQuery();
  const { data: existingMatches } = useGetTutorRequirementMatchesQuery(userId, { skip: !userId });
  const [unlockContact] = useUnlockRequirementContactMutation();
  const [applyToRequirement] = useTutorApplyToRequirementMutation();
  const [scheduleSession] = useScheduleMatchSessionMutation();

  const [unlockingId, setUnlockingId] = useState(null);
  const [applyingId, setApplyingId] = useState(null);
  const [schedulingId, setSchedulingId] = useState(null);
  const [localUnlocked, setLocalUnlocked] = useState(null);
  const [localApplied, setLocalApplied] = useState(null);
  const [scheduleModal, setScheduleModal] = useState({ open: false, matchId: null });
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const isUnlocked = useMemo(() => {
    if (localUnlocked) return localUnlocked;
    const found = unlockedReqs?.find((u) => u.requirement_id === requirementId);
    return found ? { contact: { email: found.parent_email, phone: found.parent_phone } } : null;
  }, [localUnlocked, unlockedReqs, requirementId]);

  const applied = useMemo(() => {
    if (localApplied) return localApplied;
    const found = existingMatches?.find((m) => m.requirement_id === requirementId);
    return found ? { matchId: found.match_id, status: found.status } : null;
  }, [localApplied, existingMatches, requirementId]);

  const balance = wallet?.balance ?? 0;
  const hasEnoughCredits = balance >= UNLOCK_COST;

  const handleUnlock = useCallback(async () => {
    setUnlockingId(requirementId);
    trackUnlockContact(requirementId, "requirement", userId);
    try {
      const result = await unlockContact({ requirementId }).unwrap();
      setLocalUnlocked({ contact: { email: result.email, phone: result.phone } });
      trackUnlockSuccess(requirementId, "requirement", userId);
      toast.success("Contact unlocked!");
    } catch (err) {
      trackUnlockFailed(requirementId, "requirement", err, userId);
      toast.error(err?.data || "Failed to unlock contact");
    } finally {
      setUnlockingId(null);
    }
  }, [requirementId, unlockContact, userId]);

  const handleApply = useCallback(async () => {
    setApplyingId(requirementId);
    trackApplyRequirement(requirementId, userId);
    try {
      const result = await applyToRequirement({ requirementId }).unwrap();
      if (result?.success) {
        setLocalApplied({ matchId: result.matchId, status: result.status });
        toast.success("Applied successfully!");
      } else if (result?.matchId) {
        setLocalApplied({ matchId: result.matchId, status: result.status });
        toast(result?.error || "Already applied");
      }
    } catch (err) {
      toast.error(err?.data || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  }, [applyToRequirement, requirementId, userId]);

  const handleScheduleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const matchId = fd.get("matchId");
    const scheduledAt = fd.get("scheduledAt");
    const sessionType = fd.get("sessionType");
    if (!matchId || !scheduledAt || !sessionType) {
      toast.error("Please fill all required fields");
      return;
    }
    setSchedulingId(matchId);
    try {
      const result = await scheduleSession({
        matchId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        sessionType,
        locationUrl: fd.get("locationUrl") || undefined,
        meetingLink: fd.get("meetingLink") || undefined,
      }).unwrap();
      if (result?.success) {
        trackScheduleDemo(matchId, requirementId, userId);
        toast.success("Demo scheduled!");
        setScheduleModal({ open: false, matchId: null });
      }
    } catch (err) {
      toast.error(err?.data || "Failed to schedule demo");
    } finally {
      setSchedulingId(null);
    }
  }, [scheduleSession, requirementId, userId]);

  return (
    <div className="mt-3 space-y-2">
      {!isUnlocked && !applied && (
        <>
          {!userId ? (
            <button
              onClick={() => setShowSignupPrompt(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold"
            >
              <><FaLock /> Unlock Contact ({UNLOCK_COST} credits)</>
            </button>
          ) : (
            <>
              <button
                onClick={handleUnlock}
                disabled={unlockingId === requirementId || !hasEnoughCredits}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold disabled:opacity-50"
              >
                {unlockingId === requirementId ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block" />
                ) : (
                  <><FaLock /> Unlock Contact ({UNLOCK_COST} credits)</>
                )}
              </button>
              {!hasEnoughCredits && (
                <p className="text-xs text-red-500 text-center">Insufficient credits</p>
              )}
            </>
          )}
        </>
      )}

      {isUnlocked && (
        <>
          <span className="flex items-center gap-2 w-full py-2 px-4 bg-green-100 text-green-700 rounded-md text-sm font-semibold">
            <FaUnlockAlt /> Unlocked
          </span>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded space-y-1.5">
            <p className="text-xs text-contentColor dark:text-contentColor-dark">
              <span className="font-semibold">Parent Email:</span> {isUnlocked.contact.email || "—"}
            </p>
            <p className="text-xs text-contentColor dark:text-contentColor-dark">
              <span className="font-semibold">Parent Phone:</span> {isUnlocked.contact.phone || "—"}
            </p>
          </div>

          {!applied && (
            <button
              onClick={handleApply}
              disabled={applyingId === requirementId}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold disabled:opacity-50"
            >
              {applyingId === requirementId ? (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block" />
              ) : (
                <><FaUserGraduate /> Apply Now</>
              )}
            </button>
          )}
        </>
      )}

      {applied && (
        <>
          <span className="flex items-center gap-2 w-full py-2 px-4 bg-green-100 text-green-700 rounded-md text-sm font-semibold">
            <FaCheckCircle /> {applied.status === "MATCHED" ? "Applied" : applied.status}
          </span>
          {applied.status === "MATCHED" && (
            <button
              onClick={() => setScheduleModal({ open: true, matchId: applied.matchId })}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold"
            >
              <FaCalendarAlt /> Schedule a Demo
            </button>
          )}
        </>
      )}

      {showSignupPrompt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowSignupPrompt(false)}>
          <div className="bg-white dark:bg-darkdeep3-dark rounded-lg p-8 max-w-md w-full shadow-lg mx-4 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-4">🔓</div>
            <h3 className="text-2xl font-bold text-blackColor dark:text-whiteColor mb-3">
              Unlock the Contact Details
            </h3>
            <p className="text-lg text-contentColor dark:text-contentColor-dark mb-2">
              Get free credits. Start earning!
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-primaryColor text-whiteColor rounded-lg hover:bg-opacity-90 transition-all text-base font-semibold"
              >
                Sign up now!
              </Link>
              <button
                onClick={() => setShowSignupPrompt(false)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {scheduleModal.open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-40" onClick={() => setScheduleModal({ open: false, matchId: null })}>
          <div className="bg-white dark:bg-darkdeep3-dark rounded-lg p-8 max-w-md w-full shadow-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-blackColor dark:text-whiteColor">
              Schedule a Demo Session
            </h3>
            <form onSubmit={handleScheduleSubmit}>
              <input type="hidden" name="matchId" value={scheduleModal.matchId} />
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Location URL (optional)</label>
                <input type="url" name="locationUrl" className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="https://maps.google.com/..." />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Meeting Link (optional)</label>
                <input type="url" name="meetingLink" className="w-full p-2 border border-gray-300 rounded text-sm" placeholder="https://zoom.us/..." />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" onClick={() => setScheduleModal({ open: false, matchId: null })}>
                  Cancel
                </button>
                <button type="submit" disabled={schedulingId === scheduleModal.matchId} className="px-4 py-2 bg-primaryColor text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                  {schedulingId === scheduleModal.matchId ? "Scheduling..." : "Schedule Demo"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default RequirementActions;
