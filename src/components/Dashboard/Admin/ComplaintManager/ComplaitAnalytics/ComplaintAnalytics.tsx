'use client';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { IComplaintAnalyticsProps } from './interface';

export const ComplaintAnalytics = ({ metrics }: IComplaintAnalyticsProps) => {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
				<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
					Total Received
				</span>
				<span className="text-2xl font-black block mt-1">{metrics.total}</span>
			</div>
			<div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-start">
				<div>
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
						Pending Review
					</span>
					<span className="text-2xl font-black text-rose-600 block mt-1">
						{metrics.pending}
					</span>
				</div>
				<span className="p-1 bg-rose-50 text-rose-500 rounded-lg">
					<AlertCircle className="w-4 h-4" />
				</span>
			</div>
			<div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-start">
				<div>
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
						In Progress
					</span>
					<span className="text-2xl font-black text-amber-500 block mt-1">
						{metrics.inProgress}
					</span>
				</div>
				<span className="p-1 bg-amber-50 text-amber-500 rounded-lg">
					<Clock className="w-4 h-4" />
				</span>
			</div>
			<div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-start">
				<div>
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
						Resolved
					</span>
					<span className="text-2xl font-black text-emerald-600 block mt-1">
						{metrics.resolved}
					</span>
				</div>
				<span className="p-1 bg-emerald-50 text-emerald-500 rounded-lg">
					<CheckCircle className="w-4 h-4" />
				</span>
			</div>
		</div>
	);
};
