'use client';

import { useState } from 'react';
import { IDepartment, IDepartmentStats } from '../interface';
import { DEFAULT_STATS } from '../utils/departmentConstants';

export const useDepartmentModal = () => {
	const [selectedDepartment, setSelectedDepartment] =
		useState<IDepartment | null>(null);
	const [departmentStats, setDepartmentStats] =
		useState<IDepartmentStats>(DEFAULT_STATS);
	const [loadingStats, setLoadingStats] = useState(false);
	const [statsError, setStatsError] = useState<string | null>(null);

	const openModal = async (department: IDepartment) => {
		setSelectedDepartment(department);
		setLoadingStats(true);
		setStatsError(null);

		try {
			const response = await fetch(`/api/v1/departments/${department.id}`);
			const data = await response.json();

			if (data.success) {
				setDepartmentStats(data.data);
			} else {
				setStatsError(data.message || 'Failed to load department statistics');
				// Fallback to default stats
				setDepartmentStats(DEFAULT_STATS);
			}
		} catch (error) {
			setStatsError('Failed to load department statistics');
			setDepartmentStats(DEFAULT_STATS);
		} finally {
			setLoadingStats(false);
		}
	};

	const closeModal = () => {
		setSelectedDepartment(null);
		setDepartmentStats(DEFAULT_STATS);
		setStatsError(null);
	};

	return {
		selectedDepartment,
		departmentStats,
		loadingStats,
		statsError,
		openModal,
		closeModal,
	};
};
