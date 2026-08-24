import { ISignupInstitution } from "@/src/components/SignUp/SignupForm/interface";
import { ICreateDepartmentData } from "../interface";

export interface IAddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ICreateDepartmentData) => Promise<void>;
}

export type TInstitution = Omit<ISignupInstitution, "departments">;
