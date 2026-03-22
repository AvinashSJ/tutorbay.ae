"use client";
import Link from "next/link";
import moment from "moment";

const RequirementCard = ({ requirement }) => {
  const {
    _id,
    subject,
    curriculum,
    grade,
    location,
    modeOfTeaching,
    expectedFeePerHour,
    availability,
    additionalNotes,
    status,
    createdAt
  } = requirement;

  // Extract location display value and URL
  const locationUrl = location?.currentLocationURL;
  console.log(locationUrl, "locationUrl");
  
  // Create a user-friendly display version of the URL
  const getDisplayLocation = (url) => {
    if (!url) return "Location not specified";
    try {
      // Remove protocol and www
      let display = url.replace(/(https?:\/\/)?(www\.)?/, '');
      // Remove everything after the first slash
      display = display.split('/')[0];
      // Remove query parameters
      display = display.split('?')[0];
      // Limit to first 30 characters if still too long
      return display.length > 30 ? display.substring(0, 30) + '...' : display;
    } catch (e) {
      return url;
    }
  };

  const locationDisplay = getDisplayLocation(locationUrl);

  const LocationComponent = () => {
    if (locationUrl && (locationUrl?.startsWith('http://') || locationUrl.startsWith('https://'))) {
      return (
        <a 
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blackColor dark:text-blackColor-dark hover:text-primaryColor transition-colors duration-300 flex items-center gap-1"
          title={locationUrl} // Show full URL on hover
        >
          {locationDisplay}
          <i className="icofont-external-link text-xs"></i>
        </a>
      );
    }
    return <span className="text-blackColor dark:text-blackColor-dark">{locationDisplay}</span>;
  };

  return (
    <div className="bg-whiteColor dark:bg-whiteColor-dark p-4 rounded-lg shadow-md flex flex-col min-h-[400px]">
      {/* Content wrapper */}
      <div className="flex-grow">
        {/* Header with Subject Info */}
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-xl font-semibold text-blackColor dark:text-blackColor-dark">
            {subject}
          </h3>
          <p className="text-sm text-contentColor dark:text-contentColor-dark mt-1">
            {curriculum} - Grade {grade}
          </p>
        </div>
        
        <div className="space-y-3">
          {/* Location and Mode */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="icofont-location-pin text-primaryColor"></i>
              <LocationComponent />
            </div>
            <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full capitalize">
              {modeOfTeaching}
            </span>
          </div>

          {/* Fee */}
          <div className="bg-primaryColor bg-opacity-10 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-contentColor dark:text-contentColor-dark">Expected Fee:</span>
              <span className="text-xl font-semibold text-primaryColor">
                AED {expectedFeePerHour}/hr
              </span>
            </div>
          </div>

          {/* Availability Schedule */}
          {availability && availability.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                Preferred Times
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
          )}

          {/* Additional Notes */}
          {additionalNotes && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <h4 className="text-sm font-semibold text-blackColor dark:text-blackColor-dark mb-2">
                Additional Notes
              </h4>
              <p className="text-sm text-contentColor dark:text-contentColor-dark">
                {additionalNotes}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="mt-4">
        {/* Status and Post Date */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-contentColor dark:text-contentColor-dark">
            Posted {moment(createdAt).fromNow()}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {/* Action Button */}
        <Link 
          href={`/requirements/${_id}`}
          className="block w-full text-center py-2 px-4 bg-primaryColor text-whiteColor rounded-md hover:bg-opacity-90 transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RequirementCard; 