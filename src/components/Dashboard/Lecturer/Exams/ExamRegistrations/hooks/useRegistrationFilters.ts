'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IExamRegisteredFilters } from '../interface';

export const useRegistrationFilters = (
	examId: string,
	initialFilters: IExamRegisteredFilters,
) => {
	const router = useRouter();
	const [filters, setFilters] = useState(initialFilters);
	const [showFilters, setShowFilters] = useState(false);

	const updateFilters = (newFilters: Partial<IExamRegisteredFilters>) => {
		const updated = { ...filters, ...newFilters, page: 1 };
		setFilters(updated);

		const params = new URLSearchParams();
		params.set('page', updated.page.toString());
		params.set('limit', updated.limit.toString());
		if (updated.sortBy) params.set('sortBy', updated.sortBy);
		if (updated.sortOrder) params.set('sortOrder', updated.sortOrder);
		if (updated.status) params.set('status', updated.status);
		if (updated.level) params.set('level', updated.level);
		if (updated.semester) params.set('semester', updated.semester);

		router.push(
			`/dashboard/lecturer/exams/${examId}/registrations?${params.toString()}`,
		);
	};

	const fetchPage = async (page: number): Promise<any> => {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('limit', filters.limit.toString());
		if (filters.sortBy) params.set('sortBy', filters.sortBy);
		if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
		if (filters.status) params.set('registrationStatus', filters.status);
		if (filters.level) params.set('level', filters.level);
		if (filters.semester) params.set('semester', filters.semester);

		const response = await fetch(
			`/api/v1/exam-registrations/${examId}?${params}`,
		);
		return response.json();
	};

	const clearFilters = () => {
		updateFilters({
			status: '',
			level: '',
			semester: '',
			sortBy: 'registeredAt',
			sortOrder: 'DESC',
			page: 1,
		});
	};

	const hasActiveFilters =
		filters.status !== '' || filters.level !== '' || filters.semester !== '';

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
