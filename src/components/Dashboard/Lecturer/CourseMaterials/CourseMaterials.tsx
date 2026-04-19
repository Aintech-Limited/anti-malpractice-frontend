'use client';

import { useEffect, useState } from 'react';
import { ICourseMaterial, ICourseMaterialsProps } from './interface';
import { useCourseMaterials } from './hooks/useCourseMaterials';
import { useMaterialFilters } from './hooks/useMaterialFilters';
import { useAssignedCourses } from './hooks/useAssignedCourses';
import {
	getMaterialStats,
	calculateAverageRating,
} from './utils/materialHelpers';
import { MaterialsHeader } from './MaterialsHeader/MaterialsHeader';
import { MaterialsStats } from './MaterialsStats/MaterialsStats';
import { MaterialsFilters } from './MaterialsFilters/MaterialsFilters';
import { LoadingSkeleton } from './LoadingSkeleton/LoadingSkeleton';
import { MaterialsList } from './MaterialsList/MaterialsList';
import { Pagination } from './Pagination/Pagination';
import { CreateMaterialModal } from './modals/CreateMaterialModal';
import { EditMaterialModal } from './modals/EditMaterialModal';
import { DeleteMaterialModal } from './modals/DeleteMaterialModal';
import { ViewMaterialModal } from './modals/ViewMaterialModal';

export default function CourseMaterials({
	initialMaterials,
	initialMeta,
	assignedCourses,
	initialFilters,
}: ICourseMaterialsProps) {
	const {
		materials,
		meta,
		loading,
		selectedMaterial,
		showCreateModal,
		showEditModal,
		showDeleteModal,
		showViewModal,
		updateMaterials,
		setLoadingState,
		openCreateModal,
		closeCreateModal,
		openEditModal,
		closeEditModal,
		openDeleteModal,
		closeDeleteModal,
		openViewModal,
		closeViewModal,
	} = useCourseMaterials(initialMaterials, initialMeta);

	const {
		filters,
		showFilters,
		hasActiveFilters,
		setShowFilters,
		updateFilters,
		fetchPage,
		clearFilters,
	} = useMaterialFilters(initialFilters);

	const { courses: availableCourses } = useAssignedCourses(assignedCourses);

	const [stats, setStats] = useState(() => getMaterialStats(initialMaterials));
	const [avgRating, setAvgRating] = useState(() =>
		calculateAverageRating(initialMaterials),
	);

	useEffect(() => {
		setStats(getMaterialStats(materials));
		setAvgRating(calculateAverageRating(materials));
	}, [materials]);

	const handlePageChange = async (page: number) => {
		setLoadingState(true);
		const data = await fetchPage(page);
		updateMaterials(data.data, data.meta);
		setLoadingState(false);
	};

	const handleMaterialCreated = (newMaterial: ICourseMaterial) => {
		updateMaterials([newMaterial, ...materials], meta);
		closeCreateModal();
	};

	const handleMaterialUpdated = (updatedMaterial: ICourseMaterial) => {
		const updatedMaterials = materials.map((m) =>
			m.id === updatedMaterial.id ? updatedMaterial : m,
		);
		updateMaterials(updatedMaterials, meta);
		closeEditModal();
	};

	const handleMaterialDeleted = (deletedId: string) => {
		const filteredMaterials = materials.filter((m) => m.id !== deletedId);
		updateMaterials(filteredMaterials, {
			...meta,
			totalItems: meta.totalItems - 1,
		});
		closeDeleteModal();
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<MaterialsHeader
					totalMaterials={meta.totalItems}
					onCreateMaterial={openCreateModal}
				/>

				<MaterialsStats
					totalMaterials={stats.total}
					totalDownloads={stats.totalDownloads}
					totalRevenue={stats.totalRevenue}
					averageRating={avgRating}
				/>

				<MaterialsFilters
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
					<MaterialsList
						materials={materials}
						onView={openViewModal}
						onEdit={openEditModal}
						onDelete={openDeleteModal}
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
				<CreateMaterialModal
					courses={availableCourses}
					onClose={closeCreateModal}
					onSuccess={handleMaterialCreated}
				/>
			)}

			{showEditModal && selectedMaterial && (
				<EditMaterialModal
					material={selectedMaterial}
					onClose={closeEditModal}
					onSuccess={handleMaterialUpdated}
				/>
			)}

			{showDeleteModal && selectedMaterial && (
				<DeleteMaterialModal
					material={selectedMaterial}
					onClose={closeDeleteModal}
					onSuccess={() => handleMaterialDeleted(selectedMaterial.id)}
				/>
			)}

			{showViewModal && selectedMaterial && (
				<ViewMaterialModal
					material={selectedMaterial}
					onClose={closeViewModal}
				/>
			)}
		</div>
	);
}
