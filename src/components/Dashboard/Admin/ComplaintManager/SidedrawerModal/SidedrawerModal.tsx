'use client';

import { ISidedrawerModalProps } from './interface';

export const SidedrawerModal = ({
	selectedComplaint,
	setSelectedComplaint,
}: ISidedrawerModalProps) => {
	return (
		<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end z-10 animate-in fade-in duration-200">
			<div className="bg-white h-screen max-w-lg w-full p-6 lg:p-8 shadow-2xl border-l border-slate-100 overflow-y-auto flex flex-col justify-between transform animate-in slide-in-from-right duration-200">
				<div>
					<div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
						<div>
							<span className="text-mono font-bold text-xs text-blue-600">
								{selectedComplaint.id}
							</span>
							<h3 className="text-lg font-black text-slate-900 mt-0.5">
								{selectedComplaint.category}
							</h3>
						</div>
						<button
							onClick={() => setSelectedComplaint(null)}
							className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition"
						>
							Close Review
						</button>
					</div>

					<div className="space-y-4 mb-6">
						<div>
							<span className="text-[10px] uppercase font-bold text-slate-400 block">
								Location Reference
							</span>
							<p className="text-sm font-semibold text-slate-800 mt-0.5">
								{selectedComplaint.location}
							</p>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<span className="text-[10px] uppercase font-bold text-slate-400 block">
									Filing Timestamp
								</span>
								<p className="text-xs font-semibold text-slate-700 mt-0.5">
									{selectedComplaint.dateSubmitted}
								</p>
							</div>
							<div>
								<span className="text-[10px] uppercase font-bold text-slate-400 block">
									System Case Priority
								</span>
								<p className="text-xs font-semibold text-rose-600 mt-0.5">
									{selectedComplaint.priority}
								</p>
							</div>
						</div>
						<div>
							<span className="text-[10px] uppercase font-bold text-slate-400 block">
								Full Description From User
							</span>
							<p className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl mt-1 leading-relaxed">
								&quot;{selectedComplaint.description}&quot;
							</p>
						</div>
					</div>
				</div>

				<div className="border-t border-slate-100 pt-4 flex gap-3">
					<button
						onClick={() => setSelectedComplaint(null)}
						className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
					>
						Exit Sheet
					</button>
					<button
						onClick={() => {
							alert('Status escalations submitted successfully.');
							setSelectedComplaint(null);
						}}
						className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition"
					>
						Update Case Dispatch
					</button>
				</div>
			</div>
		</div>
	);
};
