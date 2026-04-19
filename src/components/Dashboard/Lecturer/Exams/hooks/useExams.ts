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
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [showQuestionsModal, setShowQuestionsModal] = useState(false);
	const [showViewQuestionsModal, setShowViewQuestionsModal] = useState(false);
	const [showViewRegistrations, setShowViewRegistrations] = useState(false);

	const updateExams = (newExams: IExam[], newMeta: any) => {
		setExams(newExams);
		setMeta(newMeta);
	};

	const setLoadingState = (isLoading: boolean) => {
		setLoading(isLoading);
	};

	const openCreateModal = () => setShowCreateModal(true);
	const closeCreateModal = () => setShowCreateModal(false);

	const viewRegistrations = (exam: IExam) => {
		setSelectedExam(exam);
		setShowViewRegistrations(true);
	};
	const openDeleteModal = (exam: IExam) => {
		setSelectedExam(exam);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => {
		setShowDeleteModal(false);
		setSelectedExam(null);
	};

	const openUpdateModal = (exam: IExam) => {
		setSelectedExam(exam);
		setShowUpdateModal(true);
	};
	const closeUpdateModal = () => {
		setShowUpdateModal(false);
		setSelectedExam(null);
	};

	const openQuestionsModal = (exam: IExam) => {
		setSelectedExam(exam);
		setShowQuestionsModal(true);
	};
	const closeQuestionsModal = () => {
		setShowQuestionsModal(false);
		setSelectedExam(null);
	};

	const openViewQuestionsModal = (exam: IExam) => {
		setSelectedExam(exam);
		setShowViewQuestionsModal(true);
	};
	const closeViewQuestionsModal = () => {
		setShowViewQuestionsModal(false);
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
		showCreateModal,
		showDeleteModal,
		showUpdateModal,
		showQuestionsModal,
		showViewQuestionsModal,
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
