import {
  validatePersonalInfo,
  validateTeachingDetails,
  validateLocationLicense,
  validateAvailability,
  validateSection,
  validateAllSections,
  isSectionFilled,
} from "@/libs/tutorRegistrationValidation";

describe("validatePersonalInfo", () => {
  const valid = {
    firstName: "John",
    lastName: "Doe",
    phone: "+971501234567",
    nationality: "UAE",
    emirateId: "",
  };

  test("accepts valid personal info", () => {
    const result = validatePersonalInfo(valid);
    expect(result.isValid).toBe(true);
  });

  test("rejects empty first name", () => {
    const result = validatePersonalInfo({ ...valid, firstName: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toContain("required");
  });

  test("rejects short first name", () => {
    const result = validatePersonalInfo({ ...valid, firstName: "A" });
    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toContain("2-50");
  });

  test("rejects empty last name", () => {
    const result = validatePersonalInfo({ ...valid, lastName: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors.lastName).toContain("required");
  });

  test("rejects invalid phone format", () => {
    const result = validatePersonalInfo({ ...valid, phone: "abc" });
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toContain("UAE phone");
  });

  test("rejects missing nationality", () => {
    const result = validatePersonalInfo({ ...valid, nationality: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors.nationality).toContain("required");
  });

  test("rejects invalid Emirates ID format when provided", () => {
    const result = validatePersonalInfo({ ...valid, emirateId: "123" });
    expect(result.isValid).toBe(false);
    expect(result.errors.emirateId).toContain("15 digits");
  });

  test("allows empty Emirates ID (optional field)", () => {
    const result = validatePersonalInfo({ ...valid, emirateId: "" });
    expect(result.isValid).toBe(true);
  });
});

describe("validateTeachingDetails", () => {
  const valid = {
    highestQualification: "Bachelor's in Math",
    modeOfTeaching: "Online",
    expectedFeePerHour: "100",
    subjects: ["Math"],
    areas: ["Dubai"],
  };

  test("accepts valid teaching details", () => {
    const result = validateTeachingDetails(valid);
    expect(result.isValid).toBe(true);
  });

  test("rejects missing qualification", () => {
    const result = validateTeachingDetails({ ...valid, highestQualification: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors.highestQualification).toContain("required");
  });

  test("rejects zero fee", () => {
    const result = validateTeachingDetails({ ...valid, expectedFeePerHour: "0" });
    expect(result.isValid).toBe(false);
    expect(result.errors.expectedFeePerHour).toContain("greater than 0");
  });

  test("rejects empty subjects", () => {
    const result = validateTeachingDetails({ ...valid, subjects: [] });
    expect(result.isValid).toBe(false);
    expect(result.errors.subjects).toContain("required");
  });

  test("rejects empty areas", () => {
    const result = validateTeachingDetails({ ...valid, areas: [] });
    expect(result.isValid).toBe(false);
    expect(result.errors.areas).toContain("required");
  });
});

describe("validateLocationLicense", () => {
  test("accepts when location is set", () => {
    const result = validateLocationLicense({
      location: { currentLocationURL: "https://maps.google.com/..." },
    });
    expect(result.isValid).toBe(true);
  });

  test("rejects when location is not set", () => {
    const result = validateLocationLicense({
      location: { currentLocationURL: "" },
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.location).toContain("set your location");
  });

  test("rejects when location object is empty", () => {
    const result = validateLocationLicense({ location: {} });
    expect(result.isValid).toBe(false);
    expect(result.errors.location).toContain("set your location");
  });
});

describe("validateAvailability", () => {
  test("accepts valid slots", () => {
    const data = {
      availability: [{ days: "Monday", startTime: "09:00", endTime: "17:00" }],
    };
    const result = validateAvailability(data);
    expect(result.isValid).toBe(true);
  });

  test("rejects empty availability", () => {
    const result = validateAvailability({ availability: [] });
    expect(result.isValid).toBe(false);
    expect(result.errors.availability).toContain("required");
  });

  test("rejects slot with missing day", () => {
    const data = { availability: [{ days: "", startTime: "09:00", endTime: "17:00" }] };
    const result = validateAvailability(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.slots[0].days).toBeDefined();
  });

  test("rejects slot with end time before start time", () => {
    const data = { availability: [{ days: "Monday", startTime: "17:00", endTime: "09:00" }] };
    const result = validateAvailability(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.slots[0].endTime).toContain("after start");
  });
});

describe("validateSection", () => {
  const validPersonal = {
    firstName: "John",
    lastName: "Doe",
    phone: "+971501234567",
    nationality: "UAE",
    emirateId: "",
  };

  test("validates section 0 (personal info)", () => {
    expect(validateSection(validPersonal, 0).isValid).toBe(true);
    expect(validateSection({ ...validPersonal, firstName: "" }, 0).isValid).toBe(false);
  });

  test("validates section 1 (teaching details)", () => {
    const d = { highestQualification: "BSc", modeOfTeaching: "Online", expectedFeePerHour: "50", subjects: ["Math"], areas: ["DXB"] };
    expect(validateSection(d, 1).isValid).toBe(true);
  });

  test("validates section 2 (location)", () => {
    expect(validateSection({ location: { currentLocationURL: "url" } }, 2).isValid).toBe(true);
    expect(validateSection({ location: {} }, 2).isValid).toBe(false);
  });

  test("validates section 3 (availability)", () => {
    expect(validateSection({ availability: [{ days: "Mon", startTime: "09:00", endTime: "17:00" }] }, 3).isValid).toBe(true);
    expect(validateSection({ availability: [] }, 3).isValid).toBe(false);
  });
});

describe("validateAllSections", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    phone: "+971501234567",
    nationality: "UAE",
    emirateId: "",
    highestQualification: "BSc",
    modeOfTeaching: "Online",
    expectedFeePerHour: "100",
    subjects: ["Math"],
    areas: ["DXB"],
    location: { currentLocationURL: "https://maps.google.com/" },
    availability: [{ days: "Monday", startTime: "09:00", endTime: "17:00" }],
  };

  test("passes all sections with valid data", () => {
    const result = validateAllSections(validData);
    expect(result.isValid).toBe(true);
    expect(result.sections).toHaveLength(4);
    result.sections.forEach((s) => expect(s.isValid).toBe(true));
  });

  test("fails when one section is invalid", () => {
    const result = validateAllSections({ ...validData, firstName: "" });
    expect(result.isValid).toBe(false);
    expect(result.sections[0].isValid).toBe(false);
  });
});

describe("isSectionFilled (quick check)", () => {
  test("section 0: filled when all required fields present", () => {
    expect(isSectionFilled({ firstName: "A", lastName: "B", phone: "123", nationality: "C" }, 0)).toBe(true);
    expect(isSectionFilled({ firstName: "A", lastName: "B", phone: "", nationality: "C" }, 0)).toBe(false);
  });

  test("section 1: filled when all required fields present", () => {
    const d = { highestQualification: "BSc", expectedFeePerHour: 50, subjects: ["Math"], areas: ["DXB"] };
    expect(isSectionFilled(d, 1)).toBe(true);
    expect(isSectionFilled({ ...d, subjects: [] }, 1)).toBe(false);
  });

  test("section 2: filled when location URL is set", () => {
    expect(isSectionFilled({ location: { currentLocationURL: "url" } }, 2)).toBe(true);
    expect(isSectionFilled({ location: {} }, 2)).toBe(false);
  });

  test("section 3: filled when availability has valid slots", () => {
    expect(isSectionFilled({ availability: [{ days: "Mon", startTime: "9", endTime: "5" }] }, 3)).toBe(true);
    expect(isSectionFilled({ availability: [] }, 3)).toBe(false);
    expect(isSectionFilled({ availability: [{ days: "Mon", startTime: "", endTime: "" }] }, 3)).toBe(false);
  });
});
