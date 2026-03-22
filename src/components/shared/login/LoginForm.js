import React, { useState } from "react";
import {
  useLoginUserMutation,
  useLoginWithGoogleMutation,
} from "@/redux/services/apiSlice";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleLoginButton from "./GoogleLoginButton";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("tutor");

  const [formData, setFormData] = useState({
    tutor: { email: "", password: "" },
    parent: { email: "", password: "" },
  });

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [type]: { ...formData[type], [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData[activeTab];

    try {
      const res = await loginUser({
        mobileEmail: data.email,
        password: data.password,
        userType: activeTab,
      }).unwrap();

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.sessionDetails.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      toast.success("Login successful");
      if (res.data.user.userType === "tutor") {
        router.push("/dashboards/instructor-profile");
      } else {
        router.push("/dashboards/student-profile");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  const handleOAuthSuccess = async (credentialResponse) => {
    const clientId =
      "632857447223-m528ca3fhri1t7gro9uien1rumtlk93c.apps.googleusercontent.com";

    try {
      const result = await loginWithGoogle({
        token: credentialResponse.credential,
        clientId,
        select_by: activeTab,
        // userType: activeTab, // pass activeTab as userType
      }).unwrap();
      console.log(result, "result");

      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.data.sessionDetails.accessToken);
        localStorage.setItem("user", JSON.stringify(result.data.user));
      }
      toast.success("Login successful");
      console.log("Login successful:", result);

      if (result.data.user.userType === "tutor") {
        router.push("/dashboards/instructor-profile");
      } else {
        router.push("/dashboards/student-profile");
      }
    } catch (error) {
      toast.error("Google login failed");
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      <div className="text-center mb-4">
        <h3 className="text-size-32 font-bold text-blackColor mb-2 leading-normal">
          Login
        </h3>
        {/* <p className="text-contentColor mb-15px">
          <p>Don&apos;t have an account?</p>
          <a href="/register" className="text-primaryColor hover:underline">
            Sign up for free
          </a>
        </p> */}
      </div>

      {/* Tabs */}
      {/* <div className="flex justify-center mb-4 gap-4">
        {["tutor", "parent"].map((role) => (
          <button
            key={role}
            className={`px-4 py-2 rounded ${
              activeTab === role
                ? "bg-primaryColor text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div> */}

      {/* Login Form */}
      <form className="pt-25px" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData[activeTab].email}
            onChange={(e) => handleInputChange(e, activeTab)}
            className="w-full px-3 py-3 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData[activeTab].password}
            onChange={(e) => handleInputChange(e, activeTab)}
            className="w-full px-3 py-3 border rounded"
            required
          />
        </div>

        <div className="mb-4 flex justify-between text-sm text-gray-600">
          <label>
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <a href="#" className="hover:text-primaryColor">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primaryColor text-white py-2 rounded hover:bg-primaryColor/90 transition"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center my-4 text-gray-400 text-sm">or Log in with</p>

        <div className="text-center">
          <GoogleLoginButton handleSuccess={handleOAuthSuccess} />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
