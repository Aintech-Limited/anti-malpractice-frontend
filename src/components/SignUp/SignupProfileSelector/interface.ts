import { UserRoleTypeEnumValue } from "@/src/lib/enums";
import { ISignupFormProps } from "../SignupForm/interface";

export type TChooseProfileProps = ISignupFormProps;

export interface IChooseProfileData {
  id: number;
  icon: string;
  text: string;
  type: UserRoleTypeEnumValue;
}
