"use client";
import Link from "next/link";
import moment from "moment";

const TutorCard = ({ tutor }) => {
  const {
    _id,
    firstName,
    lastName,
    email,
    phone,
    highestQualification,
    nationality,
    emirates,
    hasPrivateTutorLicense,
    modeOfTeaching,
    availability,
    expectedFeePerHour,
    status,
    createdAt
  } = tutor;

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark p-4 rounded-lg shadow-md">
      {/* Header with Tutor Info */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-xl font-semibold text-blackColor dark:text-blackColor-dark flex items-center gap-2">
          {firstName} {lastName}
          {hasPrivateTutorLicense && (
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">Licensed</span>
          )}
        </h3>
        <p className="text-sm text-contentColor dark:text-contentColor-dark mt-1">
          {highestQualification}
        </p>
        <p className="text-sm text-contentColor dark:text-contentColor-dark mt-1">
          {nationality}
        </p>
      </div>
      
      <div className="space-y-3">
        {/* Contact Info */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <i className="icofont-envelope text-primaryColor"></i>
            <span className="text-contentColor dark:text-contentColor-dark">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <i className="icofont-phone text-primaryColor"></i>
            <span className="text-contentColor dark:text-contentColor-dark">{phone}</span>
          </div>
        </div>

        {/* Location and Mode */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="icofont-location-pin text-primaryColor"></i>
            <span className="text-blackColor dark:text-blackColor-dark">{emirates}</span>
          </div>
          <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full capitalize">
            {modeOfTeaching}
          </span>
        </div>

        {/* Fee */}
        <div className="bg-primaryColor bg-opacity-10 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-contentColor dark:text-contentColor-dark">Hourly Rate:</span>
            <span className="text-xl font-semibold text-primaryColor">
              AED {expectedFeePerHour}
            </span>
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-blackColor dark:text-blackColor-dark mb-2">
            Available Times
          </h4>
          <div className="space-y-2">
            {availability.map((slot, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md text-sm flex justify-between items-center"
              >
                <span className="font-medium text-primaryColor">{slot.days}</span>
                <span className="text-contentColor dark:text-contentColor-dark">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status and Join Date */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-contentColor dark:text-contentColor-dark">
            Joined {moment(createdAt).format('MMM YYYY')}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Action Button */}
      <Link 
        href={`/tutors/${_id}`}
        className="mt-4 block w-full text-center py-2 px-4 bg-primaryColor text-whiteColor rounded-md hover:bg-opacity-90 transition-all duration-300"
      >
        View Profile
      </Link>
    </div>
  );
};

export default TutorCard; 