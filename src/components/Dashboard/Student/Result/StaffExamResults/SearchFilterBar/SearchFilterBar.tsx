'use client';

import { Filter, Search } from 'lucide-react';
import { ISearchFilterBarProps } from './interface';

export const SearchFilterBar = ({
	localFilters,
	setLocalFilters,
	setShowFilters,
	showFilters,
	handleApplyFilters,
	error,
	setError,
}: ISearchFilterBarProps) => {
	return (
		<>
			{error.search && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
					{error.search}
				</div>
			)}

			<div className="flex flex-wrap gap-4">
				<div className="flex-1 min-w-50">
					<input
						type="text"
						placeholder="Search by course code..."
						value={localFilters.courseCode || ''}
						onChange={(e) => {
							if (error.search) {
								setError((prev) => ({ ...prev, search: '' }));
							}
							setLocalFilters({ ...localFilters, courseCode: e.target.value });
						}}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
					/>
				</div>
				<div className="flex-1 min-w-50">
					<input
						type="text"
						placeholder="Student ID (optional)"
						value={localFilters.studentId || ''}
						onChange={(e) =>
							setLocalFilters({ ...localFilters, studentId: e.target.value })
						}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						list="student-id"
					/>
					<datalist id="student-id">
						<option value=""></option>
					</datalist>
				</div>
				<button
					onClick={() => setShowFilters(!showFilters)}
					className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
				>
					<Filter size={18} />
					Filters
				</button>
				<button
					onClick={handleApplyFilters}
					className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
				>
					<Search size={18} />
					Search
				</button>
			</div>
		</>
	);
};
