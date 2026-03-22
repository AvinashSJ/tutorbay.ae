// redux/services/baseQuery.js
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-hot-toast";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://tutorbay-api.onrender.com/api",
  prepareHeaders: (headers, { getState }) => {
    // First, get any existing headers
    headers.set('Content-Type', 'application/json');
    
    // Then get and set the token
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  // Check for token before making the request
  const token = getToken();
  if (!token && typeof window !== "undefined" && window.location.pathname !== "/login") {
    toast.error("Please log in to continue.");
    debugger;
    window.location.href = "/login";
    return { error: { status: 401, data: "No token found" } };
  }

  // If args.headers exists, ensure it includes the token
  if (typeof args === 'object') {
    const headers = args.headers || {};
    args.headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    toast.error("Session expired. Please log in again.");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // Clear invalid token
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  return result;
};