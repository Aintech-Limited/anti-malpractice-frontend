import { TDepartmentUserRoleEnum, UserRoleTypeEnumValue } from "../lib/enums";

export interface IUserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  faceAuthEnabled: boolean;
  emailVerified?: boolean | null;
  role?: UserRoleTypeEnumValue;
  profileType?: UserRoleTypeEnumValue;
  idRecorded?: boolean;
  isIdVerified?: boolean;
  avatarURL?: string;
  hasPassword?: boolean;
  sex?: "MALE" | "FEMALE";
  dob?: string;
  phoneContact?: string;
  hasPIN?: boolean;
  departmentId?: string;
  departmentName?: string;
  departmentRole?: TDepartmentUserRoleEnum;
  institutionId?: string;
  institutionName?: string;
  avatar?: string | null;
}
