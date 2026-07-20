import { IDepartment } from "../interface";

export interface IDepartmentsListProps {
  departments: IDepartment[];
  onViewDetails: (department: IDepartment) => void;
}
