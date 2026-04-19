import { IAccount } from '../interface';

export interface IDeleteAccountModalProps {
	account: IAccount | null;
	pin: string[];
	loading: boolean;
	onPinChange: (index: number, value: string) => void;
	onConfirm: () => void;
	onCancel: () => void;
}

export interface ISetupPINModalProps {
	newPIN: string[];
	confirmPIN: string[];
	loading: boolean;
	onNewPINChange: (index: number, value: string) => void;
	onConfirmPINChange: (index: number, value: string) => void;
	onConfirm: () => void;
	onCancel: () => void;
}

export interface IChangePINModalProps {
	loading: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export interface IVerifyTokenModalProps {
	token: string[];
	newPIN: string[];
	loading: boolean;
	onTokenChange: (index: number, value: string) => void;
	onPINChange: (index: number, value: string) => void;
	onConfirm: () => void;
	onCancel: () => void;
	onResendOTP: () => Promise<void>;
}
