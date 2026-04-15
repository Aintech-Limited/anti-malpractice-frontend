'use client';

import { useState } from 'react';
import { IExamRegistration } from '../interface';

export const useRegisteredExams = (
	initialExams: IExamRegistration[],
	initialMeta: any,
) => {
	const [exams, setExams] = useState<IExamRegistration[]>(initialExams);
	const [meta, setMeta] = useState(initialMeta);
	const [loading, setLoading] = useState(false);
	const [selectedExam, setSelectedExam] = useState<IExamRegistration | null>(
		null,
	);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	const updateExams = (newExams: IExamRegistration[], newMeta: any) => {
		setExams(newExams);
		setMeta(newMeta);
	};

	const setLoadingState = (isLoading: boolean) => {
		setLoading(isLoading);
	};

	const openPaymentModal = (exam: IExamRegistration) => {
		setSelectedExam(exam);
		setShowPaymentModal(true);
	};

	const closePaymentModal = () => {
		setShowPaymentModal(false);
		setSelectedExam(null);
	};

	const updateExamStatus = (
		examId: string,
		newStatus: IExamRegistration['registrationStatus'],
	) => {
		setExams((prev) =>
			prev.map((exam) =>
				exam.id === examId ? { ...exam, registrationStatus: newStatus } : exam,
			),
		);
	};

	return {
		exams,
		meta,
		loading,
		selectedExam,
		showPaymentModal,
		updateExams,
		setLoadingState,
		openPaymentModal,
		closePaymentModal,
		updateExamStatus,
	};
};
