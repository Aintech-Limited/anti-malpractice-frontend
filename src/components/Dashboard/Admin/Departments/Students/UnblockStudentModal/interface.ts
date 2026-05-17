export interface IUnblockStudentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	studentName: string;
	studentEmail: string;
}
