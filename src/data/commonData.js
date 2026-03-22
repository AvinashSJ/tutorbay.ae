export const subjects = [
  "Math",
  "English",
  "Arabic",
  "Science",
  "Physics",
  "Chemistry",
  "ICT",
  "Moral Studies",
  "French"
];

export const curriculums = [
  "CBSE",
  "British",
  "American",
  "Other"
];

export const grades = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `Year ${i + 1}`
}));

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return {
    value: `${hour}:00`,
    label: `${hour}:00`
  };
}); 