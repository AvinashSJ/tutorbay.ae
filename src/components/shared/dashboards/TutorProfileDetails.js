"use client";
import { useGetUserQuery } from "@/redux/services/userSlice";
import moment from "moment/moment";
import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import EditTutorProfileForm from "./EditTutorProfileForm";

const TutorProfileDetails = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Check for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const { data: user, error, isLoading, refetch } = useGetUserQuery(userId, {
    skip: !userId || !localStorage.getItem("token"),
  });

  const handleEditSuccess = () => {
    refetch(); // Refetch user data after successful edit
  };

  if (!userId || !localStorage.getItem("token")) {
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
              <div>{user?.firstName}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Last Name</div>
              <div>{user?.lastName}</div>
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
              <div className="text-gray-600">Nationality</div>
              <div>{user?.tutorProfile?.nationality || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Teaching Details Card */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Teaching Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Mode of Teaching</div>
              <div>{user?.tutorProfile?.modeOfTeaching || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Highest Qualification</div>
              <div>{user?.tutorProfile?.highestQualification || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Expected Fee/Hour</div>
              <div>{user?.tutorProfile?.expectedFeePerHour ? `$${user.tutorProfile.expectedFeePerHour}` : 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Private Tutor License</div>
              <div>{user?.tutorProfile?.hasPrivateTutorLicense ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>

        {/* Availability Card */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Availability
          </h3>
          <div className="space-y-4">
            {user?.tutorProfile?.availability?.length > 0 ? (
              user.tutorProfile.availability.map((slot, index) => (
                <div key={slot._id} className="grid grid-cols-3 gap-4">
                  <div className="text-gray-600">{slot.days}</div>
                  <div>{slot.startTime}</div>
                  <div>{slot.endTime}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No availability set</div>
            )}
          </div>
        </div>

        {/* Location Details Card */}
        <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blackColor dark:text-blackColor-dark">
            Location Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Location</div>
              <div>
                {user?.tutorProfile?.location?.currentLocationURL ? (
                  <a 
                    href={user.tutorProfile.location.currentLocationURL}
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
              <div>{user?.tutorProfile?.emirateId || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Registration Method</div>
              <div className="capitalize">{user?.registrationMethod || 'Not specified'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">Status</div>
              <div className="capitalize">{user?.status || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </div>

      <EditTutorProfileForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        userData={user}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default TutorProfileDetails; 