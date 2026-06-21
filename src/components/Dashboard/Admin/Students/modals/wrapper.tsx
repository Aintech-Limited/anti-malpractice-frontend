/* eslint-disable @next/next/no-img-element */
'use client';

import { X } from 'lucide-react';
import { IModalWrapperProps } from './interface';

export const ModalWrapper = ({
	onSetModalState,
	modalState,
}: IModalWrapperProps) => {
	return (
		<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-10 p-4 animate-in fade-in duration-200">
			<div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all scale-100 animate-in zoom-in-95 duration-200 relative">
				<button
					onClick={() => onSetModalState({ type: null, student: null })}
					className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-black rounded-full transition-colors"
				>
					<X className="w-5 h-5" />
				</button>

				<div className="flex flex-col items-center text-center mt-2">
					<img
						src={modalState.student?.avatarUrl ?? '/a.png'}
						alt={modalState?.student?.name ?? 'Student Image'}
						className="w-16 h-16 rounded-full object-cover shadow-md mb-3 border-2 border-slate-50"
					/>
					<h3 className="text-lg font-bold text-slate-900">
						{modalState?.student?.name ?? 'Student Image'}
					</h3>
					<p className="text-xs text-slate-400 font-medium mb-4">
						{modalState?.student?.studentId ?? 'N/A'} •{' '}
						{modalState?.student?.level ?? 'N/A'}
					</p>

					<div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left mb-6">
						<span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
							Modal Action Triggered
						</span>
						<p className="text-sm font-semibold text-slate-800 capitalize">
							{modalState.type} Action Request
						</p>
						<p className="text-xs text-slate-500 mt-1 leading-relaxed">
							placeholder text.
						</p>
					</div>

					<div className="flex gap-3 w-full">
						<button
							onClick={() => onSetModalState({ type: null, student: null })}
							className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
						>
							Cancel
						</button>
						<button
							onClick={() => {
								alert(
									`Action "${modalState.type}" successfully updated for ${modalState.student?.name}`,
								);
								onSetModalState({ type: null, student: null });
							}}
							className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition ${
								modalState.type === 'block'
									? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
									: modalState.type === 'suspend'
										? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
										: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
							}`}
						>
							Confirm Action
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
