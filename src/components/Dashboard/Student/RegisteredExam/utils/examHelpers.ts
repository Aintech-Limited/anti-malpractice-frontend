'use client';

import {
	IExamRegistration,
	IPaymentInitiatePayload,
	IPaymentInitiateResponse,
} from '../interface';
import { REGISTRATION_STATUS } from './examConstants';

export const getRegistrationStatus = (status: string) => {
	return (
		REGISTRATION_STATUS[status as keyof typeof REGISTRATION_STATUS] ||
		REGISTRATION_STATUS.IN_PROGRESS
	);
};

export const canMakePayment = (status: string): boolean => {
	return status === 'IN_PROGRESS';
};

export const calculateStats = (exams: IExamRegistration[]) => {
	const total = exams.length;
	const inProgress = exams.filter(
		(e) => e.registrationStatus === 'IN_PROGRESS',
	).length;
	const registered = exams.filter(
		(e) => e.registrationStatus === 'REGISTERED',
	).length;
	const failed = exams.filter((e) => e.registrationStatus === 'FAILED').length;

	return { total, inProgress, registered, failed };
};

export const initiatePayment = async (
	examId: string,
	provider: 'FLUTTERWAVE' = 'FLUTTERWAVE',
): Promise<IPaymentInitiateResponse> => {
	const payload: IPaymentInitiatePayload = {
		materialId: examId,
		materialType: 'EXAM_REGISTRATION',
		provider,
	};

	try {
		const response = await fetch(
			'/api/v1/purchase/initiate/exam-registrations',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			},
		);

		const data = await response.json();
		console.log('data: ', data);

		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
