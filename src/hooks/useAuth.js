import { useEffect, useState } from "react";
import { getSupabase } from "@/libs/supabase";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          role: session.user.app_metadata?.role ?? session.user.user_metadata?.role ?? "PARENT",
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
          role: session.user.app_metadata?.role ?? session.user.user_metadata?.role ?? "PARENT",
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

