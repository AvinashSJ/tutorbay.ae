"use client";
import React, { useState } from "react";
import { useUpdateTutorProfileMutation } from "@/redux/services/userSlice";
import { toast } from "react-hot-toast";
import GoogleMapModal from "../gmapsPopup";
import Image from "next/image";

// Helper function to convert 12-hour time to 24-hour format
const convertTo24Hour = (time12h) => {
  if (!time12h) return "";
  try {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);

    if (hours === 12) {
      hours = modifier === "AM" ? 0 : 12;
    } else if (modifier === "PM") {
      hours += 12;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  } catch (error) {
    console.error("Error converting time:", error);
    return "";
  }
};

// Helper function to convert 24-hour time to 12-hour format
const convertTo12Hour = (time24h) => {
  if (!time24h) return "";
  try {
    const [hours, minutes] = time24h.split(":");
    const hour = parseInt(hours, 10);
    const modifier = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${modifier}`;
  } catch (error) {
    console.error("Error converting time:", error);
    return "";
  }
};

const EditTutorProfileForm = ({ isOpen, onClose, userData, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [updateTutorProfile] = useUpdateTutorProfileMutation();
  const [licenseImage, setLicenseImage] = useState(null);
  const [licensePreview, setLicensePreview] = useState(
    userData?.tutorProfile?.licenseDocumentUrl || ""
  );

  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    phone: userData?.phone || "",
    nationality: userData?.tutorProfile?.nationality || "",
    highestQualification: userData?.tutorProfile?.highestQualification || "",
    modeOfTeaching: userData?.tutorProfile?.modeOfTeaching || "Online",
    expectedFeePerHour: userData?.tutorProfile?.expectedFeePerHour || "",
    hasPrivateTutorLicense:
      userData?.tutorProfile?.hasPrivateTutorLicense || false,
    emirateId: userData?.tutorProfile?.emirateId || "",
    availability:
      userData?.tutorProfile?.availability?.map((slot) => ({
        ...slot,
        startTime: convertTo24Hour(slot.startTime),
        endTime: convertTo24Hour(slot.endTime),
      })) || [],
    location: userData?.tutorProfile?.location || {
      currentLocationURL: "",
      mapLocation: [],
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      availability: newAvailability,
    }));
  };

  const addAvailabilitySlot = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        { days: "", startTime: "", endTime: "" },
      ],
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
        mapLocation: [
          {
            lat: location.lat,
            lng: location.lng,
          },
        ],
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
      // Prepare the data in the expected format
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: "tutor",
        status: "active",
        registrationMethod: "manual",
        highestQualification: formData.highestQualification,
        nationality: formData.nationality,
        emirateId: formData.emirateId,
        city: "dubai", // You might want to make this dynamic
        currentLocationURL: formData.location.currentLocationURL,
        mapLocation: formData.location.mapLocation,
        hasPrivateTutorLicense: formData.hasPrivateTutorLicense,
        licenseDocumentUrl: formData.licenseDocumentUrl || "",
        modeOfTeaching: formData.modeOfTeaching.toLowerCase(),
        availability: formData.availability.map((slot) => ({
          days: slot.days,
          startTime: convertTo12Hour(slot.startTime),
          endTime: convertTo12Hour(slot.endTime),
        })),
        expectedFeePerHour: parseInt(formData.expectedFeePerHour),
      };

      const response = await updateTutorProfile({
        userId: userData._id,
        ...payload,
      }).unwrap();

      toast.success("Profile updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-whiteColor-dark rounded-lg p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 text-center ${
                step < currentStep
                  ? "text-primaryColor"
                  : step === currentStep
                  ? "text-primaryColor font-bold"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  step <= currentStep
                    ? "bg-primaryColor text-white"
                    : "bg-gray-200"
                }`}
              >
                {step}
              </div>
              {step === 1
                ? "Personal Info"
                : step === 2
                ? "Teaching Details"
                : step === 3
                ? "Location & License"
                : "Availability"}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emirates ID
                </label>
                <input
                  type="text"
                  name="emirateId"
                  value={formData.emirateId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mode of Teaching
                </label>
                <select
                  name="modeOfTeaching"
                  value={formData.modeOfTeaching}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                  required
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expected Fee per Hour ($)
                </label>
                <input
                  type="number"
                  name="expectedFeePerHour"
                  value={formData.expectedFeePerHour}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-base"
                  >
                    {formData.location.currentLocationURL
                      ? "Change Location"
                      : "Set Location"}
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
                  />
                  <label className="ml-2 block text-base text-gray-700 dark:text-gray-300">
                    I have a private tutor license
                  </label>
                </div>
                {formData.hasPrivateTutorLicense && (
                  <div className="mt-3">
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      License Document
                    </label>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLicenseImageChange}
                        className="block w-full text-base text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-base file:font-semibold file:bg-primaryColor file:text-white hover:file:bg-primaryColor/90"
                      />
                      {licensePreview && (
                        <div className="relative w-16 h-16">
                          <Image
                            src={licensePreview}
                            alt="License Preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              {formData.availability.map((slot, index) => (
                <div
                  key={slot._id || index}
                  className="grid grid-cols-4 gap-4 items-end"
                >
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Day
                    </label>
                    <select
                      value={slot.days}
                      onChange={(e) =>
                        handleAvailabilityChange(index, "days", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                      required
                    >
                      <option value="">Select Day</option>
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          index,
                          "startTime",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          index,
                          "endTime",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor text-base p-2"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAvailabilitySlot(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-base"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAvailabilitySlot}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-base"
              >
                Add Time Slot
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-base"
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 text-base ml-auto"
                disabled={isSubmitting}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90 text-base ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
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
  );
};

export default EditTutorProfileForm;
