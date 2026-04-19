import { IExamFilters } from '../interface';

export interface IExamsFiltersProps {
	filters: IExamFilters;
	showFilters: boolean;
	hasActiveFilters: boolean;
	onToggleFilters: () => void;
	onUpdateFilters: (filters: IExamFilters) => void;
	onClearFilters: () => void;
}
