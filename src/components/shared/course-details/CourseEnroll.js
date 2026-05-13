"use client";
import Image from "next/image";
import blogImage7 from "@/assets/images/blog/blog_7.png";
import {
  FaLock,
  FaCoins,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBookmark,
  FaUserGraduate,
  FaUnlockAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useGetWalletBalanceQuery } from "@/redux/services/walletSlice";
import { useUnlockRequirementContactMutation } from "@/redux/services/walletSlice";
import { WALLET_CONFIG } from "@/data/walletConfig";
import { trackUnlockContact, trackUnlockSuccess, trackUnlockFailed, trackApplyTutor, trackSaveRequirement } from "@/services/analytics";
import { getSupabase } from "@/libs/supabase";

const UNLOCK_COST = WALLET_CONFIG.UNLOCK_REQUIREMENT_COST;

const CourseEnroll = ({ type, course }) => {
  const requirement = course?.requirement;
  const [showContact, setShowContact] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [unlockSuccess, setUnlockSuccess] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [unlockedContact, setUnlockedContact] = useState(null);
  const [unlockRequirementContact] = useUnlockRequirementContactMutation();

  const { data: wallet, isLoading: walletLoading } = useGetWalletBalanceQuery();
  const balance = wallet?.balance ?? 0;
  const hasEnoughCredits = balance >= UNLOCK_COST;

  const isRequirement = !!requirement;
  const {
    title,
    subject,
    area,
    curriculum,
    grade,
    modeOfTeaching,
    ownerName,
    ownerEmail,
    expectedFeePerHour,
    availability,
    additionalNotes,
    status,
    createdAt,
  } = requirement || course || {};

  const gradeLabel = grade ? `Year ${grade}` : null;
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  // On mount, check if current tutor already unlocked this requirement
  useEffect(() => {
    if (!requirement?.id) return;
    const checkUnlocked = async () => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.rpc("get_unlocked_requirements", { p_tutor_id: user.id });
      const match = data?.find((r) => r.requirement_id === requirement.id);
      if (match) {
        setUnlockedContact({ email: match.parent_email, phone: match.parent_phone });
        setShowContact(true);
        setUnlockSuccess(true);
      }
    };
    checkUnlocked();
  }, [requirement?.id]);

  const handleUnlock = async () => {
    if (!requirement?.id) return;
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    trackUnlockContact(requirement.id, "requirement", userId);
    setUnlockError("");
    setIsUnlocking(true);
    try {
      const result = await unlockRequirementContact({ requirementId: requirement.id }).unwrap();
      trackUnlockSuccess(requirement.id, "requirement", userId);
      setUnlockedContact({ email: result.email, phone: result.phone });
      setShowContact(true);
      setUnlockSuccess(true);
      setShowModal(false);
    } catch (err) {
      trackUnlockFailed(requirement.id, "requirement", err, userId);
      setUnlockError(err?.data || "Failed to unlock.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSave = () => {
    if (requirement?.id) {
      const supabase = getSupabase();
      supabase.auth.getUser().then(({ data: { user } }) => {
        trackSaveRequirement(requirement.id, !saved, user?.id || null);
      });
    }
    setSaved(!saved);
  };

  const handleApplyTutor = () => {
    if (requirement?.id) {
      const supabase = getSupabase();
      supabase.auth.getUser().then(({ data: { user } }) => {
        trackApplyTutor(requirement.id, "requirement", user?.id || null);
      });
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-darkdeep3-dark rounded-lg p-8 max-w-sm w-full shadow-lg mx-4">
            <h3 className="text-lg font-semibold mb-4 text-blackColor dark:text-whiteColor">
              Unlock Contact Information
            </h3>
            {unlockSuccess ? (
              <div className="text-center">
                <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                <p className="text-contentColor dark:text-contentColor-dark mb-4">
                  Contact unlocked successfully!
                </p>
                <button
                  className="w-full py-2 bg-primaryColor text-white rounded-lg"
                  onClick={() => { setShowModal(false); setUnlockSuccess(false); }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-contentColor dark:text-contentColor-dark">
                  Viewing contact will cost{" "}
                  <span className="font-bold text-primaryColor">{UNLOCK_COST} credits</span>.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 flex justify-between">
                  <span className="text-sm text-contentColor dark:text-contentColor-dark">Your Balance</span>
                  <span className={`font-semibold ${hasEnoughCredits ? "text-green-600" : "text-red-500"}`}>
                    {walletLoading ? "..." : `${balance} credits`}
                  </span>
                </div>
                {!hasEnoughCredits && !walletLoading && (
                  <div className="flex items-start gap-2 mb-4 text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                    <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                    <span>Insufficient credits. You need {UNLOCK_COST - balance} more.</span>
                  </div>
                )}
                {unlockError && (
                  <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    {unlockError}
                  </div>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 border border-borderColor rounded-lg"
                    onClick={() => setShowModal(false)}
                    disabled={isUnlocking}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary flex items-center gap-2"
                    onClick={handleUnlock}
                    disabled={isUnlocking || !hasEnoughCredits}
                  >
                    {isUnlocking ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block" />
                    ) : (
                      <FaCoins />
                    )}
                    Unlock ({UNLOCK_COST} credits)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div
        className="py-5 px-5 shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md"
        data-aos="fade-up"
      >
        {isRequirement ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-blackColor dark:text-whiteColor uppercase tracking-wide">
                Requirement Details
              </h3>
              {status && (
                <span className="text-xs px-2 py-0.5 bg-primaryColor/10 text-primaryColor rounded-full font-medium capitalize">
                  {status.replace(/_/g, " ")}
                </span>
              )}
            </div>

            {expectedFeePerHour && (
              <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px mb-3">
                AED {expectedFeePerHour}{" "}
                <span className="text-sm text-lightGrey4 font-semibold">/hr</span>
              </div>
            )}

            <ul className="space-y-0 mb-3">
              {curriculum && (
                <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                  <p className="text-xs font-medium text-contentColor dark:text-contentColor-dark">Curriculum</p>
                  <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-0.5 bg-borderColor dark:bg-borderColor-dark rounded-full">{curriculum}</p>
                </li>
              )}
              {gradeLabel && (
                <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                  <p className="text-xs font-medium text-contentColor dark:text-contentColor-dark">Grade</p>
                  <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-0.5 bg-borderColor dark:bg-borderColor-dark rounded-full">{gradeLabel}</p>
                </li>
              )}
              {modeOfTeaching && (
                <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                  <p className="text-xs font-medium text-contentColor dark:text-contentColor-dark">Mode</p>
                  <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-0.5 bg-borderColor dark:bg-borderColor-dark rounded-full capitalize">{modeOfTeaching}</p>
                </li>
              )}
              {area && (
                <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                  <p className="text-xs font-medium text-contentColor dark:text-contentColor-dark">Area</p>
                  <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-0.5 bg-borderColor dark:bg-borderColor-dark rounded-full">{area}</p>
                </li>
              )}
              {subject && (
                <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                  <p className="text-xs font-medium text-contentColor dark:text-contentColor-dark">Subject</p>
                  <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-0.5 bg-borderColor dark:bg-borderColor-dark rounded-full">{subject}</p>
                </li>
              )}
              {ownerName && (
                <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                  <p className="text-xs font-medium text-contentColor dark:text-contentColor-dark">Parent</p>
                  <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-0.5 bg-borderColor dark:bg-borderColor-dark rounded-full">{ownerName}</p>
                </li>
              )}
              {formattedDate && (
                <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                  <p className="text-xs font-medium text-contentColor dark:text-contentColor-dark">Posted</p>
                  <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-0.5 bg-borderColor dark:bg-borderColor-dark rounded-full">{formattedDate}</p>
                </li>
              )}
            </ul>

            {availability && availability.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-blackColor dark:text-whiteColor mb-2">Availability</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded space-y-1.5">
                  {availability.map((slot, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-primaryColor">{slot.days}</span>
                      <span className="text-contentColor dark:text-contentColor-dark">{slot.startTime} – {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 mb-3">
              {!showContact ? (
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold"
                  onClick={() => { setUnlockError(""); setUnlockSuccess(false); setShowModal(true); }}
                >
                  <FaLock />
                  Unlock Contact ({UNLOCK_COST} credits)
                </button>
              ) : (
                <>
                  <span className="flex items-center gap-2 w-full py-2 px-4 bg-green-100 text-green-700 rounded-md text-sm font-semibold">
                    <FaUnlockAlt /> Unlocked
                  </span>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded space-y-1.5">
                    <p className="text-xs text-contentColor dark:text-contentColor-dark">
                      <span className="font-semibold">Parent Name:</span> {ownerName || "—"}
                    </p>
                    <p className="text-xs text-contentColor dark:text-contentColor-dark">
                      <span className="font-semibold">Email:</span> {unlockedContact?.email || ownerEmail || "—"}
                    </p>
                    {unlockedContact?.phone && (
                      <p className="text-xs text-contentColor dark:text-contentColor-dark">
                        <span className="font-semibold">Phone:</span> {unlockedContact.phone}
                      </p>
                    )}
                  </div>
                </>
              )}

              <button className="w-full flex items-center justify-center gap-2 py-3 bg-secondaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-semibold" onClick={handleApplyTutor}>
                <FaUserGraduate />
                Apply for Tutor
              </button>

              <button
                className={`w-full flex items-center justify-center gap-2 py-3 border rounded-lg transition-all text-sm font-semibold ${
                  saved
                    ? "border-primaryColor text-primaryColor bg-primaryColor/5"
                    : "border-borderColor text-contentColor dark:text-contentColor-dark hover:border-primaryColor hover:text-primaryColor"
                }`}
                onClick={handleSave}
              >
                <FaBookmark className={saved ? "fill-primaryColor" : ""} />
                {saved ? "Saved" : "Save Requirement"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="overflow-hidden relative mb-5">
              <Image
                src={course?.image || blogImage7}
                alt={course?.title || "Course"}
                className="w-full"
              />
            </div>
            <div className="text-size-21 font-bold text-primaryColor font-inter leading-25px mb-4">
              ${course?.price ? course.price.toFixed(2) : "0.00"}{" "}
              <del className="text-sm text-lightGrey4 font-semibold">/ $67.00</del>
            </div>
            <ul className="space-y-0 mb-4">
              <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark">Instructor</p>
                <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full">D. Willaim</p>
              </li>
              <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark">Start Date</p>
                <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full">05 Dec 2024</p>
              </li>
              <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark">Duration</p>
                <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full">08Hrs 32Min</p>
              </li>
              <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark">Lectures</p>
                <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full">30</p>
              </li>
              <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark">Skill Level</p>
                <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full">Basic</p>
              </li>
              <li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
                <p className="text-sm font-medium text-contentColor dark:text-contentColor-dark">Language</p>
                <p className="text-xs text-blackColor dark:text-whiteColor px-2 py-1 bg-borderColor dark:bg-borderColor-dark rounded-full">Spanish</p>
              </li>
            </ul>
            <button className="w-full py-3 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium mb-2">
              Add To Cart
            </button>
            <button className="w-full py-3 bg-secondaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium">
              Buy Now
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default CourseEnroll;