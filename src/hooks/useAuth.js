import { useEffect, useState } from "react";
import { getSupabase } from "@/libs/supabase";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to extract role from user - prioritize user_metadata.role (set during Google signup)
  const extractRole = (sessionUser) => {
    // First check localStorage (set during Google signup flow)
    if (typeof window !== "undefined") {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser?.role) {
          return storedUser.role;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    // Then check user_metadata (updated by callback page)
    const role = sessionUser.user_metadata?.role;
    if (role) return role;
    // Fallback to app_metadata
    return sessionUser.app_metadata?.role ?? "PARENT";
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

