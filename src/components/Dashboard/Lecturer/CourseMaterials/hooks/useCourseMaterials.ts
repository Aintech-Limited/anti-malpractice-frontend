'use client';

import { useState } from 'react';
import { ICourseMaterial, ICourseMaterialsProps } from '../interface';
import { toast } from 'react-toastify';

export const useCourseMaterials = (
	initialMaterials: ICourseMaterial[],
	initialMeta: ICourseMaterialsProps['initialMeta'],
) => {
	const [materials, setMaterials] =
		useState<ICourseMaterial[]>(initialMaterials);
	const [meta, setMeta] = useState(initialMeta);
	const [loading, setLoading] = useState(false);
	const [selectedMaterial, setSelectedMaterial] =
		useState<ICourseMaterial | null>(null);
	const [PdfURL, setPdfURL] = useState<string | null>(null);
	const [modalStage, setModalStage] = useState<
		| 'create_material'
		| 'edit_material'
		| 'delete_material'
		| 'view_material'
		| 'view_pdf'
		| ''
	>('');

	const updateMaterials = (
		newMaterials: ICourseMaterial[],
		newMeta: any,
		isNew: boolean = false,
	) => {
		setMaterials(newMaterials);
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
		setModalStage('create_material');
	};
	const closeCreateModal = () => {
		setModalStage('');
	};

	const openEditModal = (material: ICourseMaterial) => {
		setSelectedMaterial(material);
		setModalStage('edit_material');
	};
	const closeEditModal = () => {
		setModalStage('');
		setSelectedMaterial(null);
	};

	const openDeleteModal = (material: ICourseMaterial) => {
		setSelectedMaterial(material);
		setModalStage('delete_material');
	};
	const closeDeleteModal = () => {
		setModalStage('');
		setSelectedMaterial(null);
	};

	const openViewModal = (material: ICourseMaterial) => {
		setSelectedMaterial(material);
		setModalStage('view_material');
	};
	const closeViewModal = () => {
		setModalStage('');
		setSelectedMaterial(null);
	};

	const openViewPDFModal = (pdfURL: string) => {
		setModalStage('view_pdf');
		if (!pdfURL) {
			toast.error('No PDF URL available for this material');
			return;
		}
		setPdfURL(pdfURL);
	};
	const closeViewPDFModal = () => {
		setModalStage('');
		setPdfURL(null);
	};

	return {
		materials,
		meta,
		loading,
		selectedMaterial,
		PdfURL,
		modalStage,

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
		setModalStage,
		openViewPDFModal,
		closeViewPDFModal,
	};
};
