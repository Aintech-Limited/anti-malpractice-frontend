/* eslint-disable @next/next/no-img-element */
'use client';

import { Eye, MoreVertical, ShieldAlert, UserX } from 'lucide-react';
import { IStudentTableProps } from './interface';

export const StudentTable = ({
	student,
	onAction,
	activeDropdownId,
	onSetActiveDropdownId,
}: IStudentTableProps) => {
	return (
		<div
			key={student.id}
			className="grid grid-cols-12 gap-4 items-center py-3.5 hover:bg-slate-50/70 rounded-xl px-2 transition relative group"
		>
			<div className="col-span-2">
				<img
					src={student.avatarUrl}
					alt={student.name}
					className="w-11 h-11 rounded-full object-cover shadow-sm bg-slate-100"
				/>
			</div>

			<div className="col-span-4 flex flex-col">
				<span className="font-semibold text-slate-900 text-sm tracking-tight leading-snug">
					{student.name}
				</span>
				<span className="text-xs text-slate-400 font-medium mt-0.5">
					{student.level}
				</span>
			</div>

			<div className="col-span-2 text-sm text-slate-700 font-medium">
				{student.studentId}
			</div>

			<div className="col-span-2 text-sm text-slate-700 font-medium text-center sm:text-left">
				{student.year}
			</div>

			<div className="col-span-2 text-right relative pr-2">
				<button
					onClick={() =>
						onSetActiveDropdownId(
							activeDropdownId === student.id ? null : student.id,
						)
					}
					className="p-1.5 hover:bg-slate-200 rounded-full inline-flex text-slate-500 hover:text-black transition-colors"
				>
					<MoreVertical className="w-5 h-5" />
				</button>

				{activeDropdownId === student.id && (
					<>
						<div
							className="fixed inset-0 z-10"
							onClick={() => onSetActiveDropdownId(null)}
						/>
						<div className="absolute right-2 top-10 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
							<button
								onClick={() => onAction('view', student)}
								className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
							>
								<Eye className="w-4 h-4 text-blue-500" /> View Profile
							</button>
							<button
								onClick={() => onAction('suspend', student)}
								className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
							>
								<UserX className="w-4 h-4 text-amber-500" /> Suspend
							</button>
							<button
								onClick={() => onAction('block', student)}
								className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left border-t border-slate-100"
							>
								<ShieldAlert className="w-4 h-4 text-rose-500" /> Block Account
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
