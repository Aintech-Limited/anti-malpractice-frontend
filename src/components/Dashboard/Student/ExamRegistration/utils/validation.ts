export const validateRegistrationForm = (
  level: string,
  semester: string,
  matricNo?: string,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!level) {
    errors.level = "Please select your level";
  }

  if (!semester) {
    errors.semester = "Please select semester";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const generateAcademicSemesters = (): string[] => {
  const currentYear = new Date().getFullYear();
  const semesters: string[] = [];

  for (let i = 0; i < 2; i++) {
    const year = currentYear + i;
    semesters.push(`${year}/${year + 1} First Semester`);
    semesters.push(`${year}/${year + 1} Second Semester`);
  }

  return semesters;
};
