"use client";

import { useState, useEffect } from "react";
import { TUTOR_APPLICATION_STATUS } from "@/redux/services/userSlice";
import { getSupabase } from "@/libs/supabase";
import { useRouter } from "next/navigation";

const STATUS_CONFIG = {
  [TUTOR_APPLICATION_STATUS.PENDING_REVIEW]: {
    icon: (
      <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Application Under Review",
    message: "Your tutor application has been submitted and is being reviewed by our admin team.",
    nextStep: "We'll review your qualifications and get back to you within 2-3 business days.",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    badgeText: "Pending Review",
  },
  [TUTOR_APPLICATION_STATUS.ADDITIONAL_INFO_REQUIRED]: {
    icon: (
      <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: "Additional Information Required",
    message: "Our admin team needs more information to process your application.",
    nextStep: "Please check the admin notes below and resubmit your application with the required details.",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    badgeText: "Info Required",
  },
  [TUTOR_APPLICATION_STATUS.REJECTED]: {
    icon: (
      <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: "Application Rejected",
    message: "We appreciate your interest, but your application was not approved at this time.",
    nextStep: "You may reapply after addressing the feedback provided below.",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700 border-red-200",
    badgeText: "Rejected",
  },
  [TUTOR_APPLICATION_STATUS.APPROVED]: {
    icon: (
      <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Application Approved",
    message: "Congratulations! Your tutor application has been approved.",
    nextStep: "You can now start offering tutoring services. Set up your profile and browse matching requirements.",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700 border-green-200",
    badgeText: "Approved",
  },
  default: {
    icon: (
      <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    title: "Application Status",
    message: "Your application is being processed.",
    nextStep: "Please wait while we review your application.",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    badgeText: "Processing",
  },
};

const ApplicationStatusCard = ({ status, adminNotes, onAction, onProceed }) => {
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.default;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown <= 0) {
      if (onAction) onAction();
      if (status === TUTOR_APPLICATION_STATUS.APPROVED) {
        if (onProceed) onProceed();
        else router.push("/instructor-profile");
      } else {
        router.push("/");
      }
    }
  }, [countdown, onAction, router, status, onProceed]);

  const isRejected = status === TUTOR_APPLICATION_STATUS.REJECTED;
  const isApproved = status === TUTOR_APPLICATION_STATUS.APPROVED;
  const isAdditionalInfoRequired = status === TUTOR_APPLICATION_STATUS.ADDITIONAL_INFO_REQUIRED;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className={`max-w-lg w-full ${config.bg} border ${config.border} rounded-2xl p-8 shadow-lg`}>
        <div className="flex justify-center mb-6">{config.icon}</div>

        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${config.badge} mb-4`}>
          {config.badgeText}
        </span>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{config.title}</h1>
        <p className="text-gray-700 mb-2">{config.message}</p>
        <p className="text-sm text-gray-500 mb-6">{config.nextStep}</p>

        {adminNotes && (
          <div className={`rounded-lg p-4 mb-6 ${status === TUTOR_APPLICATION_STATUS.REJECTED ? "bg-red-100" : "bg-white bg-opacity-60"}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
              {isRejected ? "Rejection Reason" : "Admin Notes"}
            </p>
            <p className={`text-sm ${isRejected ? "text-red-700" : "text-gray-700"}`}>{adminNotes}</p>
          </div>
        )}

        {isApproved && (
          <button
            onClick={() => {
              if (onProceed) onProceed();
              else router.push("/instructor-profile");
            }}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition mb-4"
          >
            Go to My Profile
          </button>
        )}

        {isAdditionalInfoRequired && (
          <button
            onClick={() => router.push("/tutor-registration")}
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition mb-4"
          >
            Resubmit
          </button>
        )}

        {isRejected && (
          <button
            onClick={() => router.push("/tutor-registration")}
            className="w-full py-3 bg-primaryColor text-white rounded-lg font-semibold hover:bg-opacity-90 transition mb-4"
          >
            Reapply
          </button>
        )}

        <div className="text-sm text-gray-400 text-center">
          {isApproved ? "Redirecting to your profile in " : "Auto-redirecting to home in "}<span className="font-bold text-gray-500">{countdown}</span>s
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusCard;
