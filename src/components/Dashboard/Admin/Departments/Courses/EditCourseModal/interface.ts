import { ICourse } from '../interface';

export interface IEditCourseModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string, data: any) => Promise<void>;
	course: ICourse | null;
}
