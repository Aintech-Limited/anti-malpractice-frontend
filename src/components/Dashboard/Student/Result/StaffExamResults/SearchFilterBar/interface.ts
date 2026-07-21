import { Dispatch, SetStateAction } from 'react';
import { IStaffFilters } from '../../interface';

export interface ISearchFilterBarProps {
	localFilters: IStaffFilters;
	setLocalFilters: (value: SetStateAction<IStaffFilters>) => void;
	setShowFilters: (value: SetStateAction<boolean>) => void;
	showFilters: boolean;
	handleApplyFilters: () => void;
	setError: Dispatch<
		SetStateAction<{
			network: string;
			download: string;
			search: string;
		}>
	>;
	error: {
		network: string;
		download: string;
		search: string;
	};
}
