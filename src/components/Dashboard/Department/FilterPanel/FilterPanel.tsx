import { SORT_OPTIONS, PAGE_SIZE_OPTIONS } from '../utils/departmentConstants';
import { IDepartmentFilterPanelProps } from './interface';

export const FilterPanel = ({
	sortBy,
	limit,
	onSortChange,
	onLimitChange,
}: IDepartmentFilterPanelProps) => {
	return (
		<div className="mt-4 pt-4 border-t border-gray-200 animate-slideDown">
			<div className="flex flex-wrap gap-4 items-center">
				<label className="text-sm font-medium text-gray-700">Sort by:</label>
				<select
					value={sortBy}
					onChange={(e) => onSortChange(e.target.value as 'name' | 'createdAt')}
					className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
				>
					{SORT_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<label className="text-sm font-medium text-gray-700 ml-4">
					Items per page:
				</label>
				<select
					value={limit}
					onChange={(e) => onLimitChange(parseInt(e.target.value))}
					className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
				>
					{PAGE_SIZE_OPTIONS.map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
