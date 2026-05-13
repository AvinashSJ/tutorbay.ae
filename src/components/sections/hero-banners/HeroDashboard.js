"use client";
import dashboardImage2 from "@/assets/images/dashbord/dashbord__2.jpg";
import teacherImage2 from "@/assets/images/teacher/teacher__2.png";
import useAuth from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useGetUserQuery } from "@/redux/services/userSlice";
import { validateFileUpload } from "@/libs/validations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getSupabase } from "@/libs/supabase";

const PROFILE_PATHS = ["instructor-profile", "parent-profile", "student-profile"];
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const HeroDashboard = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const currentSection = pathParts[0] === "dashboards" ? pathParts[1] : pathParts[0];
  const partOfPathNaem = currentSection?.split("-")[0] || "";
  const isAdmin = partOfPathNaem === "admin" ? true : false;
  const isInstructor = partOfPathNaem === "instructor" ? true : false;
  const currentPath = pathParts[pathParts.length - 1] || "";
  const isProfilePage = PROFILE_PATHS.includes(currentPath);

  const { user: authUser } = useAuth();
  const { userId } = useUser();
  const { data: userData } = useGetUserQuery(userId, { skip: !userId || !isProfilePage });

  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const bgInputRef = useRef(null);
  const profileInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setProfileImage(userData.profileImage || null);
      setBackgroundImage(userData.backgroundImage || null);
    }
  }, [userData]);

  useEffect(() => {
    if (!isProfilePage) {
      setProfileImage(null);
      setBackgroundImage(null);
    }
  }, [isProfilePage]);

  const uploadFile = async (file, type) => {
    const validation = validateFileUpload(file, {
      maxSizeMB: 5,
      allowedTypes: ALLOWED_TYPES,
      allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    });
    if (!validation.isValid) {
      alert(validation.error);
      return null;
    }

    const ext = file.name.split(".").pop();
    const filePath = `${userId}/${type}-${Date.now()}.${ext}`;

    try {
      const supabase = getSupabase();
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      return publicData?.publicUrl || null;
    } catch (err) {
      console.warn("Upload failed:", err);
      alert("Upload failed. Please try again.");
      return null;
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProfile(true);
    const url = await uploadFile(file, "profile");
    if (url) {
      setProfileImage(url);
      const supabase = getSupabase();
      await supabase.from("User").update({ profileImage: url }).eq("id", userId);
    }
    setUploadingProfile(false);
    if (profileInputRef.current) profileInputRef.current.value = "";
  };

  const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    const url = await uploadFile(file, "background");
    if (url) {
      setBackgroundImage(url);
      const supabase = getSupabase();
      await supabase.from("User").update({ backgroundImage: url }).eq("id", userId);
    }
    setUploadingBg(false);
    if (bgInputRef.current) bgInputRef.current.value = "";
  };

  const bgClass = isAdmin
    ? "bg-primaryColor"
    : isInstructor
    ? "bg-naveBlue"
    : "bg-skycolor";

  return (
    <section>
      <div className="container-fluid-2">
        <div
          className={`
            relative overflow-hidden rounded-5
            ${isProfilePage ? 'group' : ''}
            ${!isProfilePage || !backgroundImage ? bgClass : ''}
          `}
          style={isProfilePage && backgroundImage ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        >
          {isProfilePage && backgroundImage && (
            <div className="absolute inset-0 bg-black/40" />
          )}

          {isProfilePage && (
            <>
              <button
                type="button"
                className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition bg-white/80 hover:bg-white rounded-full p-2 shadow"
                onClick={() => bgInputRef.current?.click()}
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </button>
              {uploadingBg && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
                </div>
              )}
              <input ref={bgInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleBgUpload} className="hidden" />
            </>
          )}

          <div className="relative z-10 p-5 md:p-10 flex justify-center md:justify-between items-center flex-wrap gap-2">
            <div className="flex items-center flex-wrap justify-center sm:justify-start">
              <div className="mr-10px lg:mr-5 relative">
                {isProfilePage ? (
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => profileInputRef.current?.click()}
                  >
                    <img
                      src={profileImage || (isAdmin || isInstructor ? dashboardImage2.src : teacherImage2.src)}
                      alt=""
                      className="w-27 h-27 md:w-22 md:h-22 lg:w-27 lg:h-27 rounded-full p-1 border-2 border-darkdeep7 box-content object-cover"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition bg-white/80 rounded-full p-1.5">
                        <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                    </div>
                    {uploadingProfile && (
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={isAdmin || isInstructor ? dashboardImage2.src : teacherImage2.src}
                    alt=""
                    className="w-27 h-27 md:w-22 md:h-22 lg:w-27 lg:h-27 rounded-full p-1 border-2 border-darkdeep7 box-content object-cover"
                  />
                )}
              </div>

              <input ref={profileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleProfileUpload} className="hidden" />

              {isAdmin || authUser?.role === "TUTOR" ? (
                <div className="text-whiteColor font-bold text-center sm:text-start">
                  <h5 className="text-xl leading-1.2 mb-5px">Hello</h5>
                  <h2 className="text-2xl leading-1.24">
                    {authUser?.fullName || authUser?.email}
                  </h2>
                </div>
              ) : (
                <div className="text-whiteColor font-bold text-center sm:text-start">
                  <h5 className="text-2xl leading-1.24 mb-5px">
                    {authUser?.fullName || authUser?.email}
                  </h5>
                  <ul className="flex items-center gap-15px">
                    <li className="text-sm font-normal flex items-center gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open mr-0.5">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                      9 Courses Enroled
                    </li>
                    <li className="text-sm font-normal flex items-center gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-award">
                        <circle cx="12" cy="8" r="7"></circle>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                      </svg>
                      8 Certificate
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {isAdmin || isInstructor ? (
              <div className="text-center">
                <div className="text-yellow">
                  <i className="icofont-star"></i>
                  <i className="icofont-star"></i>
                  <i className="icofont-star"></i>
                  <i className="icofont-star"></i>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star inline-block">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <p className="text-whiteColor">4.0 (120 Reviews)</p>
              </div>
            ) : null}
            <div>
              <Link
                href={
                  isInstructor || authUser?.role === "TUTOR"
                    ? `/find-requirements`
                    : `/dashboards/parent-requirements`
                }
                className={`text-size-15 border text-whiteColor ${
                  isAdmin
                    ? "bg-primaryColor border-whiteColor hover:text-primaryColor"
                    : isInstructor
                    ? "bg-primaryColor border-primaryColor hover:text-primaryColor"
                    : "bg-secondaryColor border-secondaryColor hover:text-secondaryColor"
                } px-25px py-10px hover:bg-whiteColor rounded group text-nowrap flex gap-1 items-center`}
              >
                {isAdmin || isInstructor || authUser?.role === "TUTOR"
                  ? "Check for requirements"
                  : "Post a New Requirement"}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDashboard;
