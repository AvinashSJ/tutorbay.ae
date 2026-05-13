import {
  isValidEmail,
  isValidPhone,
  isValidEmiratesId,
  validatePassword,
  isValidName,
  validateFileUpload,
  validateLoginForm,
  validateSignupForm,
  formatEmiratesId,
} from "@/libs/validations";

describe("isValidEmail", () => {
  test("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("a.b@c.co")).toBe(true);
    expect(isValidEmail("user+tag@domain.ae")).toBe(true);
  });

  test("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user @test.com")).toBe(false);
  });
});

describe("isValidPhone (UAE)", () => {
  test("accepts +971 format", () => {
    expect(isValidPhone("+971501234567")).toBe(true);
    expect(isValidPhone("+971551234567")).toBe(true);
  });

  test("accepts 05x format", () => {
    expect(isValidPhone("0501234567")).toBe(true);
    expect(isValidPhone("0541234567")).toBe(true);
    expect(isValidPhone("0581234567")).toBe(true);
  });

  test("accepts phone with spaces/dashes stripped", () => {
    expect(isValidPhone("050 123 4567")).toBe(true);
    expect(isValidPhone("050-123-4567")).toBe(true);
  });

  test("rejects invalid phones", () => {
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("abcdefghij")).toBe(false);
    expect(isValidPhone("+971")).toBe(false);
  });
});

describe("isValidEmiratesId", () => {
  test("accepts valid 15-digit Emirates ID (with dashes)", () => {
    expect(isValidEmiratesId("784-1992-1234567-1")).toBe(true);
    expect(isValidEmiratesId("784199212345671")).toBe(true);
  });

  test("rejects invalid Emirates IDs", () => {
    expect(isValidEmiratesId("")).toBe(false);
    expect(isValidEmiratesId("123")).toBe(false);
    expect(isValidEmiratesId("78419921234567")).toBe(false); // 14 digits
    expect(isValidEmiratesId("7841992123456712")).toBe(false); // 16 digits
    expect(isValidEmiratesId("78419921234567a")).toBe(false);
  });
});

describe("formatEmiratesId", () => {
  test("formats 15-digit string with dashes", () => {
    expect(formatEmiratesId("784199212345671")).toBe("784-1992-1234567-1");
  });

  test("returns original if not 15 digits", () => {
    expect(formatEmiratesId("abc")).toBe("abc");
    expect(formatEmiratesId("")).toBe("");
  });
});

describe("validatePassword", () => {
  test("accepts strong passwords", () => {
    const result = validatePassword("Abcdef1g");
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects short passwords", () => {
    const result = validatePassword("Ab1c");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password must be at least 8 characters long");
  });

  test("rejects passwords without uppercase", () => {
    const result = validatePassword("abcdef1gh");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password must contain at least one uppercase letter");
  });

  test("rejects passwords without lowercase", () => {
    const result = validatePassword("ABCDEF1G");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password must contain at least one lowercase letter");
  });

  test("rejects passwords without numbers", () => {
    const result = validatePassword("Abcdefgh");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Password must contain at least one number");
  });

  test("reports multiple errors", () => {
    const result = validatePassword("short");
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe("isValidName", () => {
  test("accepts valid names", () => {
    expect(isValidName("John")).toBe(true);
    expect(isValidName("Jean-Pierre")).toBe(true);
    expect(isValidName("Mary Jane")).toBe(true);
    expect(isValidName("O'Brien")).toBe(true);
  });

  test("rejects invalid names", () => {
    expect(isValidName("A")).toBe(false);
    expect(isValidName("")).toBe(false);
    expect(isValidName("John123")).toBe(false);
  });
});

describe("validateFileUpload", () => {
  const jpgFile = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
  const pdfFile = new File(["dummy"], "test.pdf", { type: "application/pdf" });
  const exeFile = new File(["dummy"], "test.exe", { type: "application/x-msdownload" });

  test("accepts jpg and pdf", () => {
    expect(validateFileUpload(jpgFile).isValid).toBe(true);
    expect(validateFileUpload(pdfFile).isValid).toBe(true);
  });

  test("rejects exe files", () => {
    const result = validateFileUpload(exeFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Only");
  });

  test("rejects oversized files", () => {
    const bigFile = new File(["x".repeat(6 * 1024 * 1024)], "big.jpg", { type: "image/jpeg" });
    const result = validateFileUpload(bigFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("5MB");
  });

  test("rejects missing file", () => {
    const result = validateFileUpload(null);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("No file");
  });
});

describe("validateLoginForm", () => {
  test("accepts valid login data", () => {
    const result = validateLoginForm({ email: "a@b.com", password: "123456" });
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test("rejects missing email", () => {
    const result = validateLoginForm({ email: "", password: "123456" });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  test("rejects invalid email format", () => {
    const result = validateLoginForm({ email: "bad", password: "123456" });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toContain("valid email");
  });

  test("rejects short password", () => {
    const result = validateLoginForm({ email: "a@b.com", password: "123" });
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toContain("6 characters");
  });
});

describe("validateSignupForm", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+971501234567",
    password: "StrongPass1",
    confirmPassword: "StrongPass1",
    emiratesId: "784199212345671",
  };

  test("accepts valid signup data", () => {
    const result = validateSignupForm(validData);
    expect(result.isValid).toBe(true);
  });

  test("rejects missing first name", () => {
    const result = validateSignupForm({ ...validData, firstName: "" });
    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toContain("required");
  });

  test("rejects invalid phone", () => {
    const result = validateSignupForm({ ...validData, phone: "abc" });
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toContain("UAE phone");
  });

  test("rejects password mismatch", () => {
    const result = validateSignupForm({ ...validData, confirmPassword: "Different1" });
    expect(result.isValid).toBe(false);
    expect(result.errors.confirmPassword).toContain("not match");
  });

  test("rejects invalid Emirates ID", () => {
    const result = validateSignupForm({ ...validData, emiratesId: "123" });
    expect(result.isValid).toBe(false);
    expect(result.errors.emiratesId).toContain("15 digits");
  });

  test("rejects weak password", () => {
    const result = validateSignupForm({ ...validData, password: "weak", confirmPassword: "weak" });
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });
});
