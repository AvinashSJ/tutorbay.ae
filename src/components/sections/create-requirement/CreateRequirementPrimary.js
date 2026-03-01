"use client";
import GoogleMapModal from "@/components/shared/gmapsPopup";
import { useCreateRequirementMutation } from "@/redux/services/parentSlice";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const initialState = {
  userId: "681a34e1cc437f53cc435ae7",
  userType: "parent",
  subject: "",
  curriculum: "",
  grade: "",
  emirates: "",
  location: {
    currentLocationURL: "",
    mapLocation: [{ lat: "", lng: "" }],
  },
  modeOfTeaching: "",
  availability: [{ days: "", startTime: "", endTime: "" }],
  expectedFee: "",
  additionalNotes: "",
  status: "open",
};

const CreateRequirementForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [createRequirement, { isLoading, isSuccess, isError, error }] =
    useCreateRequirementMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handleMapCoordsChange = (index, field, value) => {
    const newCoords = [...formData.location.mapLocation];
    newCoords[index][field] = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        mapLocation: newCoords,
      },
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...formData.availability];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, availability: updated }));
  };

  const addAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        { days: "", startTime: "", endTime: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Update formData with selected location values before submitting
    const finalPayload = {
      ...formData,
      location: {
        currentLocationURL: locationData.currentLocationURL,
        mapLocation: [
          {
            lat: parseFloat(locationData.lat),
            lng: parseFloat(locationData.lng),
          },
        ],
      },
      expectedFee: parseFloat(formData.expectedFee),
    };
  
    try {
      await createRequirement(finalPayload).unwrap();
      toast.success("Requirement created successfully!");
      setFormData(initialState);
      setLocationData({ lat: "", lng: "", currentLocationURL: "" });
    } catch (err) {
      toast.error("Failed to create requirement");
      console.error(err);
    }
  };
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationData, setLocationData] = useState({
    lat: "",
    lng: "",
    currentLocationURL: "",
  });

  const handleLocationSelect = ({ lat, lng, mapUrl }) => {
    setLocationData({ lat, lng, currentLocationURL: mapUrl });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Create Requirement</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow rounded"
      >
        <input
          name="subject"
          placeholder="Subject"
          onChange={handleChange}
          value={formData.subject}
          className="w-full p-2 border rounded"
        />
        <input
          name="curriculum"
          placeholder="Curriculum"
          onChange={handleChange}
          value={formData.curriculum}
          className="w-full p-2 border rounded"
        />
        <input
          name="grade"
          placeholder="Grade"
          onChange={handleChange}
          value={formData.grade}
          className="w-full p-2 border rounded"
        />
        <input
          name="emirates"
          placeholder="Emirates"
          onChange={handleChange}
          value={formData.emirates}
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mb-2 p-2 bg-primaryColor text-white rounded"
        >
          Select Location on Map
        </button>

        {/* <input
          name="currentLocationURL"
          placeholder="Google Map URL"
          onChange={handleLocationChange}
          value={formData.location.currentLocationURL}
          className="w-full p-2 border rounded"
        /> */}

        {/* <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Latitude"
            type="number"
            value={formData.location.mapLocation[0].lat}
            onChange={(e) => handleMapCoordsChange(0, "lat", e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            placeholder="Longitude"
            type="number"
            value={formData.location.mapLocation[0].lng}
            onChange={(e) => handleMapCoordsChange(0, "lng", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div> */}

        <select
          name="modeOfTeaching"
          onChange={handleChange}
          value={formData.modeOfTeaching}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Mode of Teaching</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Both</option>
        </select>

        <div>
          <label className="block font-medium mb-1">Availability</label>
          {formData.availability.map((slot, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                placeholder="Day"
                value={slot.days}
                onChange={(e) =>
                  handleAvailabilityChange(index, "days", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                placeholder="Start Time"
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  handleAvailabilityChange(index, "startTime", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                placeholder="End Time"
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  handleAvailabilityChange(index, "endTime", e.target.value)
                }
                className="p-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addAvailability}
            className="mt-1 text-blue-600 underline"
          >
            + Add another slot
          </button>
        </div>

        <input
          name="expectedFee"
          placeholder="Expected Fee"
          type="number"
          onChange={handleChange}
          value={formData.expectedFee}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="additionalNotes"
          placeholder="Additional Notes"
          onChange={handleChange}
          value={formData.additionalNotes}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-primaryColor text-white py-2 px-4 rounded"
        >
          Submit Requirement
        </button>
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
