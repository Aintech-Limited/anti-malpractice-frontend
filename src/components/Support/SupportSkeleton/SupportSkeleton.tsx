export function SupportSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="max-w-xl mx-auto mb-8">
				<div className="h-12 bg-gray-200 rounded-lg"></div>
			</div>

			<div className="flex flex-wrap gap-2 justify-center mb-8">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
				))}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
					>
						<div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
						<div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
						<div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
						<div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
						<div className="flex justify-between">
							<div className="h-4 w-16 bg-gray-200 rounded"></div>
							<div className="h-4 w-20 bg-gray-200 rounded"></div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
