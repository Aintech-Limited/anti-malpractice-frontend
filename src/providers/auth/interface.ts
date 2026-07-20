import { UserRoleTypeEnumValue } from "@/src/lib/enums";
import { IUserModel } from "@/src/types/user";
import { ReactNode } from "react";

export interface IAuthContextType {
  user: IUserModel | null;
  signIn: (user: IUserModel) => void;
  loading: boolean;
  signOut: () => void;
  updateUser: (userData: Partial<IUserModel>) => void;
  isAuthenticated: boolean;
  getUserRole: () => UserRoleTypeEnumValue | null;
}

export interface IAuthProviderProps {
  children: ReactNode;
  userData: IUserModel | null;
}
