import { ILecturerAssignment } from '../interface';

export interface IUnassignConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	assignment: ILecturerAssignment | null;
}
