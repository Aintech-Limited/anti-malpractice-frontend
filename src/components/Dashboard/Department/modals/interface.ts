import { IDepartment, IDepartmentStats } from '../interface';

export interface IDepartmentModalProps {
	department: IDepartment;
	stats: IDepartmentStats;
	loading: boolean;
	error: string | null;
	onClose: () => void;
}
