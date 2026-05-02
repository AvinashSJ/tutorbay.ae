import {
  useRegisterUserMutation,
} from "@/redux/services/apiSlice";
import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import GoogleMapModal from "../gmapsPopup";
import UserTypeModal from "./UserTypeModal";
import { useRouter } from "next/navigation";
import {
  subjects,
  curriculums,
  grades,
  daysOfWeek,
  timeSlots,
} from "@/data/commonData";

const Register = ({ onRegistrationSuccess }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [registerUser, { isLoading, isError, isSuccess, error }] =
    useRegisterUserMutation();
  const [loginWithGoogle] = [() => {}]; // Google OAuth to be wired separately
  const verifyEmail = async () => {}; // Email OTP removed — Supabase handles confirmation
  const verifyOTP = async () => {};
  const [userType, setUserType] = useState("tutor");
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
  const [licenseFile, setLicenseFile] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true); // TEMP: bypassed for testing
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [isGoogleOTPVerification, setIsGoogleOTPVerification] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    emirateId: "",
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
    subjects: [],
    grades: [],
    // parent-specific
    curriculum: "",
    subject: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          toast.error("File size should be less than 5MB");
          return;
        }
        if (
          !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
        ) {
          toast.error("Only PDF, JPEG, and PNG files are allowed");
          return;
        }
        setLicenseFile(file);
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEmailVerification = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in your name and email first");
      return;
    }

    try {
      const result = await verifyEmail({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }).unwrap();

      console.log("Email verification result:", result); // Debug log

      if (result.status === "success") {
        console.log("Setting showOTPInput to true"); // Debug log
        setShowOTPInput(true);
        toast.success("OTP sent to your email");

        // Force a re-render by updating state
        setOtp(["", "", "", "", "", ""]);

        // Focus the first OTP input after a short delay
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0].focus();
          }
        }, 100);
      }
    } catch (error) {
      console.error("Email verification error:", error); // Debug log
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const result = await verifyOTP({
        email: formData.email,
        otp: parseInt(otpString),
      }).unwrap();

      if (result.status === "success") {
        setIsEmailVerified(true);
        toast.success("Email verified successfully");
        setShowOTPInput(false);
        setIsGoogleOTPVerification(false);
        
        // If this was a Google signup, complete the registration flow
        if (formData.registrationMethod === "google" && googleCredential) {
          await completeGoogleRegistration();
        } else if (formData.registrationMethod === "google" && !googleCredential) {
          toast.error("Google credential expired. Please try signing up again.");
          setIsGoogleOTPVerification(false);
          setFormData(prev => ({
            ...prev,
            registrationMethod: "manual"
          }));
        }
      }
    } catch (error) {
      console.log(error?.data?.message, "error");
      toast.error(error?.data?.message || "Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submission started");
    console.log("Form data:", formData);
    console.log("User type:", userType);
    console.log("Is email verified:", isEmailVerified);

    if (!isEmailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    // Create a normal object instead of FormData
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      emirateId: formData.emirateId,
      userType: userType,
      // Add any other required fields here
    };
    
    console.log("Created payload:", payload);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'password', 'emirateId'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    try {
      console.log("Submitting registration with payload:", payload);
      const res = await registerUser({
        email: payload.email,
        password: payload.password,
        fullName: `${payload.firstName} ${payload.lastName}`,
        phone: payload.phone,
        role: userType === "tutor" ? "TUTOR" : "PARENT",
      }).unwrap();
      console.log("Registration successful:", res);
      toast.success("Registration successful! Please login to continue.");

      // Store user data if available
      if (res.data && res.data.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          if (res.data.sessionDetails && res.data.sessionDetails.accessToken) {
            localStorage.setItem("token", res.data.sessionDetails.accessToken);
          }
        }
      }

      // Show registration success toast
      toast.success("Registration successful! Please login to continue.");
      
      // Switch to login tab after a short delay to ensure toast is visible
      console.log("Registration successful, switching to login tab");
      
      setTimeout(() => {
        if (onRegistrationSuccess) {
          console.log("Calling onRegistrationSuccess callback to switch to login tab");
          onRegistrationSuccess();
        } else {
          console.log("No callback provided, using fallback navigation");
          // Fallback: try to navigate to login page
          try {
            window.location.href = "/login";
          } catch (fallbackError) {
            console.error("Fallback navigation failed:", fallbackError);
            toast.error("Registration successful but tab switch failed. Please switch to login tab manually.");
          }
        }
      }, 1500); // Wait 1.5 seconds for toast to be visible

      // Reset form immediately since we're redirecting
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        emirateId: "",
      });

      setLicenseFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setUserType("tutor");
      // Keep OTP bypass active for repeated test registrations in the same session.
      setIsEmailVerified(true);
      setShowOTPInput(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error(err?.data || err?.message || "Registration failed");
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleCredential(credentialResponse);
    setIsUserTypeModalOpen(true);
  };

  const completeGoogleRegistration = async () => {
    try {
      // Call the Google login API again to complete the registration
      const clientId = "632857447223-m528ca3fhri1t7gro9uien1rumtlk93c.apps.googleusercontent.com";
      
      const result = await loginWithGoogle({
        token: googleCredential.credential,
        clientId,
        select_by: "btn",
        userType: formData.userType,
        otpVerified: true, // Indicate that OTP has been verified
      }).unwrap();

      // Store user data and token
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.data.sessionDetails.accessToken);
        localStorage.setItem("user", JSON.stringify(result.data.user));
      }

      toast.success("Registration completed successfully!");

      // Redirect based on user type
      if (formData.userType === "tutor") {
        router.push("/instructor-profile");
      } else {
        router.push("/parent-profile");
      }

      // Clean up
      setGoogleCredential(null);
      setIsGoogleOTPVerification(false);
      setFormData(prev => ({
        ...prev,
        registrationMethod: "manual"
      }));
    } catch (error) {
      toast.error("Failed to complete registration");
      console.error("Google registration completion error:", error);
    }
  };

  const handleUserTypeSelect = async (selectedType) => {
    const clientId =
      "632857447223-m528ca3fhri1t7gro9uien1rumtlk93c.apps.googleusercontent.com";

    try {
      const result = await loginWithGoogle({
        token: googleCredential.credential,
        clientId,
        select_by: "btn",
        userType: selectedType,
      }).unwrap();

      // Check if the response indicates OTP verification is required
      if (result.status === "success" && result.message && result.message.includes("OTP")) {
        // Store the Google credential and user type for later use
        setFormData(prev => ({
          ...prev,
          email: result.data.email || "",
          userType: selectedType,
          registrationMethod: "google"
        }));
        
        // Show OTP input for verification
        setShowOTPInput(true);
        setIsGoogleOTPVerification(true);
        toast.success("OTP sent to your email. Please verify to complete registration.");
        
        // Close the user type modal but keep Google credential
        setIsUserTypeModalOpen(false);
        return;
      }

      // If OTP verification is not required, proceed with normal flow
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.data.sessionDetails.accessToken);
        localStorage.setItem("user", JSON.stringify(result.data.user));
      }

      toast.success("Registration successful");
console.log(selectedType, "selectedType");

      // Redirect based on user type
      if (selectedType === "tutor") {
console.log(selectedType, "1");

        router.push("/instructor-profile");
      } else {
        console.log(selectedType, "2");

        router.push("/parent-profile");
      }
    } catch (error) {
      toast.error("Registration failed");
      console.error("Google registration error:", error);
      setIsUserTypeModalOpen(false);
      setGoogleCredential(null);
    }
  };

  // Add a debug effect to monitor state changes
  React.useEffect(() => {
    console.log("showOTPInput changed:", showOTPInput);
  }, [showOTPInput]);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center mb-6">
        {["tutor", "parent"].map((type) => (
          <button
            key={type}
            onClick={() => {
              console.log("Setting user type to:", type);
              setUserType(type);
            }}
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
          <div className="md:col-span-2">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Message below the input */}
              <p className="text-sm text-gray-400"></p>
            </div>

            {/* OTP Input Section - Added key prop to force re-render */}
            {showOTPInput && !isEmailVerified && (
              <div
                key="otp-input"
                className={`mt-4 p-4 border rounded-lg ${
                  isGoogleOTPVerification ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className="text-center mb-4">
                  {isGoogleOTPVerification && (
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                      Google Registration
                    </div>
                  )}
                  <p className="text-gray-600">
                    {formData.registrationMethod === "google" 
                      ? "Enter the 6-digit OTP sent to your email to complete Google registration"
                      : "Enter the 6-digit OTP sent to your email"
                    }
                  </p>
                </div>
                <div className="flex justify-center gap-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={`otp-${index}`}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl border rounded focus:border-primaryColor focus:outline-none"
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="px-6 py-2 bg-primaryColor text-white rounded hover:bg-opacity-90"
                  >
                    Verify OTP
                  </button>
                  {isGoogleOTPVerification && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsGoogleOTPVerification(false);
                        setShowOTPInput(false);
                        setGoogleCredential(null);
                        setFormData(prev => ({
                          ...prev,
                          registrationMethod: "manual"
                        }));
                        toast.info("Google registration cancelled. You can try again.");
                      }}
                      className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-opacity-90"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
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
            name="emirateId"
            placeholder="Emirates ID"
            onChange={handleChange}
            value={formData.emirateId}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className={`w-full mt-6 py-2 px-6 rounded text-white ${
            isEmailVerified
              ? "bg-primaryColor hover:bg-opacity-90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isEmailVerified || isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {/* Google sign-up to be wired separately */}
      </form>

      <GoogleMapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />

      <UserTypeModal
        isOpen={isUserTypeModalOpen}
        onClose={() => setIsUserTypeModalOpen(false)}
        onSelect={handleUserTypeSelect}
      />
    </div>
  );
};

export default Register;
