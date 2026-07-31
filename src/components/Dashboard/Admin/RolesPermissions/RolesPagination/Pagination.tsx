'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IPaginationProps } from './interface';

export const RolesPagination = ({
	currentPage,
	handlePageChange,
	meta,
}: IPaginationProps) => {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-slate-600">
					Showing {(meta.page - 1) * meta.limit + 1} to{' '}
					{Math.min(meta.page * meta.limit, meta.totalItems)} of{' '}
					{meta.totalItems} roles
				</p>
				<div className="flex items-center gap-2">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={!meta.hasPreviousPage}
						className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					>
						<ChevronLeft className="h-4 w-4" />
						Previous
					</button>

					<div className="flex items-center gap-1">
						{Array.from({ length: meta.totalPages }, (_, i) => i + 1)
							.filter((page) => {
								if (meta.totalPages <= 7) return true;
								if (page === 1 || page === meta.totalPages) return true;
								if (Math.abs(page - currentPage) <= 1) return true;
								return false;
							})
							.map((page, index, arr) => (
								<div key={page} className="flex items-center gap-1">
									{index > 0 && arr[index - 1] !== page - 1 && (
										<span className="text-slate-400 px-1">...</span>
									)}
									<button
										onClick={() => handlePageChange(page)}
										className={`min-w-9 px-3 py-2 text-sm rounded-lg transition-all ${
											currentPage === page
												? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md'
												: 'border border-slate-200 text-slate-600 hover:bg-slate-50'
										}`}
									>
										{page}
									</button>
								</div>
							))}
					</div>

					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={!meta.hasNextPage}
						className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					>
						Next
						<ChevronRight className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
};
