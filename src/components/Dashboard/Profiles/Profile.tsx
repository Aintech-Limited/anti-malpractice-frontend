"use client";

import { useProfile } from "./hooks/useProfile";
import { usePassword } from "./hooks/usePassword";
import { IProfileClientProps } from "./interface";
import NotificationToast from "../Lecturer/Accounts/NotificationToast/NotificationToast";
import { ProfileHeader } from "./ProfileHeader/ProfileHeader";
import { EmailBanner } from "./EmailBanner/EmailBanner";
import { ProfileForm } from "./ProfileForm/ProfileForm";
import { PasswordModal } from "./modals/PasswordModal";
import { InfoGrid } from "./InfoGrid/InfoGrid";
import { PasswordSection } from "./PasswordSection/PasswordSection";
import AvatarUploader from "./AvatarUploader/AvatarUploader";
import DepartmentRequest from "./DepartmentRequest/DepartmentRequest";
import { useEffect, useState } from "react";
import { IDepartment } from "./DepartmentRequest/interface";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { InstitutionLevelEnum, UserRoleTypeEnum } from "@/src/lib/enums";
import { useAppDispatch } from "@/src/redux/reduxStore";
import {
  hideLoading,
  showLoading,
} from "@/src/redux/features/globalLoadingSlice/globalLoadingSlice";
import { toast } from "react-toastify";
import { data } from "framer-motion/client";

export default function Profile({ initialUserData }: IProfileClientProps) {
  const dispatch = useAppDispatch();
  const { user: userData } = useAuth();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const {
    user,
    isEditing,
    loading: profileLoading,
    notification,
    formData,
    updateUser,
    updateFormData,
    startEditing,
    cancelEditing,
    showNotification,
    setLoadingState: setProfileLoading,
  } = useProfile(initialUserData);

  const {
    showPasswordModal,
    showPassword,
    showOldPassword,
    showConfirmPassword,
    loading: passwordLoading,
    passwordData,
    passwordErrors,
    updatePasswordData,
    validateAndGetErrors,
    openModal: openPasswordModal,
    closeModal: closePasswordModal,
    setShowPassword,
    setShowOldPassword,
    setShowConfirmPassword,
    setLoadingState: setPasswordLoading,
  } = usePassword(user.hasPassword ?? false);

  useEffect(() => {
    // allow only for students in tertiary institutions
    if (
      userData?.role !== UserRoleTypeEnum.STUDENT ||
      userData?.departmentId ||
      user?.institutionLevel !== InstitutionLevelEnum.TERTIARY
    )
      return;
    dispatch(showLoading("Fetching Departments"));

    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          `/api/v1/departments?institutionId=${user?.institutionId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (response.status === 500) throw new Error("");
          const error = await response.json();
          throw new Error(error?.message ?? "Department retrieval failed");
        }

        const data = await response.json();

        if (!data.success) throw new Error(data.message);

        setDepartments(data?.data ?? []);
      } catch (error: any) {
        toast.error(error?.message ?? "Could not retrieve departments.");
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchDepartments();
  }, [
    userData?.departmentId,
    userData?.role,
    dispatch,
    user?.institutionId,
    user?.institutionLevel,
  ]);

  const handleUpdateProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        updateUser({
          ...user,
          ...formData,
          sex: (user.sex ?? formData.sex) as "FEMALE" | "MALE",
        });
        cancelEditing();
        showNotification("success", "Profile updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      showNotification(
        "error",
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validateAndGetErrors()) return;

    setPasswordLoading(true);
    try {
      const response = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: user.hasPassword ? passwordData.oldPassword : undefined,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        closePasswordModal();
        updateUser({ ...user, hasPassword: true });
        showNotification("success", "Password updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update password");
      }
    } catch (error) {
      showNotification(
        "error",
        error instanceof Error ? error.message : "Failed to update password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <NotificationToast notification={notification} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          isEditing={isEditing}
          loading={profileLoading}
          onEdit={startEditing}
          onCancel={cancelEditing}
          onSave={handleUpdateProfile}
        />

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <EmailBanner
            email={user.email}
            isVerified={user.emailVerified ?? false}
          />

          <div className="p-8">
            <ProfileForm
              formData={formData}
              isEditing={isEditing}
              onFormChange={updateFormData}
            />

            <PasswordSection
              hasPassword={user.hasPassword ?? false}
              onOpenModal={openPasswordModal}
            />

            <InfoGrid
              user={{
                ...user,
                departmentId: userData?.departmentId ?? user?.departmentId,
                departmentName:
                  userData?.departmentName ?? user?.departmentName,
                departmentRole:
                  userData?.departmentRole ?? user?.departmentRole,
              }}
              institution={false}
            />
            {!user?.departmentId &&
              user?.institutionLevel === InstitutionLevelEnum.TERTIARY && (
                <DepartmentRequest departments={departments} />
              )}

            <AvatarUploader avatar={user?.avatar} />
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal
          hasPassword={user.hasPassword ?? false}
          showPassword={showPassword}
          showOldPassword={showOldPassword}
          showConfirmPassword={showConfirmPassword}
          loading={passwordLoading}
          passwordData={passwordData}
          passwordErrors={passwordErrors}
          onClose={closePasswordModal}
          onUpdatePassword={handleUpdatePassword}
          onPasswordDataChange={updatePasswordData}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleOldPassword={() => setShowOldPassword(!showOldPassword)}
          onToggleConfirmPassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
        />
      )}
    </div>
  );
}
