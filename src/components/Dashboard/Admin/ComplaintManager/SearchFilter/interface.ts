import { TComplaintCategoryEnum, TComplaintStatusEnum } from '@/src/lib/enums';
import { SetStateAction } from 'react';

export interface ISearchFilterProps {
	setSearchQuery: (value: SetStateAction<string>) => void;
	searchQuery: string;
	setStatusFilter: (value: SetStateAction<string>) => void;
	setCategoryFilter: (value: SetStateAction<string>) => void;
	statusFilter: TComplaintStatusEnum;
	setCurrentPage: (value: SetStateAction<number>) => void;
	categoryFilter: TComplaintCategoryEnum;
}
