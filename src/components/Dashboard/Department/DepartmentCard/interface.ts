import { IDepartment } from "../interface";

export interface IDepartmentCardProps {
  department: IDepartment;
  onViewDetails: (department: IDepartment) => void;
}
