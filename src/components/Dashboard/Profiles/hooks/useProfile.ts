"use client";

import { useState, useEffect } from "react";
import { IFormData, INotification } from "../interface";
import { createFormDataFromUser } from "../utils/profileHelpers";
import { NOTIFICATION_DURATION } from "../utils/profileConstants";
import { IUserModel } from "@/src/types/user";

export const useProfile = (initialUserData: IUserModel) => {
  const [user, setUser] = useState<IUserModel>(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<INotification | null>(null);
  const [formData, setFormData] = useState<IFormData>(() =>
    createFormDataFromUser(initialUserData),
  );

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(
        () => setNotification(null),
        NOTIFICATION_DURATION,
      );
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const updateUser = (updates: Partial<IUserModel>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updateFormData = (data: Partial<IFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(createFormDataFromUser(user));
  };

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    setIsEditing(false);
    resetFormData();
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const setLoadingState = (isLoading: boolean) => setLoading(isLoading);

  return {
    user,
    isEditing,
    loading,
    notification,
    formData,
    updateUser,
    updateFormData,
    startEditing,
    cancelEditing,
    showNotification,
    setLoadingState,
  };
};
