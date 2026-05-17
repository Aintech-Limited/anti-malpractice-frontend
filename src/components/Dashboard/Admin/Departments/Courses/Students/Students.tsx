'use client';

import { useState } from 'react';
import {
	Search,
	ChevronLeft,
	ChevronRight,
	Filter,
	X as CloseIcon,
	Users,
	BookOpen,
} from 'lucide-react';
import {
	ICourseStudent,
	IStudentFilters,
	IStudentsClientProps,
	IStudentsResponse,
} from './interface';
import StudentCard from './StudentCard/StudentCard';

export default function StudentsClient({
	courseId,
	initialData,
	initialPage,
	limit,
}: IStudentsClientProps) {
	const [students, setStudents] = useState<ICourseStudent[]>(initialData.data);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [total, setTotal] = useState(initialData.meta.totalItems);
	const [hasNextPage, setHasNextPage] = useState(initialData.meta.hasNextPage);
	const [hasPreviousPage, setHasPreviousPage] = useState(
		initialData.meta.hasPreviousPage,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<IStudentFilters>({
		page: initialPage,
		limit: limit,
	});
	const [showFilters, setShowFilters] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const loadStudents = async (
		page: number,
		currentFilters: IStudentFilters,
	) => {
		setLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams();
			params.append('page', String(page));
			params.append('limit', String(limit));
			if (currentFilters.search) params.append('search', currentFilters.search);
			if (currentFilters.faceAuthEnabled !== undefined)
				params.append(
					'faceAuthEnabled',
					String(currentFilters.faceAuthEnabled),
				);
			if (currentFilters.isBlocked !== undefined)
				params.append('isBlocked', String(currentFilters.isBlocked));
			if (currentFilters.emailVerified !== undefined)
				params.append('emailVerified', String(currentFilters.emailVerified));
			if (currentFilters.level)
				params.append('level', String(currentFilters.level));

			const response = await fetch(
				`/api/v1/admin/courses/${courseId}/students?${params.toString()}`,
				{
					cache: 'no-store',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch students: ${response.statusText}`);
			}

			const result: IStudentsResponse = await response.json();

			if (result.success) {
				setStudents(result.data);
				setCurrentPage(result.meta.page);
				setTotal(result.meta.totalItems);
				setHasNextPage(result.meta.hasNextPage);
				setHasPreviousPage(result.meta.hasPreviousPage);
			} else {
				setError(result.message);
			}
		} catch (err) {
			console.error('Error fetching students:', err);
			setError(err instanceof Error ? err.message : 'Failed to fetch students');
		} finally {
			setLoading(false);
		}
	};

	const handleNextPage = () => {
		if (hasNextPage && !loading) {
			const newPage = currentPage + 1;
			setFilters({ ...filters, page: newPage });
			loadStudents(newPage, { ...filters, page: newPage });
		}
	};

	const handlePreviousPage = () => {
		if (hasPreviousPage && !loading) {
			const newPage = currentPage - 1;
			setFilters({ ...filters, page: newPage });
			loadStudents(newPage, { ...filters, page: newPage });
		}
	};

	const handleSearch = () => {
		const newFilters = { ...filters, search: searchTerm || undefined, page: 1 };
		setFilters(newFilters);
		loadStudents(1, newFilters);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const handleApplyFilters = (newFilters: Partial<IStudentFilters>) => {
		const updatedFilters = { ...filters, ...newFilters, page: 1 };
		setFilters(updatedFilters);
		loadStudents(1, updatedFilters);
		setShowFilters(false);
	};

	const handleClearFilters = () => {
		const clearedFilters = { page: 1, limit: limit };
		setFilters(clearedFilters);
		setSearchTerm('');
		loadStudents(1, clearedFilters);
		setShowFilters(false);
	};

	const getStatusCounts = () => {
		const faceAuthEnabled = students.filter((s) => s.faceAuthEnabled).length;
		const blocked = students.filter((s) => s.isBlocked).length;
		const emailVerified = students.filter((s) => s.emailVerified).length;
		return { faceAuthEnabled, blocked, emailVerified, total: students.length };
	};

	const counts = getStatusCounts();

	return (
		<div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
			{/* Header Section */}
			<div className="mb-8">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 text-sm">
							<Users size={16} className="text-gray-400" />
							<span className="font-semibold text-gray-700">{total}</span>
							<span className="text-gray-500">Enrolled Students</span>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
					<div className="text-2xl font-bold text-gray-800">{counts.total}</div>
					<div className="text-sm text-gray-500">Total Students</div>
				</div>
				<div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-100">
					<div className="text-2xl font-bold text-green-700">
						{counts.emailVerified}
					</div>
					<div className="text-sm text-green-600">Email Verified</div>
				</div>
				<div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100">
					<div className="text-2xl font-bold text-blue-700">
						{counts.faceAuthEnabled}
					</div>
					<div className="text-sm text-blue-600">Face Auth Enabled</div>
				</div>
				<div className="bg-red-50 rounded-lg p-4 shadow-sm border border-red-100">
					<div className="text-2xl font-bold text-red-700">
						{counts.blocked}
					</div>
					<div className="text-sm text-red-600">Blocked</div>
				</div>
			</div>

			{/* Search and Filter Bar */}
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
				<div className="flex items-center gap-3 flex-1 max-w-md">
					<div className="relative flex-1">
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Search by name, email"
							className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
					</div>
					<button
						onClick={handleSearch}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						Search
					</button>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`p-2 border rounded-lg transition flex items-center gap-2 ${
							showFilters
								? 'bg-blue-100 border-blue-300 text-blue-600'
								: 'bg-white border-gray-200 text-gray-400'
						}`}
					>
						<Filter size={18} />
						<span className="text-sm font-medium text-gray-600">Filters</span>
					</button>
				</div>
			</div>

			{/* Filters Panel */}
			{showFilters && (
				<div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold text-gray-800">Filter Students</h3>
						<button
							onClick={() => setShowFilters(false)}
							className="text-gray-400 hover:text-gray-600"
						>
							<CloseIcon size={20} />
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm text-gray-600 mb-1">
								Face Authentication
							</label>
							<select
								value={
									filters.faceAuthEnabled === undefined
										? ''
										: String(filters.faceAuthEnabled)
								}
								onChange={(e) => {
									const value = e.target.value;
									setFilters({
										...filters,
										faceAuthEnabled:
											value === '' ? undefined : value === 'true',
									});
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All</option>
								<option value="true">Enabled</option>
								<option value="false">Disabled</option>
							</select>
						</div>

						<div>
							<label className="block text-sm text-gray-600 mb-1">Status</label>
							<select
								value={
									filters.isBlocked === undefined
										? ''
										: String(filters.isBlocked)
								}
								onChange={(e) => {
									const value = e.target.value;
									setFilters({
										...filters,
										isBlocked: value === '' ? undefined : value === 'true',
									});
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All</option>
								<option value="false">Active</option>
								<option value="true">Blocked</option>
							</select>
						</div>

						<div>
							<label className="block text-sm text-gray-600 mb-1">
								Email Verification
							</label>
							<select
								value={
									filters.emailVerified === undefined
										? ''
										: String(filters.emailVerified)
								}
								onChange={(e) => {
									const value = e.target.value;
									setFilters({
										...filters,
										emailVerified: value === '' ? undefined : value === 'true',
									});
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All</option>
								<option value="true">Verified</option>
								<option value="false">Not Verified</option>
							</select>
						</div>

						<div>
							<label className="block text-sm text-gray-600 mb-1">Level</label>
							<select
								value={filters.level || ''}
								onChange={(e) =>
									setFilters({
										...filters,
										level: e.target.value
											? parseInt(e.target.value)
											: undefined,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All Levels</option>
								<option value="100">100 Level</option>
								<option value="200">200 Level</option>
								<option value="300">300 Level</option>
								<option value="400">400 Level</option>
								<option value="500">500 Level</option>
							</select>
						</div>
					</div>

					<div className="flex justify-end gap-3 mt-4">
						<button
							onClick={handleClearFilters}
							className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
						>
							Clear All
						</button>
						<button
							onClick={() =>
								handleApplyFilters({
									faceAuthEnabled: filters.faceAuthEnabled,
									isBlocked: filters.isBlocked,
									emailVerified: filters.emailVerified,
									level: filters.level,
								})
							}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Apply Filters
						</button>
					</div>
				</div>
			)}

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
					{error}
				</div>
			)}

			{/* List Section */}
			<div className="space-y-4">
				{students.map((student) => (
					<StudentCard key={student.id} student={student} />
				))}
			</div>

			{students.length === 0 && !loading && (
				<div className="text-center py-12">
					<Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500">No students found in this course</p>
					<p className="text-sm text-gray-400 mt-1">
						Try adjusting your filters or search term
					</p>
				</div>
			)}

			{/* Pagination Controls */}
			{total > 0 && (
				<div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
					<div className="text-sm text-gray-500">
						Showing {(currentPage - 1) * limit + 1} to{' '}
						{Math.min(currentPage * limit, total)} of {total} students
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={handlePreviousPage}
							disabled={!hasPreviousPage || loading}
							className="p-2 rounded-full border border-gray-300 disabled:opacity-30 hover:bg-white transition"
						>
							<ChevronLeft size={18} />
						</button>

						<span className="font-medium text-gray-600 px-3">
							Page {currentPage} of {Math.ceil(total / limit)}
							{loading && (
								<span className="text-xs text-blue-500 ml-2">(Loading...)</span>
							)}
						</span>

						<button
							onClick={handleNextPage}
							disabled={!hasNextPage || loading}
							className="p-2 rounded-full border border-gray-300 hover:bg-white transition"
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
