import { IFormData } from '../interface';

export interface IProfileFormProps {
	formData: IFormData;
	isEditing: boolean;
	onFormChange: (data: Partial<IFormData>) => void;
}
