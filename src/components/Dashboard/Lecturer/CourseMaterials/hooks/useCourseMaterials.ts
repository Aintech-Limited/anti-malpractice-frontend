'use client';

import { useState } from 'react';
import { ICourseMaterial } from '../interface';

export const useCourseMaterials = (
	initialMaterials: ICourseMaterial[],
	initialMeta: any,
) => {
	const [materials, setMaterials] =
		useState<ICourseMaterial[]>(initialMaterials);
	const [meta, setMeta] = useState(initialMeta);
	const [loading, setLoading] = useState(false);
	const [selectedMaterial, setSelectedMaterial] =
		useState<ICourseMaterial | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);

	const updateMaterials = (newMaterials: ICourseMaterial[], newMeta: any) => {
		setMaterials(newMaterials);
		setMeta(newMeta);
	};

	const setLoadingState = (isLoading: boolean) => {
		setLoading(isLoading);
	};

	const openCreateModal = () => setShowCreateModal(true);
	const closeCreateModal = () => setShowCreateModal(false);

	const openEditModal = (material: ICourseMaterial) => {
		setSelectedMaterial(material);
		setShowEditModal(true);
	};
	const closeEditModal = () => {
		setShowEditModal(false);
		setSelectedMaterial(null);
	};

	const openDeleteModal = (material: ICourseMaterial) => {
		setSelectedMaterial(material);
		setShowDeleteModal(true);
	};
	const closeDeleteModal = () => {
		setShowDeleteModal(false);
		setSelectedMaterial(null);
	};

	const openViewModal = (material: ICourseMaterial) => {
		setSelectedMaterial(material);
		setShowViewModal(true);
	};
	const closeViewModal = () => {
		setShowViewModal(false);
		setSelectedMaterial(null);
	};

	return {
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
	};
};
