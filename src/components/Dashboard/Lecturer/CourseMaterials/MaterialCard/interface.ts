import { ICourseMaterial } from '../interface';

export interface IMaterialCardProps {
	material: ICourseMaterial;
	onView: (material: ICourseMaterial) => void;
	onEdit: (material: ICourseMaterial) => void;
	onDelete: (material: ICourseMaterial) => void;
}
