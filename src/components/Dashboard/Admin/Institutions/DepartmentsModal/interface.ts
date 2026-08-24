import { IDepartment } from "../interface";

export interface IDepartmentsModalProps {
  isOpen: boolean;
  institutionName: string;
  departments: IDepartment[];
  onClose: () => void;
}
