"use client";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const RequireRole = ({ children, allowedRoles }) => {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      router.push("/");
    }
  }, [loading, isLoggedIn, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (!isLoggedIn) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return null;

  return <>{children}</>;
};

export default RequireRole;
