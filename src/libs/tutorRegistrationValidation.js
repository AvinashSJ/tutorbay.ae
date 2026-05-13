// Tutor registration form validation
// Extends validations.js with section-level checks and per-field error messages

import { isValidPhone, isValidEmiratesId, isValidName } from "./validations";

export const validatePersonalInfo = (data) => {
  const errors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = "First name is required";
  } else if (!isValidName(data.firstName.trim())) {
    errors.firstName = "First name must contain only letters (2-50 characters)";
  }

  if (!data.lastName?.trim()) {
    errors.lastName = "Last name is required";
  } else if (!isValidName(data.lastName.trim())) {
    errors.lastName = "Last name must contain only letters (2-50 characters)";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!isValidPhone(data.phone.trim())) {
    errors.phone = "Enter a valid UAE phone (e.g. 0501234567 or +971501234567)";
  }

  if (!data.nationality?.trim()) {
    errors.nationality = "Nationality is required";
  }

  if (data.emirateId?.trim() && !isValidEmiratesId(data.emirateId.trim())) {
    errors.emirateId = "Emirates ID must be 15 digits starting with 784";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTeachingDetails = (data) => {
  const errors = {};

  if (!data.highestQualification?.trim()) {
    errors.highestQualification = "Highest qualification is required";
  }

  if (!data.modeOfTeaching) {
    errors.modeOfTeaching = "Mode of teaching is required";
  }

  const fee = parseFloat(data.expectedFeePerHour);
  if (isNaN(fee) || fee <= 0) {
    errors.expectedFeePerHour = "Expected fee must be greater than 0";
  }

  if (!data.subjects?.length) {
    errors.subjects = "At least one subject is required";
  }

  if (!data.areas?.length) {
    errors.areas = "At least one area is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLocationLicense = (data) => {
  const errors = {};

  if (!data.location?.currentLocationURL) {
    errors.location = "Please set your location on the map";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAvailability = (data) => {
  const errors = {};

  if (!data.availability?.length) {
    errors.availability = "At least one availability slot is required";
  } else {
    const slotErrors = [];
    data.availability.forEach((slot, i) => {
      const se = {};
      if (!slot.days) se.days = "Select a day";
      if (!slot.startTime) se.startTime = "Select start time";
      if (!slot.endTime) se.endTime = "Select end time";
      if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
        se.endTime = "End time must be after start time";
      }
      if (Object.keys(se).length) slotErrors[i] = se;
    });
    if (slotErrors.length) errors.slots = slotErrors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate a specific section by index
export const validateSection = (data, sectionIdx) => {
  switch (sectionIdx) {
    case 0: return validatePersonalInfo(data);
    case 1: return validateTeachingDetails(data);
    case 2: return validateLocationLicense(data);
    case 3: return validateAvailability(data);
    default: return { isValid: true, errors: {} };
  }
};

// Validate all sections
export const validateAllSections = (data) => {
  const results = [
    validatePersonalInfo(data),
    validateTeachingDetails(data),
    validateLocationLicense(data),
    validateAvailability(data),
  ];

  return {
    isValid: results.every((r) => r.isValid),
    sections: results,
  };
};

// Quick check if a section has all required fields filled (for section header styling)
export const isSectionFilled = (data, idx) => {
  switch (idx) {
    case 0:
      return !!(data.firstName?.trim() && data.lastName?.trim() && data.phone?.trim() && data.nationality?.trim());
    case 1:
      return !!(data.highestQualification?.trim() && parseFloat(data.expectedFeePerHour) > 0 && data.subjects?.length > 0 && data.areas?.length > 0);
    case 2:
      return !!(data.location?.currentLocationURL);
    case 3:
      return data.availability?.length > 0 && data.availability.every((s) => s.days && s.startTime && s.endTime);
    default:
      return false;
  }
};
