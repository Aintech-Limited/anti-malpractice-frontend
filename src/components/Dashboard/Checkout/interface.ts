export interface ICheckoutPageProps {
	searchParams: Promise<{
		transaction_id?: string;
		tx_ref?: string;
		status?: string;
		reference?: string;
		materialType: TMaterialType;
	}>;
}

export interface ICheckoutProps {
	provider: 'FLUTTERWAVE' | 'PAYSTACK';
	transactionRef: string;
	transactionId: string;
	materialType: string;
	status?: string;
}

export interface IVerifyPaymentResponse {
	success: boolean;
	message: string;
	data: {
		materialId: string;
	};
}

export type TMaterialType = 'EXAM_REGISTRATION' | 'COURSE_MATERIAL';
export type TProviderType = 'FLUTTERWAVE' | 'PAYSTACK';

export interface IUsePaymentVerificationProps {
	provider: string;
	transactionRef: string;
	transactionId: string;
	materialType: TMaterialType;
}
