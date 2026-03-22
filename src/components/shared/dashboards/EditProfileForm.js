import React, { useState, useEffect } from "react";
import { useUpdateUserDetailsMutation } from "@/redux/services/userSlice";
import { useUser } from "@/hooks/useUser";
import { subjects, curriculums, grades } from "@/data/commonData";
import toast from "react-hot-toast";
import GoogleMapModal from "../gmapsPopup";

const EditProfileForm = ({ isOpen, onClose, userData, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { userId } = useUser();
  const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userType: "",
    status: "active",
    curriculum: "",
    subject: "",
    emirateId: "",
    grade: "",
    city: "",
    currentLocationURL: "",
    mapLocation: [{ lat: "", lng: "" }],
  });

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        userType: userData.userType || "",
        status: userData.status || "active",
        curriculum: userData.parentStudentProfile?.curriculum || "",
        subject: userData.parentStudentProfile?.subject || "",
        emirateId: userData?.parentStudentProfile?.emirateId || "",
        grade: userData.parentStudentProfile?.grade || "",
        city: userData.parentStudentProfile?.city || "",
        currentLocationURL:
          userData?.parentStudentProfile?.location?.currentLocationURL || "",
        mapLocation: userData?.parentStudentProfile?.location?.mapLocation || [
          { lat: "", lng: "" },
        ],
      });
    }
  }, [userData]);

  const handleLocationSelect = ({ lat, lng, mapUrl }) => {
    setFormData((prev) => ({
      ...prev,
      currentLocationURL: mapUrl,
      mapLocation: [{ lat, lng }],
    }));
    setIsMapModalOpen(false);
  };

  const steps = [
    {
      title: "Personal Information",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true,
        },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        {
          name: "emirateId",
          label: "Emirates ID",
          type: "text",
          required: true,
        },
      ],
    },
    {
      title: "Education Details",
      fields: [
        {
          name: "curriculum",
          label: "Curriculum",
          type: "select",
          options: curriculums,
          required: true,
        },
        {
          name: "subject",
          label: "Subject",
          type: "select",
          options: subjects,
          required: true,
        },
        {
          name: "grade",
          label: "Grade",
          type: "select",
          options: grades.map((grade) => grade.value),
          required: true,
        },
      ],
    },
    {
      title: "Location",
      fields: [
        { name: "city", label: "City", type: "text", required: true },
        {
          name: "location",
          label: "Location",
          type: "map",
          required: true,
        },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (stepIndex) => {
    const currentStepFields = steps[stepIndex].fields;
    const requiredFields = currentStepFields.filter((field) => field.required);

    for (const field of requiredFields) {
      if (field.type === "map") {
        if (!formData.currentLocationURL || !formData.mapLocation[0].lat) {
          toast.error("Please select a location on the map");
          return false;
        }
      } else if (!formData[field.name]) {
        toast.error(`Please fill in ${field.label}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (activeStep < steps.length - 1 || !validateStep(activeStep) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userType: formData.userType,
        status: formData.status,
        curriculum: formData.curriculum,
        subject: formData.subject,
        emirateId: formData.emirateId,
        grade: formData.grade,
        city: formData.city,
        currentLocationURL: formData.currentLocationURL,
        mapLocation: formData.mapLocation,
      };

      await updateUserDetails({
        userId,
        data: payload,
      }).unwrap();
      toast.success("Profile updated successfully");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                index <= activeStep ? "text-primaryColor" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  index <= activeStep
                    ? "bg-primaryColor text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-sm mt-2">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Current Step Fields */}
        <form onSubmit={handleSubmit}>
          {/* Current Step Fields */}
          <div className="space-y-4">
            {steps[activeStep].fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {field.name === "grade" ? `Year ${option}` : option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "map" ? (
                  <div>
                    <input
                      type="text"
                      value={formData.currentLocationURL}
                      readOnly
                      className="w-full p-2 border rounded mb-2"
                      placeholder="Select location on map"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="w-full p-2 bg-primaryColor text-white rounded"
                    >
                      Select Location on Map
                    </button>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={activeStep === 0 || isSubmitting}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-4 py-2 bg-primaryColor text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primaryColor text-white rounded disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <GoogleMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default EditProfileForm;
