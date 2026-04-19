export const MaterialsSkeleton = () => {
	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="animate-pulse">
					<div className="flex justify-between items-center mb-8">
						<div>
							<div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-48"></div>
						</div>
						<div className="h-10 bg-gray-200 rounded w-32"></div>
					</div>
					<div className="grid grid-cols-4 gap-4 mb-8">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
						))}
					</div>
					<div className="h-16 bg-gray-200 rounded-xl mb-6"></div>
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export const LoadingSkeleton = () => {
	return (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<div key={i} className="bg-white rounded-xl p-5 animate-pulse">
					<div className="flex gap-4">
						<div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
						<div className="flex-1">
							<div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
							<div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
							<div className="flex gap-4">
								<div className="h-4 bg-gray-200 rounded w-24"></div>
								<div className="h-4 bg-gray-200 rounded w-20"></div>
								<div className="h-4 bg-gray-200 rounded w-16"></div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
