import { IPasswordData, IPasswordErrors } from "../interface";

export const validatePassword = (
  passwordData: IPasswordData,
  hasPassword: boolean,
): { isValid: boolean; errors: IPasswordErrors } => {
  const errors: IPasswordErrors = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  let isValid = true;

  // Old password validation
  if (hasPassword && !passwordData.oldPassword) {
    errors.oldPassword = "Old password is required";
    isValid = false;
  }

  // New password validation
  if (!passwordData.newPassword) {
    errors.newPassword = "New password is required";
    isValid = false;
  } else if (passwordData.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
    isValid = false;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
    errors.newPassword =
      "Password must contain uppercase, lowercase, and number";
    isValid = false;
  }

  // Confirm password validation
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  // Same as old password validation
  if (
    passwordData.newPassword &&
    passwordData.oldPassword === passwordData.newPassword
  ) {
    errors.newPassword = "New password cannot be the same as old password";
    isValid = false;
  }

  return { isValid, errors };
};

export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
};

export const getStrengthText = (strength: number): string => {
  const texts = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
  return texts[strength];
};

export const getStrengthColor = (strength: number): string => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ];
  return colors[strength];
};
