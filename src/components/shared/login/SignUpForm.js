import {
  useRegisterUserMutation,
} from "@/redux/services/apiSlice";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import UserTypeModal from "./UserTypeModal";
import { useRouter } from "next/navigation";
import { validateSignupForm, formatEmiratesId } from "@/libs/validations";
import { getSupabase } from "@/libs/supabase";

const Register = ({ onRegistrationSuccess }) => {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [userType, setUserType] = useState("tutor");
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    emiratesId: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Special handling for Emirates ID - auto-format with dashes
    if (name === "emiratesId") {
      const cleanValue = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : cleanValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateSignupForm(formData, userType);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    // Create payload
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      emiratesId: formData.emiratesId,
      userType: userType,
    };

    try {
      const res = await registerUser({
        email: payload.email,
        password: payload.password,
        fullName: `${payload.firstName} ${payload.lastName}`,
        phone: payload.phone,
        emiratesId: payload.emiratesId,
        role: userType === "tutor" ? "TUTOR" : "PARENT",
      }).unwrap();

      toast.success("Registration successful! Please login to continue.");

      // Switch to login tab after a short delay
      setTimeout(() => {
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        } else {
          try {
            window.location.href = "/login";
          } catch (fallbackError) {
            toast.error("Registration successful but tab switch failed.");
          }
        }
      }, 1500);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        emiratesId: "",
      });
      setUserType("tutor");
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error(err?.data || err?.message || "Registration failed");
    }
  };

  // Google Signup
  const handleGoogleSignup = () => {
    setIsUserTypeModalOpen(true);
  };

  const handleUserTypeSelect = async (selectedType) => {
    try {
      const role = selectedType === "tutor" ? "TUTOR" : "PARENT";

      if (typeof window !== "undefined") {
        // Set a cookie (most reliable for OAuth redirects)
        document.cookie = `gs_role=${role}; path=/; max-age=300; SameSite=Lax`;
        // Backup to localStorage
        localStorage.setItem("gs_role", role);
        console.log("Google Signup: Setting role to", role);
      }

      setIsUserTypeModalOpen(false);

      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      toast.error("Google sign-up failed. Please try again.");
      console.error("Google signup error:", err);
      setIsUserTypeModalOpen(false);
    }
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
          <div>
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.firstName}
              className={`w-full p-2 border rounded ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.lastName}
              className={`w-full p-2 border rounded ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
          <div className="md:col-span-2">
            <input
              name="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
              value={formData.email}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              name="phone"
              placeholder="Phone (e.g., 0501234567 or +971501234567)"
              onChange={handleChange}
              value={formData.phone}
              className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <input
              name="password"
              placeholder="Password (min 8 chars, upper, lower, number)"
              type="password"
              onChange={handleChange}
              value={formData.password}
              className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <input
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              onChange={handleChange}
              value={formData.confirmPassword}
              className={`w-full p-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div>
            <input
              name="emiratesId"
              placeholder="Emirates ID (784-XXXX-XXXXXXX-X)"
              onChange={handleChange}
              value={formatEmiratesId(formData.emiratesId)}
              maxLength={20}
              className={`w-full p-2 border rounded ${errors.emiratesId ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.emiratesId && <p className="text-red-500 text-xs mt-1">{errors.emiratesId}</p>}
            <p className="text-xs text-gray-500 mt-1">Enter 15 digits (784 followed by 12 digits)</p>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full mt-6 py-2 px-6 rounded text-white ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primaryColor hover:bg-opacity-90"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        {/* Google Sign-Up */}
        <div className="mt-4">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
        </div>
      </form>

      <UserTypeModal
        isOpen={isUserTypeModalOpen}
        onClose={() => setIsUserTypeModalOpen(false)}
        onSelect={handleUserTypeSelect}
      />
    </div>
  );
};

export default Register;
