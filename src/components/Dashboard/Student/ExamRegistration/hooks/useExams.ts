'use client';

import { useState } from 'react';
import { IExam } from '../interface';

export const useExams = (initialExams: IExam[], initialMeta: any) => {
	const [exams, setExams] = useState<IExam[]>(initialExams);
	const [meta, setMeta] = useState(initialMeta);
	const [loading, setLoading] = useState(false);
	const [selectedExam, setSelectedExam] = useState<IExam | null>(null);
	const [showModal, setShowModal] = useState(false);

	const updateExams = (newExams: IExam[], newMeta: any) => {
		setExams(newExams);
		setMeta(newMeta);
	};

	const setLoadingState = (isLoading: boolean) => {
		setLoading(isLoading);
	};

	const openModal = (exam: IExam) => {
		setSelectedExam(exam);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setSelectedExam(null);
	};

	const updateExamRegistrationStatus = (
		examId: string,
		isRegistered: boolean,
		examRegistrationId?: string,
	) => {
		setExams((prev) =>
			prev.map((exam) =>
				exam.id === examId
					? { ...exam, isRegistered, examRegistrationId }
					: exam,
			),
		);
	};

	return {
		exams,
		meta,
		loading,
		selectedExam,
		showModal,
		updateExams,
		setLoadingState,
		openModal,
		closeModal,
		updateExamRegistrationStatus,
	};
};
