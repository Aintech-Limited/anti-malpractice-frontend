import { SetStateAction } from "react";
import { IRole } from "../interface";

export interface IRolesTableProps {
  isLoading: boolean;
  roles: IRole[];
  searchTerm: string;
  openEditDialog: (role: IRole) => void;
  setDeleteTarget: (value: SetStateAction<IRole | null>) => void;
  setShowDeleteConfirm: (value: SetStateAction<boolean>) => void;
  getPermissionCountByModule: (role: IRole) => Record<string, number>;
}
