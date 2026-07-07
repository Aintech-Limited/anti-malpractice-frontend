'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IPaginationActionProps } from './interface';

export const PaginationAction = ({
	currentPage,
	filteredRecords,
	itemsPerPage,
	handlePageChange,
	totalPages,
}: IPaginationActionProps) => {
	return (
		<div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl">
			<span className="text-[11px] text-slate-400 font-medium">
				Showing{' '}
				<span className="font-bold text-slate-700">
					{(currentPage - 1) * itemsPerPage + 1}
				</span>{' '}
				to{' '}
				<span className="font-bold text-slate-700">
					{Math.min(currentPage * itemsPerPage, filteredRecords.length)}
				</span>{' '}
				of{' '}
				<span className="font-bold text-slate-700">
					{filteredRecords.length}
				</span>{' '}
				complaints
			</span>

			<div className="flex items-center gap-1">
				<button
					disabled={currentPage === 1}
					onClick={() => handlePageChange(currentPage - 1)}
					className="p-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 transition hover:bg-slate-50"
				>
					<ChevronLeft className="w-4 h-4" />
				</button>
				{Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
					<button
						key={pg}
						onClick={() => handlePageChange(pg)}
						className={`w-7 h-7 text-xs font-bold rounded-lg transition-all ${
							currentPage === pg
								? 'bg-blue-600 text-white'
								: 'hover:bg-slate-200/60 text-slate-600'
						}`}
					>
						{pg}
					</button>
				))}
				<button
					disabled={currentPage === totalPages}
					onClick={() => handlePageChange(currentPage + 1)}
					className="p-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-40 transition hover:bg-slate-50"
				>
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};
