"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/libs/supabase";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const router = useRouter();
  const handledRef = useRef(false);

  // Helper to read cookie
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const supabase = getSupabase();

    const processSession = async (session) => {
      if (handledRef.current) return;
      if (!session?.user) return;
      handledRef.current = true;

      try {
        // Read role from cookie (most reliable for OAuth redirects)
        const roleFromCookie = getCookie("gs_role");
        const roleFromLocal = typeof window !== "undefined" ? localStorage.getItem("gs_role") : null;

        const role = roleFromCookie || roleFromLocal || "PARENT";

        console.log("Auth Callback - Cookie:", roleFromCookie, "Local:", roleFromLocal, "Using:", role);

        const fullName = session.user.user_metadata?.full_name
          || session.user.user_metadata?.name
          || session.user.email
          || "";

        // Update user metadata with the correct role
        const { error: updateError } = await supabase.auth.updateUser({
          data: { role, fullName }
        });
        if (updateError) console.error("Failed to update user metadata:", updateError);

        // Save to localStorage for useAuth() hook
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            fullName,
            role,
          }));
          localStorage.removeItem("gs_role");
          document.cookie = "gs_role=; path=/; max-age=0";
        }

        toast.success("Successfully signed in!");

        if (role === "TUTOR") {
          router.push("/tutor-registration");
        } else {
          router.push("/parent-profile");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        toast.error("Authentication failed. Please try again.");
        router.push("/login");
      }
    };

    // Get session after OAuth redirect
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) processSession(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        processSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
