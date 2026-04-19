'use client';

import { useEffect, useState } from 'react';
import { IRegisteredExamsProps } from './interface';
import { useRegisteredExams } from './hooks/useRegisteredExams';
import { useExamFilters } from './hooks/useExamFilters';
import { calculateStats } from './utils/examHelpers';
import { ExamsHeader } from './ExamsHeader/ExamsHeader';
import { ExamsStats } from './ExamsStats/ExamsStats';
import { ExamsFilters } from './ExamsFilters/ExamsFilters';
import { LoadingSkeleton } from './LoadingSkeleton/LoadingSkeleton';
import { ExamsList } from './ExamsList/ExamsList';
import { Pagination } from './Pagination/Pagination';
import { PaymentModal } from './modals/PaymentModal';

export default function RegisteredExams({
	initialExams,
	initialMeta,
	initialFilters,
}: IRegisteredExamsProps) {
	const {
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
	} = useRegisteredExams(initialExams, initialMeta);

	const {
		filters,
		showFilters,
		hasActiveFilters,
		setShowFilters,
		updateFilters,
		fetchPage,
		clearFilters,
	} = useExamFilters(initialFilters);

	const [stats, setStats] = useState(() => calculateStats(initialExams));

	useEffect(() => {
		setStats(calculateStats(exams));
	}, [exams]);

	const handlePageChange = async (page: number) => {
		setLoadingState(true);
		const data = await fetchPage(page);
		updateExams(data.data, data.meta);
		setLoadingState(false);
	};

	const handlePaymentSuccess = () => {
		if (selectedExam) {
			updateExamStatus(selectedExam.id, 'REGISTERED');
		}
		closePaymentModal();
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<ExamsHeader totalExams={meta.totalItems} />

				<ExamsStats
					total={stats.total}
					inProgress={stats.inProgress}
					registered={stats.registered}
					failed={stats.failed}
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
					<ExamsList exams={exams} onContinuePayment={openPaymentModal} />
				)}

				<Pagination
					currentPage={meta.page}
					totalPages={meta.totalPages}
					hasNextPage={meta.hasNextPage}
					hasPreviousPage={meta.hasPreviousPage}
					onPageChange={handlePageChange}
				/>
			</div>

			{/* Payment Modal */}
			{showPaymentModal && selectedExam && (
				<PaymentModal
					exam={selectedExam}
					onClose={closePaymentModal}
					onSuccess={handlePaymentSuccess}
				/>
			)}
		</div>
	);
}
