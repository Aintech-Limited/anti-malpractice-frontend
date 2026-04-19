import { Filter, X, Search } from 'lucide-react';
import {
	SORT_OPTIONS,
	SORT_ORDER_OPTIONS,
	PAGE_SIZE_OPTIONS,
	FILE_TYPE_OPTIONS,
	PRICE_FILTER_OPTIONS,
} from '../utils/materialConstants';
import { IMaterialsFiltersProps } from './interface';

export const MaterialsFilters = ({
	filters,
	showFilters,
	hasActiveFilters,
	onToggleFilters,
	onUpdateFilters,
	onClearFilters,
}: IMaterialsFiltersProps) => {
	return (
		<div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
			<div className="p-4 border-b border-gray-100">
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search Bar */}
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search by title or description..."
							value={filters.search}
							onChange={(e) => onUpdateFilters({ search: e.target.value })}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>

					<button
						onClick={onToggleFilters}
						className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-300"
					>
						<Filter className="w-5 h-5" />
						<span>Advanced Filters</span>
						{hasActiveFilters && (
							<span className="ml-2 w-2 h-2 bg-indigo-600 rounded-full"></span>
						)}
					</button>

					{hasActiveFilters && (
						<button
							onClick={onClearFilters}
							className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
						>
							<X className="w-4 h-4" />
							Clear all
						</button>
					)}
				</div>
			</div>

			{showFilters && (
				<div className="p-4 bg-gray-50 border-t border-gray-100 animate-slideDown">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								File Type
							</label>
							<select
								value={filters.fileType}
								onChange={(e) => onUpdateFilters({ fileType: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							>
								{FILE_TYPE_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Price Type
							</label>
							<select
								value={filters.isFree}
								onChange={(e) => onUpdateFilters({ isFree: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							>
								{PRICE_FILTER_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Sort By
							</label>
							<select
								value={filters.sortBy}
								onChange={(e) => onUpdateFilters({ sortBy: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							>
								{SORT_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Sort Order
							</label>
							<select
								value={filters.sortOrder}
								onChange={(e) => onUpdateFilters({ sortOrder: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							>
								{SORT_ORDER_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Items Per Page
						</label>
						<select
							value={filters.limit}
							onChange={(e) =>
								onUpdateFilters({ limit: parseInt(e.target.value) })
							}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
						>
							{PAGE_SIZE_OPTIONS.map((size) => (
								<option key={size} value={size}>
									{size} items
								</option>
							))}
						</select>
					</div>
				</div>
			)}
		</div>
	);
};
