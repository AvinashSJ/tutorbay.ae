import React, { useState } from "react";
import { useLoginUserMutation } from "@/redux/services/apiSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { validateLoginForm } from "@/libs/validations";
import { getSupabase } from "@/libs/supabase";
import { trackUserLogin } from "@/services/analytics";

const LoginForm = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const result = await loginUser({ email: formData.email, password: formData.password }).unwrap();
      const user = result?.user;
      const role = user?.app_metadata?.role ?? user?.user_metadata?.role ?? "PARENT";
      trackUserLogin("email", user.id);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email, fullName: user.user_metadata?.fullName ?? "", role }));
      }
      toast.success("Login successful");
      let target = "/parent-profile";
      if (role === "TUTOR") target = "/tutor-registration";
      else if (role === "STUDENT") target = "/student-profile";
      window.location.href = target;
    } catch (err) {
      const msg = err?.data || "";
      if (msg.toLowerCase().includes("email not confirmed")) {
        toast.error("Please confirm your email before logging in. Check your inbox for a confirmation link.");
      } else if (msg.toLowerCase().includes("invalid login credentials")) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error(msg || "Login failed. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      trackUserLogin("google");
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.");
      console.error("Google login error:", err);
    }
  };

  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      <div className="text-center mb-4">
        <h3 className="text-size-32 font-bold text-blackColor mb-2 leading-normal">Login</h3>
      </div>
      <form className="pt-25px" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="mb-4 flex justify-between text-sm text-gray-600">
          <label><input type="checkbox" className="mr-2" />Remember me</label>
          <a href="/forgot-password" className="hover:text-primaryColor">Forgot password?</a>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-primaryColor text-white py-2 rounded hover:bg-primaryColor/90 transition">
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
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
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
