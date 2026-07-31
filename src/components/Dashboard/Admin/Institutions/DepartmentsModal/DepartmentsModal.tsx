'use client';

import { IDepartmentsModalProps } from './interface';

export default function DepartmentsModal({
	isOpen,
	institutionName,
	departments,
	onClose,
}: IDepartmentsModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-blue-100">
				<div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
					<h2 className="text-lg font-bold">Departments</h2>
					<span className="text-xs bg-blue-700 px-2 py-1 rounded-full">
						{institutionName}
					</span>
				</div>

				<div className="p-6 max-h-[60vh] overflow-y-auto">
					{departments.length === 0 ? (
						<p className="text-center text-sm text-slate-500 py-4">
							No departments found for this institution.
						</p>
					) : (
						<ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
							{departments.map((dept) => (
								<li
									key={dept.id}
									className="p-3 text-sm flex justify-between items-center hover:bg-blue-50/30"
								>
									<span className="font-medium text-slate-800">
										{dept.name}
									</span>
									<span className="text-xs font-mono text-slate-400">
										{dept.id}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-md transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
