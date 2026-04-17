import { TMaterialType, TProviderType } from '../interface';
import { VERIFICATION_ENDPOINTS, REDIRECT_PATHS } from './paymentConstants';

export const getVerificationEndpoint = (
	materialType: TMaterialType,
): string => {
	return VERIFICATION_ENDPOINTS[materialType];
};

export const getRedirectPath = (
	materialType: TMaterialType,
	materialId: string,
): string => {
	return REDIRECT_PATHS[materialType](materialId);
};

export const determineProvider = (transactionId?: string): TProviderType => {
	return transactionId ? 'FLUTTERWAVE' : 'PAYSTACK';
};

export const getTransactionReference = (
	tx_ref?: string,
	reference?: string,
): string => {
	return tx_ref ?? reference ?? '';
};

export const getTransactionId = (
	transaction_id?: string,
	reference?: string,
): string => {
	return transaction_id ?? reference ?? '';
};

export const isValidTransaction = (
	transactionId: string,
	transactionRef: string,
): boolean => {
	return !(!transactionId || !transactionRef);
};

export const formatTransactionRef = (ref: string): string => {
	if (ref.length <= 20) return ref;
	return `${ref.slice(0, 10)}...${ref.slice(-10)}`;
};
