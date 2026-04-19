'use client';

import { useState, useEffect } from 'react';
import { useExamRegistrations } from './hooks/useExamRegistrations';
import { useRegistrationFilters } from './hooks/useRegistrationFilters';
import { calculateStatistics } from './utils/registrationHelpers';
import { exportToCSV } from './utils/registrationHelpers';
import { IExamRegistrationsProps } from './interface';
import { RegistrationsHeader } from './RegistrationsHeader/RegistrationsHeader';
import { RegistrationsStats } from './RegistrationsStats/RegistrationsStats';
import { RegistrationsFilters } from './RegistrationsFilters/RegistrationsFilters';
import { LoadingSkeleton } from '../LoadingSkeleton/LoadingSkeleton';
import { RegistrationsList } from './RegistrationsList/RegistrationsList';
import { Pagination } from '../Pagination/Pagination';

export default function ExamRegistrations({
	initialRegistrations,
	initialMeta,
	exam,
	examId,
	initialFilters,
}: IExamRegistrationsProps) {
	const { registrations, meta, loading, updateRegistrations, setLoadingState } =
		useExamRegistrations(initialRegistrations, initialMeta);

	const {
		filters,
		showFilters,
		hasActiveFilters,
		setShowFilters,
		updateFilters,
		fetchPage,
		clearFilters,
	} = useRegistrationFilters(examId, initialFilters);

	const [stats, setStats] = useState(() =>
		calculateStatistics(initialRegistrations),
	);

	useEffect(() => {
		setStats(calculateStatistics(registrations));
	}, [registrations]);

	const handlePageChange = async (page: number) => {
		setLoadingState(true);
		const data = await fetchPage(page);
		updateRegistrations(data.data, data.meta);
		setLoadingState(false);
	};

	const handleExport = () => {
		exportToCSV(registrations, exam?.title || 'Exam');
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<RegistrationsHeader
					examTitle={exam?.title || 'Loading...'}
					examId={examId}
					onExport={handleExport}
					totalRegistrations={meta.totalItems}
				/>

				<RegistrationsStats
					total={stats.total}
					registered={stats.byStatus.REGISTERED || 0}
					inProgress={stats.byStatus.IN_PROGRESS || 0}
					cancelled={
						(stats.byStatus.CANCELLED || 0) + (stats.byStatus.FAILED || 0)
					}
				/>

				<RegistrationsFilters
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
					<RegistrationsList registrations={registrations} />
				)}

				<Pagination
					currentPage={meta.page}
					totalPages={meta.totalPages}
					hasNextPage={meta.hasNextPage}
					hasPreviousPage={meta.hasPreviousPage}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
}
