"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGetUserQuery, useSubmitTutorApplicationMutation, useGetTutorApplicationStatusQuery, useMarkApprovedNotifiedMutation, useSaveTutorDraftMutation } from "@/redux/services/userSlice";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import GoogleMapModal from "@/components/shared/gmapsPopup";
import Image from "next/image";
import { TUTOR_APPLICATION_STATUS } from "@/redux/services/userSlice";
import { getSupabase } from "@/libs/supabase";
import ApplicationStatusCard from "@/components/shared/status/ApplicationStatusCard";
import { validateSection, isSectionFilled } from "@/libs/tutorRegistrationValidation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inputClass = "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-colors";
const inputErrorClass = "border-red-400 focus:border-red-500 focus:ring-red-200";
const inputNormalClass = "border-gray-300";
const labelClass = "block text-sm font-medium text-gray-600 mb-1";
const errorTextClass = "text-red-500 text-xs mt-1";

const sections = [
  { title: "Personal Info", key: "personal" },
  { title: "Teaching Details", key: "teaching" },
  { title: "Location & License", key: "location" },
  { title: "Availability", key: "availability" },
];

const ChevronIcon = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const formField = (name, value, error, onChange, disabled) => ({
  name,
  value,
  error,
  onChange,
  disabled,
  className: `${inputClass} ${error ? inputErrorClass : inputNormalClass}`,
});

const requiredLabel = (text) => (
  <>{text} <span className="text-red-500">*</span></>
);

const FieldError = ({ error }) => (
  error ? <p className={errorTextClass}>{error}</p> : null
);

const InputField = ({ label, required, error, children, ...props }) => (
  <div>
    <label className={labelClass}>{required ? requiredLabel(label) : label}</label>
    {children}
    <FieldError error={error} />
  </div>
);

const TutorRegistrationPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [expandedSection, setExpandedSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [submitApplication] = useSubmitTutorApplicationMutation();
  const [licenseImage, setLicenseImage] = useState(null);
  const [licensePreview, setLicensePreview] = useState("");
  const [sectionErrors, setSectionErrors] = useState([{}, {}, {}, {}]);
  const [markApprovedNotified] = useMarkApprovedNotifiedMutation();
  const redirectGuard = useRef(false);

  const { data: userData, isLoading: userLoading } = useGetUserQuery(user?.id, {
    skip: !user?.id,
  });

  const { data: appStatus, isLoading: statusLoading } = useGetTutorApplicationStatusQuery(user?.id, {
    skip: !user?.id,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    nationality: "",
    highestQualification: "",
    modeOfTeaching: "Online",
    expectedFeePerHour: "",
    hasPrivateTutorLicense: false,
    emirateId: "",
    subjects: [],
    areas: [],
    bio: "",
    availability: [],
    location: {
      currentLocationURL: "",
      mapLocation: [],
    },
  });

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn, router]);

  const status = appStatus?.applicationStatus;
  const showStatus = status && status !== TUTOR_APPLICATION_STATUS.DRAFT;

  // APPROVED + already notified → skip straight to profile
  useEffect(() => {
    if (redirectGuard.current) return;
    if (status === TUTOR_APPLICATION_STATUS.APPROVED && appStatus?.approvedNotified) {
      redirectGuard.current = true;
      router.push("/instructor-profile");
    }
  }, [status, appStatus?.approvedNotified, router]);

  const handleApprovedProceed = useCallback(async () => {
    if (redirectGuard.current) return;
    redirectGuard.current = true;
    try {
      await markApprovedNotified(user?.id);
    } catch {}
    router.push("/instructor-profile");
  }, [markApprovedNotified, user?.id, router]);

  const [saveTutorDraft] = useSaveTutorDraftMutation();

  const handleSaveExit = useCallback(async () => {
    try {
      await saveTutorDraft({ userId: user?.id, profileData: formData }).unwrap();
      toast.success("Draft saved");
    } catch {
      toast.error("Failed to save draft");
    }
    const supabase = getSupabase();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("tutorbay-auth");
      localStorage.removeItem("user");
    }
    router.push("/");
  }, [saveTutorDraft, user?.id, formData, router]);

  useEffect(() => {
    if (userData) {
      const nameParts = (userData.fullName || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        phone: userData.phone || "",
        nationality: userData.tutorProfile?.nationality || "",
        highestQualification: userData.tutorProfile?.highestQualification || "",
        modeOfTeaching: userData.tutorProfile?.modeOfTeaching || "Online",
        expectedFeePerHour: userData.tutorProfile?.expectedFeePerHour || "",
        hasPrivateTutorLicense: userData.tutorProfile?.hasPrivateTutorLicense || false,
        emirateId: userData.emiratesId || userData.tutorProfile?.emirateId || "",
        subjects: userData.tutorProfile?.subjects || [],
        areas: userData.tutorProfile?.areas || [],
        bio: userData.tutorProfile?.bio || "",
        availability: userData.tutorProfile?.availability || [],
        location: userData.tutorProfile?.location || { currentLocationURL: "", mapLocation: [] },
      }));
      setLicensePreview(userData.tutorProfile?.licenseDocumentUrl || "");
    }
  }, [userData]);

  const handleLogout = useCallback(async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("tutorbay-auth");
      localStorage.removeItem("user");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for the touched field
    setSectionErrors((prev) => {
      const updated = [...prev];
      const sectionIdx = getFieldSection(name);
      if (sectionIdx >= 0 && updated[sectionIdx][name]) {
        updated[sectionIdx] = { ...updated[sectionIdx], [name]: undefined };
      }
      return updated;
    });
  };

  const getFieldSection = (fieldName) => {
    const personalFields = ["firstName", "lastName", "phone", "nationality", "emirateId"];
    const teachingFields = ["highestQualification", "modeOfTeaching", "expectedFeePerHour", "subjects", "areas", "bio"];
    const locationFields = ["location", "hasPrivateTutorLicense", "licenseDocumentUrl"];
    if (personalFields.includes(fieldName)) return 0;
    if (teachingFields.includes(fieldName)) return 1;
    if (locationFields.includes(fieldName)) return 2;
    return -1;
  };

  const handleArrayInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()).filter(Boolean),
    }));
  };

  const handleLicenseImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseImage(file);
      setLicensePreview(URL.createObjectURL(file));
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData((prev) => ({ ...prev, availability: newAvailability }));
    // Clear slot errors when user edits
    setSectionErrors((prev) => {
      const updated = [...prev];
      if (updated[3]?.slots?.[index]?.[field]) {
        const newSlots = [...updated[3].slots];
        newSlots[index] = { ...newSlots[index], [field]: undefined };
        updated[3] = { ...updated[3], slots: newSlots };
      }
      return updated;
    });
  };

  const addAvailabilitySlot = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { days: "", startTime: "", endTime: "" }],
    }));
  };

  const removeAvailabilitySlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        currentLocationURL: location.mapUrl || location.url,
        mapLocation: [{ lat: location.lat, lng: location.lng }],
      },
    }));
    setSectionErrors((prev) => {
      const updated = [...prev];
      if (updated[2]?.location) {
        updated[2] = { ...updated[2], location: undefined };
      }
      return updated;
    });
  };

  const toggleSection = (idx) => {
    setExpandedSection((prev) => (prev === idx ? null : idx));
  };

  const goToNext = () => {
    // Validate current section before advancing
    const result = validateSection(formData, expandedSection);
    setSectionErrors((prev) => {
      const updated = [...prev];
      updated[expandedSection] = result.errors;
      return updated;
    });
    if (result.isValid) {
      setExpandedSection((prev) => Math.min(prev + 1, sections.length - 1));
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const goToPrev = () => {
    setExpandedSection((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate all sections
    const newErrors = sections.map((_, idx) => validateSection(formData, idx).errors);
    setSectionErrors(newErrors);

    const hasErrors = newErrors.some((err) => Object.keys(err).length > 0);
    if (hasErrors) {
      const firstErrorSection = newErrors.findIndex((err) => Object.keys(err).length > 0);
      setExpandedSection(firstErrorSection);
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        expectedFeePerHour: parseInt(formData.expectedFeePerHour),
      };

      await submitApplication({
        userId: user.id,
        profileData: payload,
      }).unwrap();

      toast.success("Application submitted successfully! Waiting for admin review.");
      router.push("/tutor-registration?status=pending");
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || userLoading || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  // APPROVED + already notified → skip card entirely, useEffect handles redirect
  if (status === TUTOR_APPLICATION_STATUS.APPROVED && appStatus?.approvedNotified) {
    return null;
  }

  if (showStatus) {
    return <ApplicationStatusCard status={status} adminNotes={appStatus?.adminNotes} onAction={handleLogout} onProceed={status === TUTOR_APPLICATION_STATUS.APPROVED ? handleApprovedProceed : undefined} />;
  }

  const isReadOnly = status === TUTOR_APPLICATION_STATUS.PENDING_REVIEW ||
                     status === TUTOR_APPLICATION_STATUS.APPROVED;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-center mb-2">Tutor Registration</h1>
          <p className="text-gray-600 text-center mb-4">
            Complete your profile to apply as a tutor
          </p>
          <p className="text-xs text-gray-400 text-center mb-8">
            <span className="text-red-500">*</span> indicates required field
          </p>

          {!isReadOnly && (
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={handleSaveExit}
                className="text-sm text-gray-500 hover:text-primaryColor transition underline"
              >
                Save &amp; Exit
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {sections.map((section, idx) => {
              const isOpen = expandedSection === idx;
              const filled = isSectionFilled(formData, idx);
              const errors = sectionErrors[idx] || {};
              const errorCount = Object.keys(errors).filter((k) => k !== "slots").length +
                (errors.slots?.length || 0);

              return (
                <div key={idx} className={`border rounded-lg mb-3 overflow-hidden ${errorCount > 0 && !isOpen ? "border-red-300" : "border-gray-200"}`}>
                  <button
                    type="button"
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-[#F8FAFC] hover:bg-gray-100 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0
                        ${errorCount > 0 ? "bg-red-500 text-white" : filled ? "bg-green-500 text-white" : "bg-primaryColor text-white"}`}
                      >
                        {errorCount > 0 ? <ErrorIcon /> : filled ? <CheckIcon /> : idx + 1}
                      </span>
                      <span className="font-semibold text-gray-800">{section.title}</span>
                      {errorCount > 0 && (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          {errorCount} error{errorCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <ChevronIcon open={isOpen} />
                  </button>

                  {isOpen && (
                    <div className="px-5 py-4 border-t border-gray-200 space-y-4">
                      {/* Section 0: Personal Info */}
                      {idx === 0 && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <InputField label="First Name" required error={errors.firstName}>
                              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                className={formField("firstName", formData.firstName, errors.firstName, handleInputChange, isReadOnly).className}
                                required disabled={isReadOnly} />
                            </InputField>
                            <InputField label="Last Name" required error={errors.lastName}>
                              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                className={formField("lastName", formData.lastName, errors.lastName, handleInputChange, isReadOnly).className}
                                required disabled={isReadOnly} />
                            </InputField>
                          </div>
                          <InputField label="Phone" required error={errors.phone}>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                              className={formField("phone", formData.phone, errors.phone, handleInputChange, isReadOnly).className}
                              placeholder="e.g. 0501234567" required disabled={isReadOnly} />
                          </InputField>
                          <InputField label="Nationality" required error={errors.nationality}>
                            <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange}
                              className={formField("nationality", formData.nationality, errors.nationality, handleInputChange, isReadOnly).className}
                              required disabled={isReadOnly} />
                          </InputField>
                          <InputField label="Emirates ID" error={errors.emirateId}>
                            <input type="text" name="emirateId" value={formData.emirateId} onChange={handleInputChange}
                              className={formField("emirateId", formData.emirateId, errors.emirateId, handleInputChange, isReadOnly).className}
                              placeholder="784-XXXX-XXXXXXX-X" disabled={isReadOnly} />
                          </InputField>
                        </>
                      )}

                      {/* Section 1: Teaching Details */}
                      {idx === 1 && (
                        <>
                          <InputField label="Highest Qualification" required error={errors.highestQualification}>
                            <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleInputChange}
                              className={formField("highestQualification", formData.highestQualification, errors.highestQualification, handleInputChange, isReadOnly).className}
                              placeholder="e.g. Bachelor's in Mathematics" required disabled={isReadOnly} />
                          </InputField>
                          <InputField label="Mode of Teaching" required error={errors.modeOfTeaching}>
                            <select name="modeOfTeaching" value={formData.modeOfTeaching} onChange={handleInputChange}
                              className={`${inputClass} ${errors.modeOfTeaching ? inputErrorClass : inputNormalClass}`}
                              required disabled={isReadOnly}>
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                              <option value="Both">Both</option>
                            </select>
                          </InputField>
                          <InputField label="Expected Fee per Hour (AED)" required error={errors.expectedFeePerHour}>
                            <input type="number" name="expectedFeePerHour" value={formData.expectedFeePerHour} onChange={handleInputChange}
                              className={formField("expectedFeePerHour", formData.expectedFeePerHour, errors.expectedFeePerHour, handleInputChange, isReadOnly).className}
                              min="1" step="1" placeholder="e.g. 100" required disabled={isReadOnly} />
                          </InputField>
                          <InputField label="Subjects" required error={errors.subjects}>
                            <input type="text" value={formData.subjects.join(", ")}
                              onChange={(e) => handleArrayInputChange("subjects", e.target.value)}
                              className={`${inputClass} ${errors.subjects ? inputErrorClass : inputNormalClass}`}
                              placeholder="Math, Physics, Chemistry" required disabled={isReadOnly} />
                          </InputField>
                          <InputField label="Areas" required error={errors.areas}>
                            <input type="text" value={formData.areas.join(", ")}
                              onChange={(e) => handleArrayInputChange("areas", e.target.value)}
                              className={`${inputClass} ${errors.areas ? inputErrorClass : inputNormalClass}`}
                              placeholder="Dubai Marina, JBR, Downtown" required disabled={isReadOnly} />
                          </InputField>
                          <InputField label="Bio">
                            <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4}
                              className={inputClass} disabled={isReadOnly} />
                          </InputField>
                        </>
                      )}

                      {/* Section 2: Location & License */}
                      {idx === 2 && (
                        <>
                          <InputField label="Location" required error={errors.location}>
                            <div className="flex items-center gap-3">
                              <button type="button" onClick={() => setIsMapModalOpen(true)}
                                className={`px-4 py-2 rounded-md text-sm transition ${errors.location ? "bg-red-50 text-red-700 border border-red-300 hover:bg-red-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                disabled={isReadOnly}>
                                {formData.location.currentLocationURL ? "Change Location" : "Set Location on Map"}
                              </button>
                              {formData.location.currentLocationURL && (
                                <a href={formData.location.currentLocationURL} target="_blank" rel="noopener noreferrer"
                                  className="text-primaryColor hover:underline text-sm">View on Map</a>
                              )}
                            </div>
                          </InputField>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <input type="checkbox" name="hasPrivateTutorLicense" checked={formData.hasPrivateTutorLicense}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-primaryColor focus:ring-primaryColor border-gray-300 rounded"
                                disabled={isReadOnly} />
                              <label className="text-sm font-medium text-gray-600">I have a private tutor license</label>
                            </div>
                            {formData.hasPrivateTutorLicense && (
                              <div className="flex items-center gap-3">
                                <input type="file" accept="image/*" onChange={handleLicenseImageChange}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primaryColor file:text-white hover:file:bg-primaryColor/90"
                                  disabled={isReadOnly} />
                                {licensePreview && (
                                  <div className="relative w-16 h-16 shrink-0">
                                    <Image src={licensePreview} alt="License Preview" fill className="object-cover rounded-md" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Section 3: Availability */}
                      {idx === 3 && (
                        <>
                          {errors.availability && (
                            <p className={errorTextClass}>{errors.availability}</p>
                          )}
                          {formData.availability.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No availability slots added yet.</p>
                          )}
                          {formData.availability.map((slot, index) => {
                            const slotErr = errors.slots?.[index] || {};
                            return (
                              <div key={index} className="grid grid-cols-4 gap-2 items-end">
                                <div>
                                  <label className={labelClass}>Day</label>
                                  <select value={slot.days} onChange={(e) => handleAvailabilityChange(index, "days", e.target.value)}
                                    className={`${inputClass} ${slotErr.days ? inputErrorClass : inputNormalClass}`}
                                    required disabled={isReadOnly}>
                                    <option value="">Select</option>
                                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                  <FieldError error={slotErr.days} />
                                </div>
                                <div>
                                  <label className={labelClass}>Start</label>
                                  <input type="time" value={slot.startTime} onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)}
                                    className={`${inputClass} ${slotErr.startTime ? inputErrorClass : inputNormalClass}`}
                                    required disabled={isReadOnly} />
                                  <FieldError error={slotErr.startTime} />
                                </div>
                                <div>
                                  <label className={labelClass}>End</label>
                                  <input type="time" value={slot.endTime} onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)}
                                    className={`${inputClass} ${slotErr.endTime ? inputErrorClass : inputNormalClass}`}
                                    required disabled={isReadOnly} />
                                  <FieldError error={slotErr.endTime} />
                                </div>
                                <button type="button" onClick={() => removeAvailabilitySlot(index)}
                                  className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                                  disabled={isReadOnly}>Remove</button>
                              </div>
                            );
                          })}
                          <button type="button" onClick={addAvailabilitySlot}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
                            disabled={isReadOnly}>+ Add Time Slot</button>
                        </>
                      )}

                      <div className="flex justify-between pt-2">
                        <button type="button" onClick={goToPrev}
                          className={`px-5 py-2 border border-primaryColor text-primaryColor rounded text-sm font-medium hover:bg-primaryColor hover:text-white transition ${expandedSection === 0 ? "invisible" : ""}`}>
                          Previous
                        </button>
                        {idx < sections.length - 1 ? (
                          <button type="button" onClick={goToNext}
                            className="px-5 py-2 bg-primaryColor text-white rounded text-sm font-medium hover:bg-opacity-90 transition">
                            Next
                          </button>
                        ) : (
                          <button type="submit" disabled={isSubmitting || isReadOnly}
                            className="px-5 py-2 bg-primaryColor text-white rounded text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50">
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </form>
        </div>

        <GoogleMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onLocationSelect={handleLocationSelect}
          initialLocation={formData.location.mapLocation[0]}
        />
      </div>
    </div>
  );
};

export default TutorRegistrationPage;
