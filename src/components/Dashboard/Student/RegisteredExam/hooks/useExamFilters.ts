'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IRegisteredExamsFilters } from '../interface';

export const useExamFilters = (initialFilters: IRegisteredExamsFilters) => {
	const router = useRouter();
	const [filters, setFilters] = useState(initialFilters);
	const [showFilters, setShowFilters] = useState(false);

	const updateFilters = (newFilters: Partial<IRegisteredExamsFilters>) => {
		const updated = { ...filters, ...newFilters, page: 1 };
		setFilters(updated);

		const params = new URLSearchParams();
		params.set('page', updated.page.toString());
		params.set('limit', updated.limit.toString());
		if (updated.sortBy) params.set('sortBy', updated.sortBy);
		if (updated.sortOrder) params.set('sortOrder', updated.sortOrder);
		if (updated.status) params.set('status', updated.status);

		router.push(`/dashboard/students/exams/registered?${params.toString()}`);
	};

	const fetchPage = async (page: number): Promise<any> => {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('limit', filters.limit.toString());
		if (filters.sortBy) params.set('sortBy', filters.sortBy);
		if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
		if (filters.status) params.set('status', filters.status);

		try {
			const response = await fetch(`/api/v1/exam-registrations?${params}`);
			return await response.json();
		} catch (error) {
			return {
				message: 'Internal server error',
				data: [],
				success: false,
				meta: { limit: 50, page: 1, totalItems: 0, totalPages: 0 },
			};
		}
	};

	const clearFilters = () => {
		updateFilters({
			status: '',
			sortBy: 'registeredAt',
			sortOrder: 'DESC',
			page: 1,
		});
	};

	const hasActiveFilters = filters.status !== '';

	return {
		filters,
		showFilters,
		hasActiveFilters,
		setShowFilters,
		updateFilters,
		fetchPage,
		clearFilters,
	};
};
