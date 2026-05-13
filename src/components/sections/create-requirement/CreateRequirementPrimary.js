'use client';
import GoogleMapModal from "@/components/shared/gmapsPopup";
import { useCreateRequirementMutation, useUpdateRequirementMutation } from "@/redux/services/parentSlice";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { subjects, curriculums, grades } from "@/data/commonData";

const initialState = {
  emirateId: "",
  expectedFee: "",
  status: "open"
};

const sections = [
  { title: "Basic Information", key: "basic" },
  { title: "Location Details", key: "location" },
  { title: "Teaching Preferences", key: "teaching" },
  { title: "Fee & Notes", key: "fee" },
];

const sectionComplete = (formData, idx) => {
  switch (idx) {
    case 0: return !!(formData.subject && formData.curriculum && formData.grade);
    case 1: return !!(formData.emirateId && formData.currentLocationURL);
    case 2: return !!formData.modeOfTeaching;
    case 3: return formData.expectedFee !== "";
    default: return false;
  }
};

const allSectionsComplete = (formData) =>
  sections.every((_, i) => sectionComplete(formData, i));

const ChevronIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CreateRequirementForm = ({ initialData, onSuccess }) => {
  const isEditing = !!initialData;

  const getInitialFormData = () => {
    if (initialData) {
      return {
        subject: initialData.subject || "",
        curriculum: initialData.curriculum || "",
        grade: initialData.grade || "",
        emirateId: initialData.emirateId || "",
        city: initialData.city || "",
        area: initialData.area || "",
        currentLocationURL: initialData.currentLocationURL || "",
        lat: initialData.lat || "",
        lng: initialData.lng || "",
        modeOfTeaching: initialData.modeOfTeaching || "",
        expectedFee: initialData.expectedFee ?? "",
        additionalNotes: initialData.additionalNotes || "",
        notes: initialData.notes || "",
        status: initialData.status || "open",
      };
    }
    return initialState;
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [expandedSection, setExpandedSection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createRequirement, { isLoading: isCreating }] = useCreateRequirementMutation();
  const [updateRequirement, { isLoading: isUpdating }] = useUpdateRequirementMutation();
  const isLoading = isCreating || isUpdating;

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

  const toggleSection = (idx) => {
    setExpandedSection((prev) => (prev === idx ? null : idx));
  };

  const goToNext = () => {
    setExpandedSection((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const goToPrev = () => {
    setExpandedSection((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allSectionsComplete(formData)) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isEditing) {
        await updateRequirement({
          id: initialData.id,
          ...formData,
          expectedFee: parseFloat(formData.expectedFee) || 0,
        }).unwrap();
        toast.success("Requirement updated successfully!");
      } else {
        await createRequirement({
          ...formData,
          expectedFee: parseFloat(formData.expectedFee) || 0,
        }).unwrap();
        toast.success("Requirement created successfully!");
        setFormData(initialState);
      }
      setExpandedSection(0);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.data?.message || `Failed to ${isEditing ? "update" : "create"} requirement`);
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    if (onSuccess) onSuccess();
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          {isEditing ? "Edit Requirement" : "Create Requirement"}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="text-sm text-gray-500 hover:text-red-500 transition"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {sections.map((section, idx) => {
          const isOpen = expandedSection === idx;
          const complete = sectionComplete(formData, idx);

          return (
            <div key={idx} className="border border-borderColor dark:border-borderColor-dark rounded-lg mb-3 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(idx)}
                className="w-full flex items-center justify-between px-5 py-4 bg-[#F8FAFC] hover:bg-gray-100 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${complete ? "bg-green-500 text-white" : "bg-primaryColor text-white"}`}>
                    {complete ? <CheckIcon /> : idx + 1}
                  </span>
                  <span className="font-semibold text-gray-800">{section.title}</span>
                </div>
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <div className="px-5 py-4 border-t border-borderColor dark:border-borderColor-dark space-y-4">
                  {idx === 0 && (
                    <>
                      <div>
                        <label className={labelClass}>Subject</label>
                        <select name="subject" onChange={handleChange} value={formData.subject} className={inputClass}>
                          <option value="">Select Subject</option>
                          {subjects.map((subject) => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Curriculum</label>
                        <select name="curriculum" onChange={handleChange} value={formData.curriculum} className={inputClass}>
                          <option value="">Select Curriculum</option>
                          {curriculums.map((curriculum) => (
                            <option key={curriculum} value={curriculum}>{curriculum}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Grade</label>
                        <select name="grade" onChange={handleChange} value={formData.grade} className={inputClass}>
                          <option value="">Select Grade</option>
                          {grades.map((grade) => (
                            <option key={grade.value} value={grade.value}>{grade.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {idx === 1 && (
                    <>
                      <div>
                        <label className={labelClass}>Emirates ID</label>
                        <input name="emirateId" placeholder="Enter Emirates ID" onChange={handleChange} value={formData.emirateId} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>City</label>
                        <input name="city" placeholder="Enter City" onChange={handleChange} value={formData.city} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Area</label>
                        <input name="area" placeholder="Enter Area" onChange={handleChange} value={formData.area} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <div className="relative">
                          <input type="text" readOnly placeholder="Click to select location on map" value={formData.currentLocationURL} onClick={() => setIsModalOpen(true)} className={`${inputClass} cursor-pointer bg-white`} />
                          <button type="button" onClick={() => setIsModalOpen(true)} className="absolute right-2 top-1/2 -translate-y-1/2 text-primaryColor">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                          </button>
                        </div>
                        {formData.currentLocationURL && (
                          <p className="mt-2 text-sm text-green-600">Location selected successfully</p>
                        )}
                      </div>
                    </>
                  )}

                  {idx === 2 && (
                    <div>
                      <label className={labelClass}>Mode of Teaching</label>
                      <select name="modeOfTeaching" onChange={handleChange} value={formData.modeOfTeaching} className={inputClass}>
                        <option value="">Select Mode</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  )}

                  {idx === 3 && (
                    <>
                      <div>
                        <label className={labelClass}>Expected Fee</label>
                        <input name="expectedFee" type="number" placeholder="Enter expected fee" onChange={handleChange} value={formData.expectedFee} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Additional Notes</label>
                        <textarea name="additionalNotes" placeholder="Enter any additional notes" onChange={handleChange} value={formData.additionalNotes} rows="4" className={inputClass} />
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={goToPrev}
                      className={`px-5 py-2 border border-primaryColor text-primaryColor rounded text-sm font-medium hover:bg-primaryColor hover:text-white transition ${expandedSection === 0 ? "invisible" : ""}`}
                    >
                      Previous
                    </button>
                    {idx < sections.length - 1 ? (
                      <button
                        type="button"
                        onClick={goToNext}
                        className="px-5 py-2 bg-primaryColor text-white rounded text-sm font-medium hover:bg-opacity-90 transition"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-5 py-2 bg-primaryColor text-white rounded text-sm font-medium hover:bg-opacity-90 transition disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : isEditing ? "Update" : "Submit"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </form>

      <GoogleMapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default CreateRequirementForm;
