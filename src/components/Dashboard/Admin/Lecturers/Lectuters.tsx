'use client';

import { useState } from 'react';
import {
	Search,
	ChevronLeft,
	ChevronRight,
	Filter,
	X as CloseIcon,
	Users,
} from 'lucide-react';
import {
	IAssignCourseData,
	ILecturer,
	ILecturerAssignment,
	ILecturerFilters,
	ILecturersClientProps,
	ILecturersResponse,
} from './interface';
import LecturerCard from './LecturerCard/LecturerCard';
import ReviewDocumentsModal from './ReviewDocumentsModal/ReviewDocumentsModal';
import AssignCourseModal from './AssignCourseModal/AssignCourseModal';
import ManageAssignmentsModal from './ManageAssignmentsModal/ManageAssignmentsModal';
import UnassignConfirmModal from './UnassignConfirmModal/UnassignConfirmModal';
import { toast } from 'react-toastify';
import { EmptyState } from '@/src/components/common/EmptyState/EmptyState';
import { TKycStatusEnum } from '@/src/lib/enums';

export default function LecturersClient({
	initialData,
	initialPage,
	limit,
	departments,
}: ILecturersClientProps) {
	const [lecturers, setLecturers] = useState<ILecturer[]>(
		initialData.data ?? [],
	);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [total, setTotal] = useState(initialData.meta.totalItems);
	const [hasNextPage, setHasNextPage] = useState(initialData.meta.hasNextPage);
	const [hasPreviousPage, setHasPreviousPage] = useState(
		initialData.meta.hasPreviousPage,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<ILecturerFilters>({
		page: initialPage,
		limit: limit,
	});
	const [showFilters, setShowFilters] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	// Modal states
	const [modalStage, setModalStage] = useState<
		'NONE' | 'REVIEW_ASSIGNED' | 'ASSIGN' | 'MANAGE_ASSIGNED' | 'UNASSIGN'
	>('NONE');
	const [selectedLecturer, setSelectedLecturer] = useState<ILecturer | null>(
		null,
	);
	const [selectedAssignment, setSelectedAssignment] =
		useState<ILecturerAssignment | null>(null);

	const loadLecturers = async (
		page: number,
		currentFilters: ILecturerFilters,
	) => {
		setLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams();
			params.append('page', String(page));
			params.append('limit', String(limit));
			if (currentFilters.search) params.append('search', currentFilters.search);
			if (currentFilters.departmentId)
				params.append('departmentId', currentFilters.departmentId);
			if (currentFilters.isActive !== undefined)
				params.append('isActive', String(currentFilters.isActive));
			if (currentFilters.idVerified !== undefined)
				params.append('idVerified', String(currentFilters.idVerified));
			if (currentFilters.selfieVerified !== undefined)
				params.append('selfieVerified', String(currentFilters.selfieVerified));

			const response = await fetch(
				`/api/v1/admin/lecturers?${params.toString()}`,
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch lecturers: ${response.statusText}`);
			}

			const result: ILecturersResponse = await response.json();

			if (result.success) {
				setLecturers(result.data);
				setCurrentPage(result.meta.page);
				setTotal(result.meta.totalItems);
				setHasNextPage(result.meta.hasNextPage);
				setHasPreviousPage(result.meta.hasPreviousPage);
			} else {
				setError(result.message);
			}
		} catch (err) {
			console.error('Error fetching lecturers:', err);
			setError(
				err instanceof Error ? err.message : 'Failed to fetch lecturers',
			);
		} finally {
			setLoading(false);
		}
	};

	const handleNextPage = () => {
		if (hasNextPage && !loading) {
			const newPage = currentPage + 1;
			setFilters({ ...filters, page: newPage });
			loadLecturers(newPage, { ...filters, page: newPage });
		}
	};

	const handlePreviousPage = () => {
		if (hasPreviousPage && !loading) {
			const newPage = currentPage - 1;
			setFilters({ ...filters, page: newPage });
			loadLecturers(newPage, { ...filters, page: newPage });
		}
	};

	const handleSearch = () => {
		const newFilters = { ...filters, search: searchTerm || undefined, page: 1 };
		setFilters(newFilters);
		loadLecturers(1, newFilters);
	};

	const handleApplyFilters = (newFilters: Partial<ILecturerFilters>) => {
		const updatedFilters = { ...filters, ...newFilters, page: 1 };
		setFilters(updatedFilters);
		loadLecturers(1, updatedFilters);
		setShowFilters(false);
	};

	const handleClearFilters = () => {
		const clearedFilters = { page: 1, limit: limit };
		setFilters(clearedFilters);
		setSearchTerm('');
		loadLecturers(1, clearedFilters);
		setShowFilters(false);
	};

	const handleVerifyDocument = async (
		lecturerId: string,
		type: 'id' | 'selfie',
		status: TKycStatusEnum,
	) => {
		try {
			const response = await fetch(
				`/api/v1/admin/lecturers/${lecturerId}/verify`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ documentType: type, status }),
				},
			);

			const result = await response.json();
			if (result.success) {
				await loadLecturers(currentPage, filters);
				toast.success(
					`${type === 'id' ? 'ID document' : 'Selfie'} ${status} updated!`,
				);
			} else {
				toast.error(`Failed to verify: ${result.message}`);
			}
		} catch (error) {
			console.error('Error verifying document:', error);
			toast.error('Failed to verify document. Please try again.');
		}
	};

	const handleAssignCourse = async (data: IAssignCourseData) => {
		try {
			console.log('data: ', data);
			const response = await fetch(`/api/v1/admin/lecturers/assign-course`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (result.success) {
				toast.success('Course assigned successfully!');
			} else {
				toast.error(`Failed to assign course: ${result.message}`);
			}
		} catch (error) {
			console.error('Error assigning course:', error);
			toast.error('Failed to assign course. Please try again.');
		}
	};

	const handleUnassignCourse = async (assignmentId: string) => {
		try {
			const response = await fetch(
				`/api/v1/admin/lecturers/assignments/${assignmentId}`,
				{
					method: 'DELETE',
				},
			);

			const result = await response.json();
			if (result.success) {
				toast.success('Lecturer unassigned successfully!');
				if (selectedLecturer) {
					// Refresh assignments if modal is open
					setModalStage('NONE');
					setTimeout(() => setModalStage('MANAGE_ASSIGNED'), 100);
				}
			} else {
				toast.error(`Failed to unassign: ${result.message}`);
			}
		} catch (error) {
			console.error('Error unassigning:', error);
			toast.error('Failed to unassign lecturer. Please try again.');
		}
	};

	const handleReassign = (assignment: ILecturerAssignment) => {
		setSelectedAssignment(assignment);
		setModalStage('ASSIGN');
	};

	const getStatusCounts = () => {
		const active = lecturers.filter((l) => l.isActive).length;
		const idVerified = lecturers.filter((l) => l.idVerified).length;
		// const selfieVerified = lecturers.filter((l) => l.selfieVerified).length;
		return { active, idVerified, total: lecturers.length };
	};

	const counts = getStatusCounts();

	return (
		<div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
			{/* Header Section */}
			<div className="flex flex-wrap items-center justify-between mb-8 gap-4">
				<div className="flex items-center gap-4">
					<h1 className="text-2xl font-bold text-gray-800">
						Lecturers Management
					</h1>
					<div className="text-sm text-gray-500">({total} total)</div>
				</div>

				<div className="flex items-center gap-3 flex-1 justify-end">
					<div className="relative flex-1 max-w-md">
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
							placeholder="Search by name, email..."
							className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`p-2 border rounded-lg transition ${showFilters ? 'bg-indigo-100 border-indigo-300 text-indigo-600' : 'bg-white border-gray-200 text-gray-400'}`}
					>
						<Filter size={20} />
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
					<div className="text-2xl font-bold text-gray-800">{counts.total}</div>
					<div className="text-sm text-gray-500">Total Lecturers</div>
				</div>
				<div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-100">
					<div className="text-2xl font-bold text-green-700">
						{counts.active}
					</div>
					<div className="text-sm text-green-600">Active</div>
				</div>
				<div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100">
					<div className="text-2xl font-bold text-blue-700">
						{counts.idVerified}
					</div>
					<div className="text-sm text-blue-600">ID Verified</div>
				</div>
				{/* <div className="bg-purple-50 rounded-lg p-4 shadow-sm border border-purple-100">
					<div className="text-2xl font-bold text-purple-700">
						{counts.selfieVerified}
					</div>
					<div className="text-sm text-purple-600">Selfie Verified</div>
				</div> */}
			</div>

			{/* Filters Panel */}
			{showFilters && (
				<div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold text-gray-800">Filter Lecturers</h3>
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
								Department
							</label>
							<select
								value={filters.departmentId || ''}
								onChange={(e) =>
									setFilters({
										...filters,
										departmentId: e.target.value || undefined,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<option value="">All Departments</option>
								{departments.map((dept) => (
									<option key={dept.id} value={dept.id}>
										{dept.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm text-gray-600 mb-1">Status</label>
							<select
								value={
									filters.isActive === undefined ? '' : String(filters.isActive)
								}
								onChange={(e) => {
									const value = e.target.value;
									setFilters({
										...filters,
										isActive: value === '' ? undefined : value === 'true',
									});
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<option value="">All</option>
								<option value="true">Active</option>
								<option value="false">Inactive</option>
							</select>
						</div>

						<div>
							<label className="block text-sm text-gray-600 mb-1">
								ID Verification
							</label>
							<select
								value={
									filters.idVerified === undefined
										? ''
										: String(filters.idVerified)
								}
								onChange={(e) => {
									const value = e.target.value;
									setFilters({
										...filters,
										idVerified: value === '' ? undefined : value === 'true',
									});
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<option value="">All</option>
								<option value="true">Verified</option>
								<option value="false">Pending</option>
							</select>
						</div>

						<div>
							<label className="block text-sm text-gray-600 mb-1">
								Selfie Verification
							</label>
							<select
								value={
									filters.selfieVerified === undefined
										? ''
										: String(filters.selfieVerified)
								}
								onChange={(e) => {
									const value = e.target.value;
									setFilters({
										...filters,
										selfieVerified: value === '' ? undefined : value === 'true',
									});
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<option value="">All</option>
								<option value="true">Verified</option>
								<option value="false">Pending</option>
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
									departmentId: filters.departmentId,
									isActive: filters.isActive,
									idVerified: filters.idVerified,
									selfieVerified: filters.selfieVerified,
								})
							}
							className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
				{lecturers.map((lecturer) => (
					<LecturerCard
						key={lecturer.id}
						lecturer={lecturer}
						onReviewDocuments={(l) => {
							setSelectedLecturer(l);
							setModalStage('REVIEW_ASSIGNED');
						}}
						onAssignCourse={(l) => {
							setSelectedLecturer(l);
							setModalStage('ASSIGN');
						}}
						onManageAssignments={(l) => {
							setSelectedLecturer(l);
							setModalStage('MANAGE_ASSIGNED');
						}}
					/>
				))}
			</div>

			{lecturers.length === 0 && !loading && (
				<EmptyState title="No Lecturers found" />
			)}

			{/* Pagination Controls */}
			{total > 0 && (
				<div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
					<div className="text-sm text-gray-500">
						Showing {(currentPage - 1) * limit + 1} to{' '}
						{Math.min(currentPage * limit, total)} of {total} lecturers
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
								<span className="text-xs text-indigo-500 ml-2">
									(Loading...)
								</span>
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

			{/* Modals */}
			<ReviewDocumentsModal
				isOpen={modalStage === 'REVIEW_ASSIGNED'}
				onClose={() => {
					setModalStage('NONE');
					setSelectedLecturer(null);
				}}
				lecturer={selectedLecturer}
				onVerify={handleVerifyDocument}
			/>

			<AssignCourseModal
				isOpen={modalStage === 'ASSIGN'}
				onClose={() => {
					setModalStage('NONE');
					setSelectedLecturer(null);
					setSelectedAssignment(null);
				}}
				onConfirm={handleAssignCourse}
				lecturerId={selectedLecturer?.id || ''}
				lecturerName={
					selectedLecturer
						? `${selectedLecturer.firstName} ${selectedLecturer.lastName}`
						: ''
				}
				departmentId={selectedLecturer?.roles?.[0]?.departmentId}
			/>

			<ManageAssignmentsModal
				isOpen={modalStage === 'MANAGE_ASSIGNED'}
				onClose={() => {
					setModalStage('NONE');
					setSelectedLecturer(null);
				}}
				lecturerId={selectedLecturer?.id || ''}
				lecturerName={
					selectedLecturer
						? `${selectedLecturer.firstName} ${selectedLecturer.lastName}`
						: ''
				}
				onUnassign={async (assignmentId: string) => {
					setModalStage('NONE');
					// Find the assignment to show in unassign modal
					fetch(`/api/v1/admin/lecturers/${selectedLecturer?.id}/assignments`)
						.then((res) => res.json())
						.then((data) => {
							const assignment = data.data.find(
								(a: ILecturerAssignment) => a.id === assignmentId,
							);
							setSelectedAssignment(assignment);
							setModalStage('UNASSIGN');
						});
				}}
				onReassign={handleReassign}
			/>

			<UnassignConfirmModal
				isOpen={modalStage === 'UNASSIGN'}
				onClose={() => {
					setModalStage('NONE');
					setSelectedAssignment(null);
				}}
				onConfirm={async () => {
					if (selectedAssignment) {
						await handleUnassignCourse(selectedAssignment.id);
						setModalStage('NONE');
						setSelectedAssignment(null);
						// Refresh the manage modal if open
						if (selectedLecturer) {
							setModalStage('MANAGE_ASSIGNED');
						}
					}
				}}
				assignment={selectedAssignment}
			/>
		</div>
	);
}
