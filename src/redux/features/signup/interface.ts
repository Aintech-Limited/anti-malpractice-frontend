import { ISignupFormValues } from "@/src/components/SignUp/SignupForm/interface";
import { UserRoleTypeEnumValue, SexTypeEnumValue } from "@/src/lib/enums";

export interface ISignupInitialState {
  signup: IFullSignupState | null;
  signupToken: IFullSignupTokenState | null;
  signupType: "email" | "google" | null;
}

export interface IFullSignupState extends ISignupFormValues {
  profileType?: UserRoleTypeEnumValue;
  sex?: SexTypeEnumValue;
  dob?: string;
  phoneContact?: string;
  country?: string;
  state?: string;
  departmentId?: string;
  institutionId?: string;
  institutionLevel?: string;
}

export interface IFullSignupTokenState {
  acceptTerms: boolean;
  profileType?: UserRoleTypeEnumValue;
  sex?: SexTypeEnumValue;
  dob?: string;
  phoneContact?: string;
  idToken: string;
  country?: string;
  state?: string;
  departmentId?: string;
  institutionId?: string;
  institutionLevel?: string;
}
