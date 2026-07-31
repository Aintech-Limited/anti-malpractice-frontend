import { IInstitution } from '../interface';

export interface ICreateUpdateInstitutionModalProps {
	isOpen: boolean;
	initialData: IInstitution | null;
	onClose: () => void;
	onSuccess: () => void;
}
