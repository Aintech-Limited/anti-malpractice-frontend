export interface IBlockStudentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	studentName: string;
	studentEmail: string;
}
