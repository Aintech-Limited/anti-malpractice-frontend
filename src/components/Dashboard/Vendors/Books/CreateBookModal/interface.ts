import { ICreateMaterialPayload } from '../../../Lecturer/CourseMaterials/interface';

export interface ICreateBookModalProps {
	onClose: () => void;
	onSuccess: (material: any) => void;
}

export type TCreateBookPayload = Omit<ICreateMaterialPayload, 'courseId'>;
