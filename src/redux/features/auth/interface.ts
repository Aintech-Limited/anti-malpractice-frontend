import { IUserModel } from "@/src/types/user";

export type TAuthStatus = "initializing" | "authenticated" | "unauthenticated";
export interface IAuthState {
  user: IUserModel | null;
  loading: boolean;
  status: TAuthStatus;
  userRoles: IFormattedPermissionsResponse | null;
  userRolesLoading: boolean;
}

export interface IPermission {
  name: string;
}

export interface IRolePermission {
  permission: IPermission;
}

export interface IRole {
  rolePermissions: IRolePermission[];
}

export interface IUserRoleEntry {
  role: IRole;
}

export type TActionKey = "create" | "read" | "update" | "delete";
export type TActionMap = Record<TActionKey, boolean>;
export type TPermissionsLey =
  | "vendor"
  | "student"
  | "course"
  | "lecturer"
  | "department"
  | "school"
  | "complaint"
  | "exam"
  | "book"
  | "finance"
  | "user"
  | "role";
export type TPermissionsMap = Record<TPermissionsLey, TActionMap>;

export interface IFormattedPermissionsResponse {
  permissions: TPermissionsMap;
}
