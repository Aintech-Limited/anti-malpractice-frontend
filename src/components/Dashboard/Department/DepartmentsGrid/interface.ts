import { IDepartment } from "../interface";

export interface IDepartmentsGridProps {
  departments: IDepartment[];
  onViewDetails: (department: IDepartment) => void;
}
