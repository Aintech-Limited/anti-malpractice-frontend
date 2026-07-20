import { IDepartment, IUpdateDepartmentData } from "../interface";

export interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    id: string,
    data: Partial<IUpdateDepartmentData>,
  ) => Promise<void>;
  department: IDepartment | null;
}
