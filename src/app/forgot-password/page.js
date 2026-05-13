"use client";
import React, { useState } from "react";
import { useForgotPasswordMutation } from "@/redux/services/apiSlice";
import toast from "react-hot-toast";
import Link from "next/link";

const ForgotPassword = () => {
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Check your email for the reset link");
    } catch (err) {
      toast.error(err?.data || "Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {isSuccess ? (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">&#10003;</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button onClick={() => window.location.reload()} className="text-primaryColor hover:underline">
                try again
              </button>
            </p>
            <Link href="/login" className="text-primaryColor hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
              <p className="text-gray-600 mt-2 text-sm">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primaryColor text-white py-3 rounded font-medium hover:bg-primaryColor/90 transition disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-primaryColor hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
