/* eslint-disable @next/next/no-img-element */
'use client';

import { Eye, MoreVertical, UserX } from 'lucide-react';
import { IStudentTableProps } from './interface';

export const StudentTableRow = ({
	student,
	onAction,
	activeDropdownId,
	onSetActiveDropdownId,
}: IStudentTableProps) => {
	return (
		<tr className="hover:bg-slate-50/70 transition-colors group">
			<td className="py-3.5 px-4 vertical-middle">
				{student.imageURL ? (
					<img
						src={student.imageURL}
						alt={student.firstName}
						className="w-11 h-11 rounded-full object-cover shadow-sm bg-slate-100"
					/>
				) : (
					<div className="flex items-center justify-center w-11 h-11 rounded-full shadow-sm bg-slate-100 font-semibold text-slate-700">
						{student.firstName.slice(0, 1)}
						{student?.lastName?.slice(0, 1) ?? ''}
					</div>
				)}
			</td>

			<td className="py-3.5 px-4">
				<div className="flex flex-col">
					<span className="font-semibold text-slate-900 tracking-tight leading-snug">
						{student.firstName ?? ''} {student?.lastName ?? ''}
					</span>
					<span className="text-xs text-slate-400 font-medium mt-0.5">
						{student.level ?? 'N/A'}
					</span>
				</div>
			</td>

			<td className="py-3.5 px-4 font-medium text-slate-700">{student.id}</td>

			<td className="py-3.5 px-4 font-medium text-slate-700">
				{student.email ?? 'N/A'}
			</td>

			<td className="py-3.5 px-4 vertical-middle">
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
						student.suspended
							? 'bg-red-50 text-red-700 border border-red-100'
							: 'bg-emerald-50 text-emerald-700 border border-emerald-100'
					}`}
				>
					{student.suspended ? 'Suspended' : 'Active'}
				</span>
			</td>

			<td className="py-3.5 px-4 font-medium text-slate-700">
				{student.suspendedBy
					? `${student.suspendedBy?.firstName} ${student.suspendedBy?.lastName ?? ''}`
					: `N/A`}
			</td>

			<td className="py-3.5 px-4 text-right pr-6">
				<div className="relative inline-block text-left">
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

							<div className="absolute right-0 top-9 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
								<button
									onClick={() => onAction('view', student)}
									className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
								>
									<Eye className="w-4 h-4 text-blue-500" /> View Profile
								</button>
								{student?.suspended ? (
									<button
										onClick={() => onAction('unsuspend', student)}
										className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
									>
										<UserX className="w-4 h-4 text-amber-500" /> UnSuspend
									</button>
								) : (
									<button
										onClick={() => onAction('suspend', student)}
										className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
									>
										<UserX className="w-4 h-4 text-green-500" /> Suspend
									</button>
								)}
							</div>
						</>
					)}
				</div>
			</td>
		</tr>
	);
};
