'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isUUID } from 'class-validator';
import { IDBExamQuestion } from '@/src/lib/db/interface';
// import { questions } from '../data';

export const useFetchExamQuestions = (
	examId: string,
	examAttemptId: string,
) => {
	const [allQuestions, setAllQuestions] = useState<IDBExamQuestion[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isUUID(examId)) return;

		const fetchExamsQuestions = async () => {
			try {
				const response = await fetch(
					`/api/v1/exams/students/live/questions?examId=${examId}&examAttemptId=${examAttemptId}`,
					{
						method: 'GET',
						credentials: 'include',
					},
				);
				const data = await response.json();
				if (response.status > 201) {
					setError(data.message);
					toast.error(data.message);
					return;
				}
				setAllQuestions(data.data.questions);
				// setAllQuestions(questions);
			} catch (error) {
				console.error('Error fetching exam questions: ', error);
				toast.error((error as Error).message);
				setError((error as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchExamsQuestions();
	}, [examId, examAttemptId]);

	return { allQuestions, loading, error };
};
