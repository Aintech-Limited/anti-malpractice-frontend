'use client';

import { useState, useCallback } from 'react';
import { IUsePaymentVerificationProps } from '../interface';
import { getVerificationEndpoint } from '../utils/paymentHelpers';

export const usePaymentVerification = ({
	provider,
	transactionRef,
	transactionId,
	materialType,
}: IUsePaymentVerificationProps) => {
	const [verifying, setVerifying] = useState(true);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [materialId, setMaterialId] = useState<string | null>(null);

	const verifyPayment = useCallback(async () => {
		try {
			setVerifying(true);

			const endpoint = getVerificationEndpoint(materialType);

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					provider,
					transactionRef,
					transactionId,
				}),
				credentials: 'include',
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setSuccess(true);
				setMaterialId(data.data.materialId);
			} else {
				setError(data.message || 'Payment verification failed');
			}
		} catch (err) {
			setError('An error occurred while verifying your payment');
			console.error('Verification error:', err);
		} finally {
			setVerifying(false);
		}
	}, [provider, transactionRef, transactionId, materialType]);

	return {
		verifying,
		success,
		error,
		materialId,
		verifyPayment,
	};
};
