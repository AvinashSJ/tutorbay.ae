"use client";
import { useGetUserQuery } from "@/redux/services/userSlice";
import moment from "moment/moment";
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import EditProfileForm from "./EditProfileForm";
import TutorProfileDetails from "./TutorProfileDetails";
import useAuth from "@/hooks/useAuth";

const ProfileDetails = () => {
  const router = useRouter();
  const { userId } = useUser();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [authLoading, isLoggedIn, router]);

  const { data: user, error, isLoading, refetch } = useGetUserQuery(userId, {
    skip: !userId || !isLoggedIn,
  });

  const handleEditSuccess = () => {
    refetch();
  };

  const profileDetails = user?.studentProfile ?? user?.parentProfile ?? null;
  const fullName = user?.fullName ?? "";
  const [firstName = "", ...restName] = fullName.split(" ").filter(Boolean);
  const lastName = restName.join(" ");

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

  // If user is a tutor, render TutorProfileDetails
  if (user?.role === "TUTOR") {
    return <TutorProfileDetails />;
  }

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          My Profile
        </h2>
        <button
          onClick={() => setIsEditFormOpen(true)}
          className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-primaryColor/90"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Registration Date</div>
              <div>{moment(user?.createdAt).format("DD, MMMM yyyy H:MM A")}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">First Name</div>
              <div>{firstName || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Last Name</div>
              <div>{lastName || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Email</div>
              <div>{user?.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Phone</div>
              <div>{user?.phone}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">User Type</div>
              <div className="capitalize">{user?.role?.toLowerCase() || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Education Details Card */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Education Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Curriculum</div>
              <div>{profileDetails?.curriculum || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Subject</div>
              <div>{profileDetails?.subject || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Grade</div>
              <div>{profileDetails?.gradeLevel ? `Year ${profileDetails.gradeLevel}` : 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Location Details Card */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Location Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">City</div>
              <div>{profileDetails?.city || profileDetails?.area || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Location</div>
              <div>
                {profileDetails?.location?.currentLocationURL ? (
                  <a 
                    href={profileDetails.location.currentLocationURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primaryColor hover:underline"
                  >
                    View on Map
                  </a>
                ) : (
                  'Not specified'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Additional Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Emirates ID</div>
              <div>{profileDetails?.emirateId || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Registration Method</div>
              <div className="capitalize">{user?.registrationMethod || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Status</div>
              <div className="capitalize">{user?.isActive ? 'active' : 'inactive'}</div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        userData={user}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default ProfileDetails;
