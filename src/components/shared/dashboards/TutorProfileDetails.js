"use client";
import { useGetUserQuery, useUpdateUserDetailsMutation } from "@/redux/services/userSlice";
import { getSupabase } from "@/libs/supabase";
import moment from "moment/moment";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import GoogleMapModal from "../gmapsPopup";
import ReviewList from "../matching/ReviewList";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inputClass = "w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm";
const labelClass = "block text-sm font-medium text-gray-600 mb-1";
const cardClass = "bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6";

const TutorProfileDetails = () => {
  const router = useRouter();
  const { userId } = useUser();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [updateUserDetails, { isLoading: isSaving }] = useUpdateUserDetailsMutation();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: user, error, isLoading, refetch } = useGetUserQuery(userId, {
    skip: !userId || !isLoggedIn,
  });

  const tutorProfile = Array.isArray(user?.tutorProfile) ? user?.tutorProfile[0] : user?.tutorProfile || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    nationality: "",
    highestQualification: "",
    modeOfTeaching: "",
    expectedFeePerHour: "",
    hasPrivateTutorLicense: false,
    emirateId: "",
    subjects: "",
    areas: "",
    bio: "",
    profileImage: null,
    backgroundImage: null,
    availability: [{ days: "", startTime: "", endTime: "" }],
    location: { currentLocationURL: "", mapLocation: [] },
  });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!user) return;
    const fullName = user.fullName ?? "";
    const [fn = "", ...rest] = fullName.split(" ").filter(Boolean);
    const profile = Array.isArray(user.tutorProfile) ? user.tutorProfile[0] : user.tutorProfile || {};

    setFormData((prev) => ({
      ...prev,
      firstName: fn,
      lastName: rest.join(" "),
      phone: user.phone ?? "",
      emirateId: user.emiratesId ?? "",
      profileImage: user.profileImage ?? null,
      backgroundImage: user.backgroundImage ?? null,
      nationality: profile?.nationality ?? "",
      highestQualification: profile?.highestQualification ?? "",
      modeOfTeaching: profile?.modeOfTeaching ?? "",
      expectedFeePerHour: profile?.expectedFeePerHour ?? "",
      hasPrivateTutorLicense: profile?.hasPrivateTutorLicense ?? false,
      subjects: profile?.subjects?.join(", ") ?? "",
      areas: profile?.areas?.join(", ") ?? "",
      bio: profile?.bio ?? "",
      availability: profile?.availability?.length > 0
        ? profile.availability.map(s => ({ days: s.days, startTime: s.startTime, endTime: s.endTime }))
        : [{ days: "", startTime: "", endTime: "" }],
      location: profile?.location ?? { currentLocationURL: "", mapLocation: [] },
    }));
  }, [user]);

  const fetchedRef = React.useRef(false);
  useEffect(() => {
    if (!userId || isLoading || !user || fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchExtra = async () => {
      const supabase = getSupabase();
      const { data: extra } = await supabase
        .from("TutorProfile")
        .select("*")
        .eq("userId", userId)
        .single();

      if (extra) {
        setFormData((prev) => ({
          ...prev,
          nationality: extra.nationality ?? prev.nationality,
          highestQualification: extra.highestQualification ?? prev.highestQualification,
          modeOfTeaching: extra.modeOfTeaching ?? prev.modeOfTeaching,
          expectedFeePerHour: extra.expectedFeePerHour ?? prev.expectedFeePerHour,
          hasPrivateTutorLicense: extra.hasPrivateTutorLicense ?? prev.hasPrivateTutorLicense,
          subjects: extra.subjects?.join(", ") ?? prev.subjects,
          areas: extra.areas?.join(", ") ?? prev.areas,
          bio: extra.bio ?? prev.bio,
          availability: extra.availability?.length > 0
            ? extra.availability.map(s => ({ days: s.days, startTime: s.startTime, endTime: s.endTime }))
            : prev.availability,
          location: extra.location ?? prev.location,
        }));
      }
    };
    fetchExtra();
  }, [userId, isLoading, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.availability];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, availability: updated };
    });
  };

  const addAvailabilitySlot = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { days: "", startTime: "", endTime: "" }],
    }));
  };

  const removeAvailabilitySlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleLocationSelect = useCallback(({ lat, lng, mapUrl }) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        currentLocationURL: mapUrl,
        mapLocation: [{ lat: lat.toString(), lng: lng.toString() }],
      },
    }));
    setIsMapModalOpen(false);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserDetails({
        userId,
        data: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
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

      const { error: profileError } = await supabase
        .from("TutorProfile")
        .upsert({
          userId,
          nationality: formData.nationality,
          highestQualification: formData.highestQualification,
          modeOfTeaching: formData.modeOfTeaching,
          expectedFeePerHour: formData.expectedFeePerHour ? parseInt(formData.expectedFeePerHour) : null,
          hasPrivateTutorLicense: formData.hasPrivateTutorLicense,
          emirateId: formData.emirateId,
          subjects: formData.subjects ? formData.subjects.split(",").map(s => s.trim()).filter(Boolean) : [],
          areas: formData.areas ? formData.areas.split(",").map(s => s.trim()).filter(Boolean) : [],
          bio: formData.bio,
          availability: formData.availability.filter(a => a.days && a.startTime && a.endTime),
          location: formData.location,
          updatedAt: new Date().toISOString(),
        }, { onConflict: "userId" });

      if (profileError) {
        console.warn("TutorProfile upsert warning:", profileError.message);
      }

      toast.success("Profile updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !userId || !isLoggedIn) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="text-center text-contentColor dark:text-contentColor-dark">Please log in to view profile details.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primaryColor mx-auto"></div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
        <div className="text-center text-red-500">Error loading profile details. Please try again later.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-10px md:px-10 md:py-50px mb-30px">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">My Profile</h2>
        <button
          type="submit"
          disabled={isSaving || saving}
          className="px-6 py-2 bg-primaryColor text-white rounded hover:bg-primaryColor/90 transition disabled:opacity-50 flex items-center gap-2"
        >
          {(isSaving || saving) ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Saving...
            </>
          ) : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Registration Date</label>
              <div className="text-sm text-blackColor dark:text-blackColor-dark">{moment(user?.createdAt).format("DD, MMMM yyyy H:MM A")}</div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <div className="text-sm text-blackColor dark:text-blackColor-dark">{user?.email}</div>
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
              <label className={labelClass}>Nationality</label>
              <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">Teaching Details</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Mode of Teaching</label>
              <select name="modeOfTeaching" value={formData.modeOfTeaching} onChange={handleChange} className={inputClass}>
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Highest Qualification</label>
              <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Expected Fee per Hour ($)</label>
              <input type="number" name="expectedFeePerHour" value={formData.expectedFeePerHour} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subjects (comma separated)</label>
              <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} className={inputClass} placeholder="Math, English, Science" />
            </div>
            <div>
              <label className={labelClass}>Areas (comma separated)</label>
              <input type="text" name="areas" value={formData.areas} onChange={handleChange} className={inputClass} placeholder="Dubai Marina, JLT" />
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="hasPrivateTutorLicense" checked={formData.hasPrivateTutorLicense} onChange={handleChange} className="h-4 w-4 text-primaryColor focus:ring-primaryColor border-gray-300 rounded" />
              <label className="text-sm font-medium text-gray-600">I have a private tutor license</label>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">Availability</h3>
          <div className="space-y-4">
            {formData.availability.map((slot, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <label className={labelClass}>Day</label>
                  <select value={slot.days} onChange={(e) => handleAvailabilityChange(index, "days", e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Start</label>
                  <input type="time" value={slot.startTime} onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>End</label>
                  <input type="time" value={slot.endTime} onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)} className={inputClass} />
                </div>
                <button type="button" onClick={() => removeAvailabilitySlot(index)} className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addAvailabilitySlot} className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
              Add Time Slot
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">Location Details</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Emirates ID</label>
              <input type="text" name="emirateId" value={formData.emirateId} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" value={formData.location.currentLocationURL} readOnly className={`${inputClass} mb-2`} placeholder="Select location on map" />
              <button type="button" onClick={() => setIsMapModalOpen(true)} className="w-full p-2 bg-primaryColor text-white rounded text-sm">
                {formData.location.currentLocationURL ? "Change Location" : "Select Location on Map"}
              </button>
              {formData.location.currentLocationURL && (
                <p className="mt-1 text-sm text-green-600">Location selected</p>
              )}
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">Additional Information</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>User Type</label>
              <div className="text-sm text-blackColor dark:text-blackColor-dark capitalize">{user?.role?.toLowerCase() || "Not specified"}</div>
            </div>
            <div>
              <label className={labelClass}>Registration Method</label>
              <div className="text-sm text-blackColor dark:text-blackColor-dark capitalize">{user?.registrationMethod || "Not specified"}</div>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <div className="text-sm text-blackColor dark:text-blackColor-dark capitalize">{user?.isActive ? "Active" : "Inactive"}</div>
            </div>
          </div>
        </div>
      </div>

      <ReviewList userId={userId} title="Tutor Reviews" />

      <GoogleMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </form>
  );
};

export default TutorProfileDetails;
