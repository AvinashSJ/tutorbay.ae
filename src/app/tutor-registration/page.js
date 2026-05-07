"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetUserQuery, useSubmitTutorApplicationMutation, useGetTutorApplicationStatusQuery } from "@/redux/services/userSlice";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import GoogleMapModal from "@/components/shared/gmapsPopup";
import Image from "next/image";
import { TUTOR_APPLICATION_STATUS } from "@/redux/services/userSlice";
import { supabase } from "@/libs/supabase";

const TutorRegistrationPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [submitApplication] = useSubmitTutorApplicationMutation();
  const [licenseImage, setLicenseImage] = useState(null);
  const [licensePreview, setLicensePreview] = useState("");

  const { data: userData, isLoading: userLoading } = useGetUserQuery(user?.id, {
    skip: !user?.id,
  });

  const { data: appStatus } = useGetTutorApplicationStatusQuery(user?.id, {
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

  useEffect(() => {
    if (appStatus?.applicationStatus === TUTOR_APPLICATION_STATUS.APPROVED) {
      router.push("/instructor-profile");
    }
  }, [appStatus, router]);

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        nationality: userData.tutorProfile?.nationality || "",
        highestQualification: userData.tutorProfile?.highestQualification || "",
        modeOfTeaching: userData.tutorProfile?.modeOfTeaching || "Online",
        expectedFeePerHour: userData.tutorProfile?.expectedFeePerHour || "",
        hasPrivateTutorLicense: userData.tutorProfile?.hasPrivateTutorLicense || false,
        emirateId: userData.tutorProfile?.emirateId || "",
        subjects: userData.tutorProfile?.subjects || [],
        areas: userData.tutorProfile?.areas || [],
        bio: userData.tutorProfile?.bio || "",
        availability: userData.tutorProfile?.availability || [],
        location: userData.tutorProfile?.location || { currentLocationURL: "", mapLocation: [] },
      }));
      setLicensePreview(userData.tutorProfile?.licenseDocumentUrl || "");
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        currentLocationURL: location.url,
        mapLocation: [{ lat: location.lat, lng: location.lng }],
      },
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        expectedFeePerHour: parseInt(formData.expectedFeePerHour),
      };

      const response = await submitApplication({
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

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  const status = appStatus?.applicationStatus;
  const isReadOnly = status === TUTOR_APPLICATION_STATUS.PENDING_REVIEW ||
                     status === TUTOR_APPLICATION_STATUS.APPROVED;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-center mb-2">Tutor Registration</h1>
          <p className="text-gray-600 text-center mb-8">
            Complete your profile to apply as a tutor
          </p>

          {status === TUTOR_APPLICATION_STATUS.PENDING_REVIEW && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 font-medium">Your application is under review</p>
              <p className="text-yellow-700 text-sm mt-1">
                Admin will review your application and get back to you soon.
              </p>
            </div>
          )}

          {status === TUTOR_APPLICATION_STATUS.ADDITIONAL_INFO_REQUIRED && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-orange-800 font-medium">Additional information required</p>
              <p className="text-orange-700 text-sm mt-1">
                Admin notes: {appStatus.adminNotes}
              </p>
            </div>
          )}

          {status === TUTOR_APPLICATION_STATUS.REJECTED && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">Application Rejected</p>
              <p className="text-red-700 text-sm mt-1">
                Reason: {appStatus.adminNotes}
              </p>
            </div>
          )}

          {/* Stepper */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 text-center ${
                  step < currentStep ? "text-primaryColor" : step === currentStep ? "text-primaryColor font-bold" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    step <= currentStep ? "bg-primaryColor text-white" : "bg-gray-200"
                  }`}
                >
                  {step}
                </div>
                {step === 1 ? "Personal Info" : step === 2 ? "Teaching Details" : step === 3 ? "Location & License" : "Availability"}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Emirates ID</label>
                  <input
                    type="text"
                    name="emirateId"
                    value={formData.emirateId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Teaching Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Mode of Teaching</label>
                  <select
                    name="modeOfTeaching"
                    value={formData.modeOfTeaching}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Expected Fee per Hour ($)</label>
                  <input
                    type="number"
                    name="expectedFeePerHour"
                    value={formData.expectedFeePerHour}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Subjects (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.subjects.join(", ")}
                    onChange={(e) => handleArrayInputChange("subjects", e.target.value)}
                    placeholder="Math, Physics, Chemistry"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Areas (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.areas.join(", ")}
                    onChange={(e) => handleArrayInputChange("areas", e.target.value)}
                    placeholder="Dubai Marina, JBR, Downtown"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Location & License */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">Location</label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-base"
                      disabled={isReadOnly}
                    >
                      {formData.location.currentLocationURL ? "Change Location" : "Set Location"}
                    </button>
                    {formData.location.currentLocationURL && (
                      <a
                        href={formData.location.currentLocationURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primaryColor hover:underline text-base"
                      >
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      name="hasPrivateTutorLicense"
                      checked={formData.hasPrivateTutorLicense}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primaryColor focus:ring-primaryColor border-gray-300 rounded"
                      disabled={isReadOnly}
                    />
                    <label className="ml-2 block text-base text-gray-700">I have a private tutor license</label>
                  </div>
                  {formData.hasPrivateTutorLicense && (
                    <div className="mt-3">
                      <label className="block text-base font-medium text-gray-700 mb-1">License Document</label>
                      <div className="mt-1 flex items-center space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLicenseImageChange}
                          className="block w-full text-base text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-base file:font-semibold file:bg-primaryColor file:text-white hover:file:bg-primaryColor/90"
                          disabled={isReadOnly}
                        />
                        {licensePreview && (
                          <div className="relative w-16 h-16">
                            <Image src={licensePreview} alt="License Preview" fill className="object-cover rounded-md" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Availability */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {formData.availability.map((slot, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">Day</label>
                      <select
                        value={slot.days}
                        onChange={(e) => handleAvailabilityChange(index, "days", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                        required
                        disabled={isReadOnly}
                      >
                        <option value="">Select Day</option>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                        required
                        disabled={isReadOnly}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAvailabilitySlot(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-base"
                      disabled={isReadOnly}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAvailabilitySlot}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-base"
                  disabled={isReadOnly}
                >
                  Add Time Slot
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-base"
                  disabled={isSubmitting || isReadOnly}
                >
                  Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 text-base ml-auto"
                  disabled={isReadOnly}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 text-base ml-auto"
                  disabled={isSubmitting || isReadOnly}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>

          <GoogleMapModal
            isOpen={isMapModalOpen}
            onClose={() => setIsMapModalOpen(false)}
            onLocationSelect={handleLocationSelect}
            initialLocation={formData.location.mapLocation[0]}
          />
        </div>
      </div>
    </div>
  );
};

export default TutorRegistrationPage;
