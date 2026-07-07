'use client';

import { CheckSquare, Eye, UserCheck } from 'lucide-react';
import { IActiveComplaintMenuProps } from './interface';

const ActiveComplaintMenu = ({
	setActiveMenuId,
	setSelectedComplaint,
	handleAssignToMe,
	handleMarkAsResolved,
	handleSetInProgress,
	record,
}: IActiveComplaintMenuProps) => {
	return (
		<>
			<div
				className="fixed inset-0 z-10"
				onClick={() => setActiveMenuId(null)}
			/>
			<div className="absolute right-6 top-10 w-44 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-20 text-left">
				<button
					onClick={() => {
						setSelectedComplaint(record);
						setActiveMenuId(null);
					}}
					className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
				>
					<Eye className="w-3.5 h-3.5 text-blue-500" /> View Details
				</button>
				<button
					onClick={() => handleAssignToMe(record)}
					className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
				>
					<UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Assign to Me
				</button>
				<button
					onClick={() => handleMarkAsResolved(record)}
					className="w-full px-4 py-2 hover:bg-slate-50 text-emerald-600 font-bold flex items-center gap-2 border-t border-slate-100"
				>
					<CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Mark Resolved
				</button>
				<button
					onClick={() => handleSetInProgress(record)}
					className="w-full px-4 py-2 hover:bg-slate-50 text-yellow-600 font-bold flex items-center gap-2 border-t border-slate-100"
				>
					<CheckSquare className="w-3.5 h-3.5 text-yellow-500" /> Set in
					progress
				</button>
			</div>
		</>
	);
};

export default ActiveComplaintMenu;
