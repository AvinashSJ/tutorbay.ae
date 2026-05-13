// Form validation utilities

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// UAE phone validation (starts with +971 or 05x)
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+971|971|05|5)?\d{7,9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Emirates ID validation
// Format: 15 digits, typically: 784-XXXX-XXXXXXX-X
// Country code (784) + Emirate code (4 digits) + Personal number (7 digits) + Check digit (1 digit)
export const isValidEmiratesId = (id) => {
  if (!id) return false;

  // Remove all non-digit characters (dashes, spaces, etc.)
  const cleanId = id.replace(/\D/g, '');

  // Must be exactly 15 digits
  if (cleanId.length !== 15) return false;

  // Should start with 784 (UAE country code)
  if (!cleanId.startsWith('784')) return false;

  // Basic format validation passed
  return true;
};

// Format Emirates ID with dashes for display
export const formatEmiratesId = (id) => {
  if (!id) return '';

  const cleanId = id.replace(/\D/g, '');

  if (cleanId.length === 15) {
    return `${cleanId.slice(0, 3)}-${cleanId.slice(3, 7)}-${cleanId.slice(7, 14)}-${cleanId.slice(14)}`;
  }

  return id;
};

// Password strength validation
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Name validation (letters, spaces, hyphens, apostrophes only)
export const isValidName = (name) => {
  const nameRegex = /^[A-Za-z\s\-']{2,50}$/;
  return nameRegex.test(name);
};

// Validate login form
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate signup form
export const validateSignupForm = (formData, userType) => {
  const errors = {};

  // First Name
  if (!formData.firstName) {
    errors.firstName = 'First name is required';
  } else if (!isValidName(formData.firstName)) {
    errors.firstName = 'First name must contain only letters and be 2-50 characters';
  }

  // Last Name
  if (!formData.lastName) {
    errors.lastName = 'Last name is required';
  } else if (!isValidName(formData.lastName)) {
    errors.lastName = 'Last name must contain only letters and be 2-50 characters';
  }

  // Email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone
  if (!formData.phone) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid UAE phone number (e.g., 0501234567 or +971501234567)';
  }

  // Password
  if (!formData.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]; // Show first error
    }
  }

  // Confirm Password
  if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Emirates ID validation
  if (!formData.emiratesId) {
    errors.emiratesId = 'Emirates ID is required';
  } else if (!isValidEmiratesId(formData.emiratesId)) {
    errors.emiratesId = 'Emirates ID must be 15 digits (starting with 784)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate file upload
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSizeMB = 5,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'],
  } = options;

  if (!file) return { isValid: false, error: 'No file selected' };

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `Only ${allowedExtensions.join(', ')} files are allowed` };
  }

  return { isValid: true, error: null };
};
