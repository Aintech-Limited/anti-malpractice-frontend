export interface IFiltersBarProps {
	filters: {
		type: string;
		sortBy: string;
		limit: number;
	};
	showFilters: boolean;
	hasActiveFilters: boolean;
	onToggleFilters: () => void;
	onUpdateFilters: (newFilters: Partial<any>) => void;
	onClearFilters: () => void;
}
