'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IStudentNavigationProps } from './interface';

export const StudentNavigation = ({
	currentPage,
	itemsPerPage,
	filteredStudents,
	totalPages,
	onSetCurrentPage,
}: IStudentNavigationProps) => {
	return (
		<div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
			<span className="text-xs text-slate-400 font-medium">
				Showing{' '}
				<span className="font-bold text-slate-700">
					{(currentPage - 1) * itemsPerPage + 1}
				</span>{' '}
				to{' '}
				<span className="font-bold text-slate-700">
					{Math.min(currentPage * itemsPerPage, filteredStudents.length)}
				</span>{' '}
				of{' '}
				<span className="font-bold text-slate-700">
					{filteredStudents.length}
				</span>{' '}
				students
			</span>

			<div className="flex items-center gap-2">
				<button
					disabled={currentPage === 1}
					onClick={() => onSetCurrentPage((prev) => Math.max(prev - 1, 1))}
					className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors shadow-sm"
				>
					<ChevronLeft className="w-4 h-4" />
				</button>

				<div className="flex items-center gap-1">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<button
							key={page}
							onClick={() => onSetCurrentPage(page)}
							className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
								currentPage === page
									? 'bg-neutral-900 text-white shadow-sm shadow-neutral-900/10'
									: 'border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-600'
							}`}
						>
							{page}
						</button>
					))}
				</div>

				<button
					disabled={currentPage === totalPages}
					onClick={() =>
						onSetCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors shadow-sm"
				>
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};
