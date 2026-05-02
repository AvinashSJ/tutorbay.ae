import React, { useState } from "react";
import { useLoginUserMutation } from "@/redux/services/apiSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser({ email: formData.email, password: formData.password }).unwrap();
      const user = result?.user;
      const role = user?.app_metadata?.role ?? user?.user_metadata?.role ?? "PARENT";
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email, fullName: user.user_metadata?.fullName ?? "", role }));
      }
      toast.success("Login successful");
      if (role === "TUTOR") {
        router.push("/instructor-profile");
      } else {
        router.push("/parent-profile");
      }
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

  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      <div className="text-center mb-4">
        <h3 className="text-size-32 font-bold text-blackColor mb-2 leading-normal">Login</h3>
      </div>
      <form className="pt-25px" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" placeholder="Your email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-3 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-3 border rounded" required />
        </div>
        <div className="mb-4 flex justify-between text-sm text-gray-600">
          <label><input type="checkbox" className="mr-2" />Remember me</label>
          <a href="/forgot-password" className="hover:text-primaryColor">Forgot password?</a>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-primaryColor text-white py-2 rounded hover:bg-primaryColor/90 transition">
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
