import { Dispatch, SetStateAction } from 'react';

export interface ISearchFilterProps {
	setSearchQuery: Dispatch<SetStateAction<string>>;
	searchQuery: string;
	setCurrentPage: Dispatch<SetStateAction<number>>;
	setIsSuspendedFilter: Dispatch<SetStateAction<string>>;
	isSuspendedFilter: string;
}
