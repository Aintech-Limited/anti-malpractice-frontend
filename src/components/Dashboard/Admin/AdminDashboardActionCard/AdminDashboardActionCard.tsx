'use client';
import { Plus } from 'lucide-react';

export const AdminDashboardActionCard = ({
	label,
	onAction,
}: {
	label: string;
	onAction: () => void;
}) => (
	<button className="bg-slate-200 p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center h-24 hover:bg-slate-300 transition-colors group">
		<Plus
			className="w-6 h-6 text-gray-800 mb-1 group-hover:scale-110 transition-transform"
			onClick={onAction}
		/>
		<span className="text-xs font-bold text-gray-800">{label}</span>
	</button>
);
