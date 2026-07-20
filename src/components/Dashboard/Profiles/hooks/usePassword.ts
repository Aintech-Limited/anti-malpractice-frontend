"use client";

import { useState } from "react";
import { IPasswordData, IPasswordErrors } from "../interface";
import { validatePassword } from "../utils/passwordValidation";

export const usePassword = (hasPassword: boolean) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState<IPasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<IPasswordErrors>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updatePasswordData = (data: Partial<IPasswordData>) => {
    setPasswordData((prev) => ({ ...prev, ...data }));
  };

  const resetPasswordData = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const validateAndGetErrors = (): boolean => {
    const { isValid, errors } = validatePassword(passwordData, hasPassword);
    setPasswordErrors(errors);
    return isValid;
  };

  const openModal = () => setShowPasswordModal(true);
  const closeModal = () => {
    setShowPasswordModal(false);
    resetPasswordData();
  };

  const setLoadingState = (isLoading: boolean) => setLoading(isLoading);

  return {
    showPasswordModal,
    showPassword,
    showOldPassword,
    showConfirmPassword,
    loading,
    passwordData,
    passwordErrors,
    updatePasswordData,
    resetPasswordData,
    validateAndGetErrors,
    openModal,
    closeModal,
    setShowPassword,
    setShowOldPassword,
    setShowConfirmPassword,
    setLoadingState,
  };
};
