import { Filter, X } from 'lucide-react';
import {
	EXAM_STATUS,
	EXAM_TYPES,
	SORT_OPTIONS,
	SORT_ORDER_OPTIONS,
	PAGE_SIZE_OPTIONS,
	PUBLISHED_OPTIONS,
} from '../utils/examConstants';
import { IExamsFiltersProps } from './interface';

export const ExamsFilters = ({
	filters,
	showFilters,
	hasActiveFilters,
	onToggleFilters,
	onUpdateFilters,
	onClearFilters,
}: IExamsFiltersProps) => {
	return (
		<div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
			<div className="p-4 border-b border-gray-100 flex justify-between items-center">
				<button
					onClick={onToggleFilters}
					className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
				>
					<Filter className="w-5 h-5" />
					<span>Filters</span>
					{hasActiveFilters && (
						<span className="ml-2 w-2 h-2 bg-indigo-600 rounded-full"></span>
					)}
				</button>
				{hasActiveFilters && (
					<button
						onClick={onClearFilters}
						className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
					>
						<X className="w-4 h-4" />
						Clear all
					</button>
				)}
			</div>

			{showFilters && (
				<div className="p-4 bg-gray-50 border-t border-gray-100 animate-slideDown">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Exam Status
							</label>
							<select
								value={filters.status}
								onChange={(e) =>
									onUpdateFilters({ ...filters, status: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							>
								<option value="">All Status</option>
								{Object.entries(EXAM_STATUS).map(([key, { label }]) => (
									<option key={key} value={key}>
										{label}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Exam Type
							</label>
							<select
								value={filters.type_}
								onChange={(e) =>
									onUpdateFilters({ ...filters, type_: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							>
								<option value="">All Types</option>
								{Object.entries(EXAM_TYPES).map(([key, { label }]) => (
									<option key={key} value={key}>
										{label}
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
								onChange={(e) =>
									onUpdateFilters({ ...filters, sortBy: e.target.value })
								}
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
								onChange={(e) =>
									onUpdateFilters({ ...filters, sortOrder: e.target.value })
								}
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
								onUpdateFilters({ ...filters, limit: parseInt(e.target.value) })
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
					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Published Exams
						</label>
						<select
							value={filters.published ? 'True' : 'False'}
							onChange={(e) =>
								onUpdateFilters({
									...filters,
									published:
										e.target.value === 'True'
											? true
											: e.target.value === 'False'
												? false
												: undefined,
								})
							}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
						>
							{PUBLISHED_OPTIONS.map((bool) => (
								<option key={bool} value={bool}>
									{bool} items
								</option>
							))}
						</select>
					</div>
				</div>
			)}
		</div>
	);
};
