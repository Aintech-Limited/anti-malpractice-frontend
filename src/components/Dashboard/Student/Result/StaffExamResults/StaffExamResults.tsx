'use client';

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useExamResults } from './hooks/useExamResults';
import { IStaffExamResultsProps, IStaffFilters } from '../interface';
import { ExamResultPagination } from './ExamResultPagination/ExamResultPagination';
import { ResultsTable } from './ResultsTable/ResultsTable';
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel/AdvancedFiltersPanel';
import { SearchFilterBar } from './SearchFilterBar/SearchFilterBar';

export default function StaffExamResults({
	role,
	initialPage = 1,
	initialLimit = 50,
}: IStaffExamResultsProps) {
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [localFilters, setLocalFilters] = useState<IStaffFilters>({});

	const {
		data,
		meta,
		loading,
		error,
		exams,
		departments,

		setFilters,
		setPage,
		downloadResults,
		setError,
	} = useExamResults({
		role,
		initialFilters: {},
		initialPage,
		initialLimit,
	});

	const handleApplyFilters = () => {
		if (
			localFilters?.courseCode &&
			(localFilters?.courseCode?.length ?? 0) < 3
		) {
			setError((prev) => ({ ...prev, search: 'Example Math101, CS50' }));
			return;
		}
		setFilters(localFilters);
		setPage(1);
		setShowFilters(false);
	};

	const handleClearFilters = () => {
		setLocalFilters({});
		setFilters({});
		setPage(1);
		setShowFilters(false);
	};

	const handleExport = async (formatType: 'CSV' | 'PDF') => {
		setError((prev) => ({ ...prev, download: '' }));
		await downloadResults(formatType);
	};

	return (
		<div className="max-w-7xl mx-auto p-6 overflow-x-auto">
			{error.network && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-2">
					{error.network}
				</div>
			)}
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-800">
					Exam Results Management
				</h1>
				<p className="text-gray-500 mt-1">
					View and manage student exam results
				</p>
			</div>

			<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
				<SearchFilterBar
					handleApplyFilters={handleApplyFilters}
					localFilters={localFilters}
					setLocalFilters={setLocalFilters}
					setShowFilters={setShowFilters}
					showFilters={showFilters}
					error={error}
					setError={setError}
				/>

				{showFilters && (
					<AdvancedFiltersPanel
						handleApplyFilters={handleApplyFilters}
						handleClearFilters={handleClearFilters}
						localFilters={localFilters}
						setLocalFilters={setLocalFilters}
						departments={departments}
						exams={exams}
					/>
				)}
			</div>

			{loading ? (
				<div className="text-center py-12">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
					<p className="mt-2 text-gray-500">Loading results...</p>
				</div>
			) : data.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-lg border border-gray-200">
					<FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500">No exam results found</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					{error.download && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-2">
							{error.download}
						</div>
					)}
					<div className="flex justify-end gap-4 mb-4">
						<button
							onClick={() => handleExport('CSV')}
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
						>
							<Download size={16} />
							Export CSV
						</button>
						<button
							onClick={() => handleExport('PDF')}
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
						>
							<Download size={16} />
							Export PDF
						</button>
					</div>

					<ResultsTable results={data} />

					{meta && meta.totalPages > 1 && (
						<ExamResultPagination meta={meta} setPage={setPage} />
					)}
				</div>
			)}
		</div>
	);
}
