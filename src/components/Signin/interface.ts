import { TInstitutionLevelEnum, UserRoleTypeEnumValue } from "@/src/lib/enums";
import { IFormattedPermissionsResponse } from "@/src/redux/features/auth/interface";

export interface IPreparedUserDataResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  faceAuthEnabled: boolean;
  role: UserRoleTypeEnumValue;
  emailVerified: boolean;
  profileType: UserRoleTypeEnumValue;
  idRecorded: boolean;
  isIdVerified: boolean;
  hasPassword: boolean;
  sex: "MALE" | "FEMALE";
  dob: string;
  phoneContact: string;
  avatar: string;
  hasPIN: boolean;
  departmentId: string;
  departmentName: string;
  departmentRole: string;
  institutionId: string;
  institutionName: string;
  institutionLevel: TInstitutionLevelEnum | null;
  userRoles: IFormattedPermissionsResponse;
}

export interface ISigninUserResponse {
  data: IPreparedUserDataResponse;
  message: string;
  success: boolean;
}
