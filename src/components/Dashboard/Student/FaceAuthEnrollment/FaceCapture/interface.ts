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

export interface IFaceVerificationResponse {
	success: boolean;
	message: string; // 'Face Verification successfull',
	data: {
		success: boolean;
		authenticated: boolean; // this decides if verification was successful
		similarity: number;
		confidence: number;
		qualityScore: number;
		requiresFallback: boolean;
	};
}
