import { ICourse } from '../interface';

export interface IDeleteCourseModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string, archive?: boolean) => Promise<void>;
	course: ICourse | null;
}
