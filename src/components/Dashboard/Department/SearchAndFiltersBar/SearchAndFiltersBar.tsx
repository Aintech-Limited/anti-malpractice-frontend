import {
	Search,
	Filter,
	ChevronDown,
	LayoutGrid,
	List,
	X,
	Loader,
} from 'lucide-react';
import { ISearchAndFiltersBarProps } from './interface';

export const SearchAndFiltersBar = ({
	localSearchTerm,
	isSearching,
	loading,
	showFilters,
	viewMode,
	onSearchChange,
	onClearSearch,
	onToggleFilters,
	onViewModeChange,
}: ISearchAndFiltersBarProps) => {
	return (
		<div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
			<div className="p-4">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search departments by name or description..."
							value={localSearchTerm}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						/>
						{localSearchTerm && (
							<button
								onClick={onClearSearch}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							>
								<X className="w-4 h-4" />
							</button>
						)}
						{(isSearching || loading) && (
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
								<Loader className="w-4 h-4 text-indigo-600 animate-spin" />
							</div>
						)}
					</div>

					<div className="flex gap-2">
						<button
							onClick={onToggleFilters}
							className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
						>
							<Filter className="w-4 h-4" />
							Filters
							<ChevronDown
								className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
							/>
						</button>

						<div className="flex border border-gray-300 rounded-lg overflow-hidden">
							<button
								onClick={() => onViewModeChange('grid')}
								className={`px-3 py-2 transition-colors ${
									viewMode === 'grid'
										? 'bg-indigo-600 text-white'
										: 'bg-white text-gray-700 hover:bg-gray-50'
								}`}
							>
								<LayoutGrid className="w-4 h-4" />
							</button>
							<button
								onClick={() => onViewModeChange('list')}
								className={`px-3 py-2 transition-colors ${
									viewMode === 'list'
										? 'bg-indigo-600 text-white'
										: 'bg-white text-gray-700 hover:bg-gray-50'
								}`}
							>
								<List className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
