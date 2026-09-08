import { isNumberString } from "class-validator";

export const validateSearchParamsPage = (page?: string) => {
  return !isNumberString(page) ? 1 : parseInt(page || "1");
};

export const validateSearchParamsLimit = (
  limit?: string,
  hasDefault?: number,
) => {
  return isNumberString(limit)
    ? parseInt(limit || "50")
    : typeof hasDefault !== "undefined"
      ? hasDefault
      : 50;
};

export const validateSearchParamsSortBy = (sortBy?: string) => {
  return ["createdAt", "updatedAt"].includes(sortBy ?? "")
    ? (sortBy ?? "")
    : "createdAt";
};

export const validateSearchParamsSortOrder = (sortOrder?: string) => {
  return ["DESC", "ASC"].includes(sortOrder ?? "")
    ? (sortOrder ?? "")
    : "createdAt";
};
