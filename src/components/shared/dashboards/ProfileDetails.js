"use client";
import { useGetUserQuery, useUpdateUserDetailsMutation } from "@/redux/services/userSlice";
import { getSupabase } from "@/libs/supabase";
import moment from "moment/moment";
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import TutorProfileDetails from "./TutorProfileDetails";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import GoogleMapModal from "../gmapsPopup";

const ProfileDetails = () => {
  const router = useRouter();
  const { userId } = useUser();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [updateUserDetails, { isLoading: isSaving }] = useUpdateUserDetailsMutation();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    emiratesId: "",
    city: "",
    profileImage: null,
    backgroundImage: null,
    currentLocationURL: "",
    mapLocation: [{ lat: "", lng: "" }],
  });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  const { data: user, error, isLoading, refetch } = useGetUserQuery(userId, {
    skip: !userId || !isLoggedIn,
  });

  useEffect(() => {
    if (!user) return;
    const fullName = user.fullName ?? "";
    const [fn = "", ...rest] = fullName.split(" ").filter(Boolean);
    const profile = user.studentProfile ?? user.parentProfile ?? {};

    setFormData((prev) => ({
      ...prev,
      firstName: fn,
      lastName: rest.join(" "),
      phone: user.phone ?? "",
      emiratesId: user.emiratesId ?? "",
      profileImage: user.profileImage ?? null,
      backgroundImage: user.backgroundImage ?? null,
      city: profile.city ?? profile.area ?? "",
      currentLocationURL: profile.location?.currentLocationURL ?? "",
      mapLocation: profile.location?.mapLocation ?? [{ lat: "", lng: "" }],
    }));

    const fetchProfile = async () => {
      const supabase = getSupabase();
      const role = user.role || "PARENT";
      const table = role === "STUDENT" ? "StudentProfile" : "ParentProfile";
      const { data: extra } = await supabase
        .from(table)
        .select("*")
        .eq("userId", userId)
        .single();

      if (extra) {
        setFormData((prev) => ({
          ...prev,
          city: extra.city ?? extra.area ?? prev.city,
          currentLocationURL: extra.location?.currentLocationURL ?? prev.currentLocationURL,
          mapLocation: extra.location?.mapLocation ?? prev.mapLocation,
        }));
      }
    };
    fetchProfile();
  }, [user, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = ({ lat, lng, mapUrl }) => {
    setFormData((prev) => ({
      ...prev,
      currentLocationURL: mapUrl,
      mapLocation: [{ lat, lng }],
    }));
    setIsMapModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails({
        userId,
        data: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          emiratesId: formData.emiratesId,
        },
      }).unwrap();

      const supabase = getSupabase();

      const { error: userImgError } = await supabase
        .from("User")
        .update({
          profileImage: formData.profileImage,
          backgroundImage: formData.backgroundImage,
        })
        .eq("id", userId);

      if (userImgError) {
        console.warn("User image update warning:", userImgError.message);
      }

      const role = user?.role || "PARENT";
      const profileTable = role === "STUDENT" ? "StudentProfile" : "ParentProfile";
      const profileIdField = "userId";

      const { error: profileError } = await supabase
        .from(profileTable)
        .upsert({
          [profileIdField]: userId,
          city: formData.city,
          area: formData.city,
          location: {
            currentLocationURL: formData.currentLocationURL,
            mapLocation: formData.mapLocation,
          },
          updatedAt: new Date().toISOString(),
        }, { onConflict: profileIdField });

      if (profileError) {
        console.warn("Profile table upsert warning:", profileError.message);
      }

      toast.success("Profile updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (authLoading || !userId || !isLoggedIn) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="text-center text-contentColor dark:text-contentColor-dark">
          Please log in to view profile details.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="text-center text-red-500">
          Error loading profile details. Please try again later.
        </div>
      </div>
    );
  }

  if (user?.role === "TUTOR") {
    return <TutorProfileDetails />;
  }

  const inputClass = "w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const readOnlyClass = "text-blackColor dark:text-blackColor-dark";

  return (
    <form onSubmit={handleSave} className="p-10px md:px-10 md:py-50px mb-30px">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          My Profile
        </h2>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-primaryColor text-white rounded hover:bg-primaryColor/90 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Registration Date</label>
              <div className={readOnlyClass}>{moment(user?.createdAt).format("DD, MMMM yyyy H:MM A")}</div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <div className={readOnlyClass}>{user?.email}</div>
            </div>
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>User Type</label>
              <div className={readOnlyClass + " capitalize"}>{user?.role?.toLowerCase() || "Not specified"}</div>
            </div>
          </div>
        </div>

        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Location Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" value={formData.currentLocationURL} readOnly className={inputClass + " mb-2"} placeholder="Select location on map" />
              <button type="button" onClick={() => setIsMapModalOpen(true)} className="w-full p-2 bg-primaryColor text-white rounded text-sm">
                Select Location on Map
              </button>
            </div>
          </div>
        </div>

        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Additional Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Emirates ID</label>
              <input type="text" name="emiratesId" value={formData.emiratesId} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Registration Method</label>
              <div className={readOnlyClass + " capitalize"}>{user?.registrationMethod || "Not specified"}</div>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <div className={readOnlyClass + " capitalize"}>{user?.isActive ? "Active" : "Inactive"}</div>
            </div>
          </div>
        </div>
      </div>

      <GoogleMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </form>
  );
};

export default ProfileDetails;
