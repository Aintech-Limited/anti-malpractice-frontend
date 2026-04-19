'use client';

import { useState } from 'react';
import { useExams } from './hooks/useExams';
import { useExamFilters } from './hooks/useExamFilters';
import { IExam, IExamsProps } from './interface';
import { ExamsHeader } from './ExamsHeader/ExamsHeader';
import { ExamsStats } from './ExamsStats/ExamsStats';
import { ExamsFilters } from './ExamsFilters/ExamsFilters';
import { LoadingSkeleton } from './LoadingSkeleton/LoadingSkeleton';
import { ExamsList } from './ExamsList/ExamsList';
import { Pagination } from './Pagination/Pagination';
import { CreateExamModal } from './modals/CreateExamModal';
import { DeleteExamModal } from './modals/DeleteExamModal';
import { UpdateExamModal } from './modals/UpdateExamModal';
import { AddQuestionsModal } from './modals/AddQuestionsModal';
import { ViewQuestionsModal } from './modals/ViewQuestionsModal';

export default function Exams({
	initialExams,
	initialMeta,
	availableCourses,
	initialFilters,
}: IExamsProps) {
	const {
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
	} = useExams(initialExams, initialMeta);

	const {
		filters,
		showFilters,
		hasActiveFilters,
		setShowFilters,
		updateFilters,
		fetchPage,
		clearFilters,
	} = useExamFilters(initialFilters);

	const [stats, setStats] = useState({
		upcoming: initialExams.filter((e) => e.status === 'UPCOMING').length,
		ongoing: initialExams.filter((e) => e.status === 'ONGOING').length,
		completed: initialExams.filter((e) => e.status === 'COMPLETED').length,
	});

	const handlePageChange = async (page: number) => {
		setLoadingState(true);
		const data = await fetchPage(page);
		updateExams(data.data, { ...meta, totalItems: meta.totalItems + 1 });
		setStats({ ...stats, upcoming: stats.upcoming + 1 });
		setLoadingState(false);
	};

	const handleExamCreated = (newExam: IExam) => {
		updateExams([newExam, ...exams], meta);
		closeCreateModal();
	};

	const handleExamUpdated = (updatedExam: IExam) => {
		const updatedExams = exams.map((e) =>
			e.id === updatedExam.id ? updatedExam : e,
		);
		updateExams(updatedExams, meta);
		closeUpdateModal();
	};

	const handleExamDeleted = (deletedId: string) => {
		const filteredExams = exams.filter((e) => e.id !== deletedId);
		updateExams(filteredExams, { ...meta, totalItems: meta.totalItems - 1 });
		closeDeleteModal();
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<ExamsHeader onCreateExam={openCreateModal} />

				<ExamsStats
					totalExams={meta.totalItems}
					upcomingExams={stats.upcoming}
					ongoingExams={stats.ongoing}
					completedExams={stats.completed}
				/>

				<ExamsFilters
					filters={filters}
					showFilters={showFilters}
					hasActiveFilters={hasActiveFilters}
					onToggleFilters={() => setShowFilters(!showFilters)}
					onUpdateFilters={updateFilters}
					onClearFilters={clearFilters}
				/>

				{loading ? (
					<LoadingSkeleton />
				) : (
					<ExamsList
						exams={exams}
						onViewQuestions={openViewQuestionsModal}
						onAddQuestions={openQuestionsModal}
						onUpdate={openUpdateModal}
						onDelete={openDeleteModal}
						onViewRegistrations={viewRegistrations}
					/>
				)}

				<Pagination
					currentPage={meta.page}
					totalPages={meta.totalPages}
					hasNextPage={meta.hasNextPage}
					hasPreviousPage={meta.hasPreviousPage}
					onPageChange={handlePageChange}
				/>
			</div>

			{/* Modals */}
			{showCreateModal && (
				<CreateExamModal
					courses={availableCourses}
					onClose={closeCreateModal}
					onSuccess={handleExamCreated}
				/>
			)}

			{showDeleteModal && selectedExam && (
				<DeleteExamModal
					exam={selectedExam}
					onClose={closeDeleteModal}
					onSuccess={() => handleExamDeleted(selectedExam.id)}
				/>
			)}

			{showUpdateModal && selectedExam && (
				<UpdateExamModal
					exam={selectedExam}
					courses={availableCourses}
					onClose={closeUpdateModal}
					onSuccess={handleExamUpdated}
				/>
			)}

			{showQuestionsModal && selectedExam && (
				<AddQuestionsModal
					exam={selectedExam}
					onClose={closeQuestionsModal}
					onSuccess={() => {
						closeQuestionsModal();
						// TODO: refresh questions list
					}}
				/>
			)}

			{showViewQuestionsModal && selectedExam && (
				<ViewQuestionsModal
					exam={selectedExam}
					onClose={closeViewQuestionsModal}
				/>
			)}
		</div>
	);
}
