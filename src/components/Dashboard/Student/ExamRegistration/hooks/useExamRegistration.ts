'use client';

import { useState } from 'react';
import { IExamRegistrationPayload } from '../interface';

export const useExamRegistration = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const registerExam = async (
		payload: IExamRegistrationPayload,
	): Promise<string | null> => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/v1/exam-registrations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (data.success) {
				return data.data.id;
			} else {
				setError(data.message || 'Failed to register for exam');
				return null;
			}
		} catch (err) {
			setError('An error occurred. Please try again.');
			return null;
		} finally {
			setLoading(false);
		}
	};

	return {
		registerExam,
		loading,
		error,
		setError,
	};
};
