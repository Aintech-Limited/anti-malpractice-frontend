export interface ISearchAndFiltersBarProps {
	localSearchTerm: string;
	isSearching: boolean;
	loading: boolean;
	showFilters: boolean;
	viewMode: 'grid' | 'list';
	onSearchChange: (value: string) => void;
	onClearSearch: () => void;
	onToggleFilters: () => void;
	onViewModeChange: (mode: 'grid' | 'list') => void;
}
