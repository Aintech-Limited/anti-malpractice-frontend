export interface ICheckoutPageProps {
	searchParams: Promise<{
		transaction_id?: string;
		tx_ref?: string;
		status?: string;
		reference?: string;
		materialType: string;
	}>;
}

export interface ICheckoutClientProps {
	provider: 'FLUTTERWAVE' | 'PAYSTACK';
	transactionRef: string;
	transactionId: string;
	materialType: string;
	status?: string;
}
