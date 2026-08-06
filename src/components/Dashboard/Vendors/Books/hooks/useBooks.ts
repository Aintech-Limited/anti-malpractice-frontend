'use client';

import { useState } from 'react';
import { IBook } from '../interface';
import { toast } from 'react-toastify';
import { IMeta } from '../../../Department/interface';

export const useBooks = (initialMaterials: IBook[], initialMeta: IMeta) => {
	const [materials, setMaterials] = useState<IBook[]>(initialMaterials);
	const [meta, setMeta] = useState<IMeta>(initialMeta);
	const [loading, setLoading] = useState(false);
	const [selectedMaterial, setSelectedMaterial] = useState<IBook | null>(null);
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
		newMaterials: IBook[],
		newMeta: IMeta,
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

	const openEditModal = (material: IBook) => {
		setSelectedMaterial(material);
		setModalStage('edit_material');
	};
	const closeEditModal = () => {
		setModalStage('');
		setSelectedMaterial(null);
	};

	const openDeleteModal = (material: IBook) => {
		setSelectedMaterial(material);
		setModalStage('delete_material');
	};
	const closeDeleteModal = () => {
		setModalStage('');
		setSelectedMaterial(null);
	};

	const openViewModal = (material: IBook) => {
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
