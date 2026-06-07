'use client';

import { useState, useEffect } from 'react';
import { IExam, IExamsApiResponse } from '../interface';
import { useRouter } from 'next/navigation';

export const useExams = (initialExams: IExam[], initialMeta: any) => {
	const router = useRouter();

	const [exams, setExams] = useState<IExam[]>(initialExams);
	const [meta, setMeta] = useState<IExamsApiResponse['meta']>(initialMeta);
	const [loading, setLoading] = useState(false);
	const [selectedExam, setSelectedExam] = useState<IExam | null>(null);

	const [showViewRegistrations, setShowViewRegistrations] = useState(false);

	const [modalStage, setModalStage] = useState<
		| 'create_exam'
		| 'delete_exam'
		| 'update_exam'
		| 'show_questions'
		| 'view_questions'
		| 'add_questions'
		| ''
	>('');

	const updateExams = (
		newExams: IExam[],
		newMeta: any,
		isNew: boolean = false,
	) => {
		setExams(newExams);
		if (isNew) {
			setMeta((prevMeta) => ({
				...prevMeta,
				totalItems: prevMeta.totalItems + 1,
			}));
			return;
		}
		setMeta(newMeta);
	};

	const setLoadingState = (isLoading: boolean) => {
		setLoading(isLoading);
	};

	const openCreateModal = () => {
		setModalStage('create_exam');
	};
	const closeCreateModal = () => {
		setModalStage('');
	};

	const viewRegistrations = (exam: IExam) => {
		setSelectedExam(exam);
		setShowViewRegistrations(true);
	};
	const openDeleteModal = (exam: IExam) => {
		setSelectedExam(exam);
		setModalStage('delete_exam');
	};
	const closeDeleteModal = () => {
		setModalStage('');
		setSelectedExam(null);
	};

	const openUpdateModal = (exam: IExam) => {
		setSelectedExam(exam);
		setModalStage('update_exam');
	};
	const closeUpdateModal = () => {
		setSelectedExam(null);
		setModalStage('');
	};

	const openQuestionsModal = (exam: IExam) => {
		setSelectedExam(exam);
		setModalStage('add_questions');
	};
	const closeQuestionsModal = () => {
		setModalStage('');
		setSelectedExam(null);
	};

	const openViewQuestionsModal = (exam: IExam) => {
		setSelectedExam(exam);
		setModalStage('view_questions');
	};
	const closeViewQuestionsModal = () => {
		setModalStage('');
		setSelectedExam(null);
	};

	useEffect(() => {
		if (showViewRegistrations && selectedExam?.id) {
			router.push(
				`/dashboard/lecturers/exams/${selectedExam?.id}/registrations`,
			);
		}
	}, [showViewRegistrations, router, selectedExam?.id]);

	return {
		exams,
		meta,
		loading,
		selectedExam,
		modalStage,

		viewRegistrations,
		updateExams,
		setLoadingState,
		openCreateModal,
		closeCreateModal,
		openDeleteModal,
		closeDeleteModal,
		openUpdateModal,
		closeUpdateModal,
		openQuestionsModal,
		closeQuestionsModal,
		openViewQuestionsModal,
		closeViewQuestionsModal,
	};
};
