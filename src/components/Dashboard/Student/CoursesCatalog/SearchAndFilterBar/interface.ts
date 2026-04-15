export interface ISearchAndFilterBarProps {
	searchQuery: string;
	selectedLevel: number | 'all';
	onSearchChange: (value: string) => void;
	onLevelChange: (value: number | 'all') => void;
}
