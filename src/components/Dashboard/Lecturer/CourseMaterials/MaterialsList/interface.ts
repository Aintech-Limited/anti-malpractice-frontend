import { ICourseMaterial } from '../interface';

export interface IMaterialsListProps {
	materials: ICourseMaterial[];
	onView: (material: ICourseMaterial) => void;
	onEdit: (material: ICourseMaterial) => void;
	onDelete: (material: ICourseMaterial) => void;
}
