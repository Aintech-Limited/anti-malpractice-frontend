export const Legend = () => {
	const legendItems = [
		{ color: 'bg-green-500', label: 'Registered Courses' },
		{ color: 'bg-blue-500', label: 'Active Courses' },
		{ color: 'bg-gray-300', label: 'Available Courses' },
		{
			color: 'bg-gray-100 border border-gray-300',
			label: 'Locked (Prerequisites Required)',
		},
	];

	return (
		<div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
			{legendItems.map((item, index) => (
				<div key={index} className="flex items-center gap-2">
					<div className={`w-4 h-4 ${item.color} rounded`}></div>
					<span className="text-sm text-gray-700">{item.label}</span>
				</div>
			))}
		</div>
	);
};
