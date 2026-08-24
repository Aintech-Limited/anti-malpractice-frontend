import { IDepartment } from "../interface";

export interface IDeleteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  department: IDepartment | null;
}
