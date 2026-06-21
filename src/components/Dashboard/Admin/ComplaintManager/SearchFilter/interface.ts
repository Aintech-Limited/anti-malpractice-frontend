import { SetStateAction } from 'react';

export interface ISearchFilterProps {
	setSearchQuery: (value: SetStateAction<string>) => void;
	searchQuery: string;
	setStatusFilter: (value: SetStateAction<string>) => void;
	statusFilter: string;
	setCurrentPage: (value: SetStateAction<number>) => void;
}
