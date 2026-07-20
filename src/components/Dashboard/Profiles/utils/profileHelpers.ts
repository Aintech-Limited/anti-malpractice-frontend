"use client";

import { IUserModel } from "@/src/types/user";
import { IFormData } from "../interface";

export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  const parts = dateString.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return "";
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "Not provided";
  return dateString;
};

export const formatBooleanValue = (value: boolean): string => {
  return value ? "Yes" : "No";
};

export const formatValue = (value: string | boolean): string => {
  if (typeof value === "boolean") return formatBooleanValue(value);
  if (value === "USER") return "STUDENT";
  return value || "Not provided";
};

export const createFormDataFromUser = (user: IUserModel): IFormData => ({
  firstName: user.firstName,
  lastName: user.lastName,
  dob: user.dob ?? "",
  sex: user.sex ?? "",
  phoneContact: user.phoneContact ?? "",
});

export const convertDateToDobFormat = (dateString: string): string => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};
