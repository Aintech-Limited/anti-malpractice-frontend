const StatCard = ({
	label,
	value,
	color = 'text-gray-800',
}: {
	label: string;
	value: number;
	color?: string;
}) => (
	<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
		<p className="text-xs font-bold text-gray-500 mb-4 group-hover:text-blue-600 transition-colors">
			{label}
		</p>
		<p className={`text-3xl font-bold text-right ${color}`}>{value}</p>
	</div>
);

export default StatCard;
