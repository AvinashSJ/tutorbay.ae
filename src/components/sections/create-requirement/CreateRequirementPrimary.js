'use client';
import GoogleMapModal from "@/components/shared/gmapsPopup";
import { useCreateRequirementMutation } from "@/redux/services/parentSlice";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { subjects, curriculums, grades } from "@/data/commonData";

const initialState = {
  emirateId: "",
  status: "open"
};

const steps = [
  "Basic Information",
  "Location Details",
  "Teaching Preferences",
  "Fee & Notes",
];

const CreateRequirementForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createRequirement, { isLoading }] = useCreateRequirementMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = ({ lat, lng, mapUrl }) => {
    setFormData(prev => ({
      ...prev,
      currentLocationURL: mapUrl,
      lat: lat.toString(),
      lng: lng.toString()
    }));
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return formData.subject && formData.curriculum && formData.grade;
      case 1:
        return formData.emirateId && formData.currentLocationURL;
      case 2:
        return formData.modeOfTeaching;
      case 3:
        return formData.expectedFee !== "";
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFormKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateStep()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createRequirement({
        ...formData,
        expectedFee: parseFloat(formData.expectedFee) || 0
      }).unwrap();
      
      toast.success("Requirement created successfully!");
      setFormData(initialState);
      setActiveStep(0);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create requirement");
      console.error(err);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">Subject</label>
              <select
                name="subject"
                onChange={handleChange}
                value={formData.subject}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Curriculum</label>
              <select
                name="curriculum"
                onChange={handleChange}
                value={formData.curriculum}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value="">Select Curriculum</option>
                {curriculums.map((curriculum) => (
                  <option key={curriculum} value={curriculum}>
                    {curriculum}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Grade</label>
              <select
                name="grade"
                onChange={handleChange}
                value={formData.grade}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">Emirates ID</label>
              <input
                name="emirateId"
                placeholder="Enter Emirates ID"
                onChange={handleChange}
                value={formData.emirateId}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">City</label>
              <input
                name="city"
                placeholder="Enter City"
                onChange={handleChange}
                value={formData.city}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Area</label>
              <input
                name="area"
                placeholder="Enter Area"
                onChange={handleChange}
                value={formData.area}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Location</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  placeholder="Click to select location on map"
                  value={formData.currentLocationURL}
                  onClick={() => setIsModalOpen(true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor cursor-pointer bg-white"
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primaryColor"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </button>
              </div>
              {formData.currentLocationURL && (
                <p className="mt-2 text-sm text-green-600">
                  Location selected successfully
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">
                Mode of Teaching
              </label>
              <select
                name="modeOfTeaching"
                onChange={handleChange}
                value={formData.modeOfTeaching}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              >
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">Expected Fee</label>
              <input
                name="expectedFee"
                type="number"
                placeholder="Enter expected fee"
                onChange={handleChange}
                value={formData.expectedFee}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                placeholder="Enter any additional notes"
                onChange={handleChange}
                value={formData.additionalNotes}
                rows="4"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Create Requirement</h2>

        <div className="relative mb-10">
          {/* Horizontal Line Background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 z-0" />

          {/* Filled Progress Line */}
          <div
            className="absolute top-5 left-0 h-1 bg-primaryColor z-10 transition-all duration-300"
            style={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="flex justify-between items-center relative z-20">
            {steps.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center w-full text-center"
                >
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isCompleted
                        ? "bg-primaryColor text-white"
                        : isActive
                        ? "border-2 border-primaryColor text-primaryColor bg-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-2 text-xs ${
                      isCompleted || isActive
                        ? "text-primaryColor font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className={`px-4 py-2 border border-primaryColor text-primaryColor rounded ${
                activeStep === 0 ? "invisible" : ""
              }`}
            >
              Back
            </button>
            {activeStep === steps.length - 1 ? (
              <button
                type="submit" // Keep this as submit for the last step
                className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Submit"}
              </button>
            
            ) : (
              <button
                type="button" // Ensure this is a button to prevent auto-submit
                onClick={handleNext}
                className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-opacity-90"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>

      <GoogleMapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default CreateRequirementForm;
