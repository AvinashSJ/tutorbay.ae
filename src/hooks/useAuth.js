import { useEffect, useState } from "react";
import { getSupabase } from "@/libs/supabase";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to extract role from user - prioritize pending_role (set by SignUpForm during signup)
  const extractRole = (sessionUser) => {
    // FIRST: Check pending_role (set by SignUpForm before redirect to registration)
    if (typeof window !== "undefined") {
      try {
        const pendingRole = localStorage.getItem("pending_role");
        if (pendingRole) {
          console.log("[useAuth] Role from pending_role:", pendingRole);
          localStorage.removeItem("pending_role");
          // Also clear any stale user object
          localStorage.removeItem("user");
          return pendingRole;
        }
      } catch (e) {
        // Ignore errors
      }
    }
    
    // SECOND: Check user_metadata (set during signup/callback)
    const metaRole = sessionUser.user_metadata?.role;
    if (metaRole) {
      console.log("[useAuth] Role from user_metadata:", metaRole);
      return metaRole;
    }
    
    // THIRD: Check app_metadata
    const appRole = sessionUser.app_metadata?.role;
    if (appRole) {
      console.log("[useAuth] Role from app_metadata:", appRole);
      return appRole;
    }
    
    // LAST: Check localStorage user (only if authenticated)
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser?.role) {
          console.log("[useAuth] Role from localStorage:", storedUser.role);
          return storedUser.role;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    console.log("[useAuth] No role found, defaulting to PARENT");
    return "PARENT";
  };

  useEffect(() => {
    const supabase = getSupabase();

    // Load initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.fullName ?? "",
          role: extractRole(session.user),
        });
      }
      setLoading(false);
    });

    // Keep in sync with auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.fullName ?? "",
          role: extractRole(session.user),
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { isLoggedIn, user, loading };
};

export default useAuth;

