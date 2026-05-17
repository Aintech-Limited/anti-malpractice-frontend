export interface IFaceCaptureProps {
	onEnrollmentComplete?: (data: {
		success: boolean;
		backupCodes?: string[];
		message: string;
	}) => void;
	onCancel?: () => void;
	isOpen?: boolean;
	isVerification?: boolean;
}

export interface EnrollmentStep {
	id:
		| 'instructions'
		| 'camera'
		| 'capture'
		| 'processing'
		| 'success'
		| 'error';
	title: string;
	description: string;
}

export interface BackupCode {
	id: string;
	code: string;
	used: boolean;
}
