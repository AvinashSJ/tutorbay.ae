import { useCreateTutorMutation } from "@/redux/services/apiSlice";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import GoogleMapModal from "../gmapsPopup";

const Register = () => {
  const [createTutor, { isLoading, isError, isSuccess, error }] =
    useCreateTutorMutation();
  const [userType, setUserType] = useState("tutor");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    emirates: "",
    currentLocationURL: "",
    mapLocation: [{ lat: "", lng: "" }],
    // tutor-specific
    highestQualification: "",
    hasPrivateTutorLicense: false,
    licenseDocumentUrl: "",
    modeOfTeaching: "",
    availability: [],
    expectedFeePerHour: "",
    registrationMethod: "manual",
    // parent-specific
    curriculum: "",
    subject: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      userType,
      status: "active",
      currentLocationURL: locationData.currentLocationURL,
      mapLocation: {
        lat: parseFloat(locationData.lat),
        lng: parseFloat(locationData.lng),
      },
    };

    try {
      const res = await createTutor(payload).unwrap();
      toast.success(res.message);

      // Clear form after success
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        emirates: "",
        currentLocationURL: "",
        mapLocation: [{ lat: "", lng: "" }],
        highestQualification: "",
        hasPrivateTutorLicense: false,
        licenseDocumentUrl: "",
        modeOfTeaching: "",
        availability: [],
        expectedFeePerHour: "",
        registrationMethod: "manual",
        curriculum: "",
        subject: "",
      });

      setLocationData({
        lat: "",
        lng: "",
        currentLocationURL: "",
      });

      setUserType("tutor"); // Optional: reset user type
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error(err.message);
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
    <div className="max-w-3xl mx-auto py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center mb-6">
        {["tutor", "parent"].map((type) => (
          <button
            key={type}
            onClick={() => setUserType(type)}
            className={`px-6 py-2 border rounded mx-2 ${
              userType === type ? "bg-primaryColor text-white" : "bg-gray-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Common Fields */}
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            value={formData.firstName}
            className="w-full p-2 border rounded"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.lastName}
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            className="w-full p-2 border rounded"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            value={formData.phone}
            className="w-full p-2 border rounded"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full p-2 border rounded"
          />
          <input
            name="emirates"
            placeholder="Emirates"
            onChange={handleChange}
            value={formData.emirates}
            className="w-full p-2 border rounded"
          />
          <input
            name="nationality"
            placeholder="Nationality"
            onChange={handleChange}
            value={formData.nationality}
            className="w-full p-2 border rounded"
          />

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mb-2 p-2 bg-primaryColor text-white rounded"
          >
            Select Location on Map
          </button>

          {/* Tutor-Specific Fields */}
          {userType === "tutor" && (
            <>
              <input
                name="highestQualification"
                placeholder="Qualification"
                onChange={handleChange}
                value={formData.highestQualification}
                className="w-full p-2 border rounded"
              />
              <input
                name="licenseDocumentUrl"
                placeholder="License URL"
                onChange={handleChange}
                value={formData.licenseDocumentUrl}
                className="w-full p-2 border rounded"
              />
              <input
                name="expectedFeePerHour"
                placeholder="Expected Fee Per Hour"
                type="number"
                onChange={handleChange}
                value={formData.expectedFeePerHour}
                className="w-full p-2 border rounded"
              />
              <select
                name="modeOfTeaching"
                onChange={handleChange}
                value={formData.modeOfTeaching}
                className="w-full p-2 border rounded"
              >
                <option value="" hidden>
                  Select Mode of Teaching
                </option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Both</option>
              </select>

              <div className="col-span-1 md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasPrivateTutorLicense"
                    checked={formData.hasPrivateTutorLicense}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Private Tutor License
                </label>
              </div>
            </>
          )}

          {/* Parent-Specific Fields */}
          {userType === "parent" && (
            <>
              <input
                name="curriculum"
                placeholder="Curriculum (British/Indian/Other)"
                onChange={handleChange}
                value={formData.curriculum}
                className="w-full p-2 border rounded"
              />
              <input
                name="subject"
                placeholder="Subject"
                onChange={handleChange}
                value={formData.subject}
                className="w-full p-2 border rounded"
              />
            </>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 bg-primaryColor text-white py-2 px-6 rounded"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        {/* <div className="flex mt-2">
          {isSuccess && (
            <span className="text-green-600">Registration successful!</span>
          )}
          {isError && (
            <span className="text-red-600">Registration failed.</span>
          )}
        </div> */}
      </form>

      <GoogleMapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default Register;
