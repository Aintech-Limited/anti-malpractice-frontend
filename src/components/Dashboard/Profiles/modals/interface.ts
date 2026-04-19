import { IPasswordData, IPasswordErrors } from '../interface';

export interface IPasswordModalProps {
	hasPassword: boolean;
	showPassword: boolean;
	showOldPassword: boolean;
	showConfirmPassword: boolean;
	loading: boolean;
	passwordData: IPasswordData;
	passwordErrors: IPasswordErrors;
	onClose: () => void;
	onUpdatePassword: () => void;
	onPasswordDataChange: (data: Partial<IPasswordData>) => void;
	onTogglePassword: () => void;
	onToggleOldPassword: () => void;
	onToggleConfirmPassword: () => void;
}
