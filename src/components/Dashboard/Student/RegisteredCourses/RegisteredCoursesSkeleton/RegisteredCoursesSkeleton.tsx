export function RegisteredCoursesSkeleton() {
	return (
		<div>
			{/* Stats Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex items-center justify-between">
							<div>
								<div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
								<div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
							</div>
							<div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
						</div>
					</div>
				))}
			</div>

			{/* Filters Skeleton */}
			<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
					<div className="w-48 h-10 bg-gray-200 rounded animate-pulse" />
					<div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>

			{/* Courses Grid Skeleton */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex gap-4">
							<div className="w-24 h-32 bg-gray-200 rounded animate-pulse" />
							<div className="flex-1">
								<div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
								<div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
								<div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
								<div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
