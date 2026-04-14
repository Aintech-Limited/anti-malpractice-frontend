export default function ProfileSkeleton() {
	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="animate-pulse">
					<div className="h-12 bg-gray-200 rounded-lg w-64 mb-8"></div>
					<div className="bg-white rounded-2xl shadow-sm p-8">
						<div className="space-y-6">
							{[1, 2, 3, 4].map((i) => (
								<div key={i}>
									<div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
									<div className="h-10 bg-gray-200 rounded"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
