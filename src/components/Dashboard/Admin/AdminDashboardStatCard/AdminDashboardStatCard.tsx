export const AdminDashboardStatCard = ({
	label,
	value,
}: {
	label: string;
	value: number;
}) => (
	<div className="bg-white p-5 rounded-lg shadow-sm border border-gray-50 flex flex-col justify-between h-24">
		<span className="text-xs font-bold text-gray-800">{label}</span>
		<span className="text-2xl font-bold text-right text-gray-900">{value}</span>
	</div>
);
