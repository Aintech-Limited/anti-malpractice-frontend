import { IDepartment } from '../interface';

export interface IDepartmentListItemProps {
	department: IDepartment;
	onViewDetails: (department: IDepartment) => void;
}
