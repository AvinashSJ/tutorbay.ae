"use client";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import Testimonials3 from "@/components/sections/testimonials/Testimonials3";
import React, { useState, useEffect } from "react";
import { useGetUserQuery } from "@/redux/services/userSlice";
import { useGetWalletBalanceQuery } from "@/redux/services/walletSlice";
import { useUnlockTutorContactMutation } from "@/redux/services/walletSlice";
import { WALLET_CONFIG } from "@/data/walletConfig";
import { FaLock, FaCoins, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import moment from "moment";
import Image from "next/image";
import placeholder from "@/assets/images/placeholder.png";
import { trackTutorProfileView, trackUnlockContact, trackUnlockSuccess, trackUnlockFailed } from "@/services/analytics";
import { getSupabase } from "@/libs/supabase";

const UNLOCK_COST = WALLET_CONFIG.UNLOCK_TUTOR_CONTACT_COST;

export default function InstructorDetailsMain({ id }) {
  const { data: tutor, error, isLoading } = useGetUserQuery(id);
  const { data: wallet, isLoading: walletLoading } = useGetWalletBalanceQuery();
  const [showContact, setShowContact] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [unlockSuccess, setUnlockSuccess] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockTutorContact] = useUnlockTutorContactMutation();

  const balance = wallet?.balance ?? 0;
  const hasEnoughCredits = balance >= UNLOCK_COST;

  useEffect(() => {
    if (!tutor) return;
    const getUserId = async () => {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id || null;
    };
    getUserId().then((userId) => {
      trackTutorProfileView(tutor, userId);
    });
  }, [tutor]);

  const handleUnlock = async () => {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    trackUnlockContact(id, "tutor", userId);
    setUnlockError("");
    setIsUnlocking(true);
    try {
      await unlockTutorContact({ tutorId: id }).unwrap();
      trackUnlockSuccess(id, "tutor", userId);
      setShowContact(true);
      setUnlockSuccess(true);
      setShowModal(false);
    } catch (err) {
      trackUnlockFailed(id, "tutor", err, userId);
      setUnlockError(err?.data || "Failed to unlock. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-red-500">
        Error loading tutor details. Please try again later.
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-contentColor dark:text-contentColor-dark">
        Tutor not found.
      </div>
    );
  }

  const firstName = tutor.fullName?.split(" ")[0] || "Tutor";
  const lastName = tutor.fullName?.split(" ").slice(1).join(" ") || "";

  return (
    <>
      <HeroPrimary
        path={"Tutor Profile"}
        title={`${firstName} ${lastName}`}
      />

      <section className="py-30px lg:py-50px relative">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-darkdeep3-dark rounded-lg p-8 max-w-sm w-full shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-headingColor dark:text-headingColor-dark">
                Unlock Contact Information
              </h3>

              {unlockSuccess ? (
                <div className="text-center">
                  <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                  <p className="text-contentColor dark:text-contentColor-dark mb-4">
                    Contact unlocked! You can now view the tutor&apos;s information above.
                  </p>
                  <button
                    className="btn-primary w-full"
                    onClick={() => {
                      setShowModal(false);
                      setUnlockSuccess(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-contentColor dark:text-contentColor-dark">
                    Viewing this tutor&apos;s contact will cost{" "}
                    <span className="font-bold text-primaryColor">{UNLOCK_COST} credits</span>.
                    <br />
                    Are you sure you want to proceed?
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 flex justify-between items-center">
                    <span className="text-sm text-contentColor dark:text-contentColor-dark">Your Balance</span>
                    <span className={`font-semibold ${hasEnoughCredits ? "text-green-600" : "text-red-500"}`}>
                      {walletLoading ? "Loading..." : `${balance} credits`}
                    </span>
                  </div>

                  {!hasEnoughCredits && !walletLoading && (
                    <div className="flex items-start gap-2 mb-4 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 p-3 rounded">
                      <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                      <span>Insufficient credits. You need {UNLOCK_COST - balance} more credits.</span>
                    </div>
                  )}

                  {unlockError && (
                    <div className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                      {unlockError}
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <button
                      className="px-4 py-2 border border-borderColor rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
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
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white inline-block" />
                          Unlocking&hellip;
                        </>
                      ) : (
                        <>
                          <FaCoins />
                          Unlock ({UNLOCK_COST} credits)
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="container">
          <div className="relative rounded-xl overflow-hidden mb-8 bg-gray-100 h-48">
            {tutor.backgroundImage ? (
              <Image src={tutor.backgroundImage} alt={`${firstName} cover`} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Cover Photo</div>
            )}
            <div className="absolute -bottom-16 left-6 z-10 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-lightGrey7">
              <Image src={tutor.profileImage || placeholder} alt={`${firstName} ${lastName}`} width={128} height={128} className="object-cover w-full h-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30px" style={{ marginTop: '80px' }}>
            <div className="lg:col-span-1">
              <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-4">
                  {firstName} {lastName}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Contact Information
                    </h3>
                    {!showContact ? (
                      <button
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-all text-sm"
                        onClick={() => {
                          setUnlockError("");
                          setUnlockSuccess(false);
                          setShowModal(true);
                        }}
                      >
                        <FaLock />
                        Unlock Contact Information
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-contentColor dark:text-contentColor-dark">
                          <i className="icofont-envelope mr-2" />
                          {tutor.email || "Not available"}
                        </p>
                        <p className="text-contentColor dark:text-contentColor-dark">
                          <i className="icofont-phone mr-2" />
                          {tutor.phone || "Not available"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Teaching Details
                    </h3>
                    <p className="text-contentColor dark:text-contentColor-dark">
                      <strong>Mode:</strong>{" "}
                      {tutor.tutorProfile?.modeOfTeaching || "Not specified"}
                    </p>
                    <p className="text-contentColor dark:text-contentColor-dark mt-2">
                      <strong>Qualification:</strong>{" "}
                      {tutor.tutorProfile?.highestQualification || "Not specified"}
                    </p>
                    <p className="text-contentColor dark:text-contentColor-dark mt-2">
                      <strong>Hourly Rate:</strong> AED{" "}
                      {tutor.tutorProfile?.expectedFeePerHour || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-whiteColor dark:bg-whiteColor-dark rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-blackColor dark:text-blackColor-dark mb-4">
                  About
                </h3>
                <div className="space-y-4">
                  {tutor.tutorProfile?.bio && (
                    <p className="text-contentColor dark:text-contentColor-dark">
                      {tutor.tutorProfile.bio}
                    </p>
                  )}
                  <div>
                    <h4 className="font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tutor.tutorProfile?.subjects?.map((subject, index) => (
                        <span
                          key={index}
                          className="bg-primaryColor bg-opacity-10 text-primaryColor px-3 py-1 rounded-full text-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tutor.tutorProfile?.areas?.map((area, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                      Availability
                    </h4>
                    <div className="space-y-2">
                      {tutor.tutorProfile?.availability?.length > 0 ? (
                        tutor.tutorProfile.availability.map((slot, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            <p className="text-contentColor dark:text-contentColor-dark">
                              <strong className="text-primaryColor">{slot.days}:</strong>{" "}
                              {slot.startTime} – {slot.endTime}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-secondary-light text-sm">No availability set</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Testimonials3 id={id} isInsTructorDetails={true} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}