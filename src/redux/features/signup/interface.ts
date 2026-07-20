import { ISignupFormValues } from "@/src/components/SignUp/SignupForm/interface";
import { ProfileTypeEnumValue, SexTypeEnumValue } from "@/src/lib/enums";

export interface ISignupInitialState {
  signup: IFullSignupState | null;
  signupToken: IFullSignupTokenState | null;
  signupType: "email" | "google" | null;
}

export interface IFullSignupState extends ISignupFormValues {
  profileType?: ProfileTypeEnumValue;
  sex?: SexTypeEnumValue;
  dob?: string;
  phoneContact?: string;
}

export interface IFullSignupTokenState {
  acceptTerms: boolean;
  profileType?: ProfileTypeEnumValue;
  sex?: SexTypeEnumValue;
  dob?: string;
  phoneContact?: string;
  idToken: string;
}
