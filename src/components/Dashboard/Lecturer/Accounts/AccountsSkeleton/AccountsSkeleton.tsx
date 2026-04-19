export default function AccountsSkeleton() {
	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="animate-pulse">
					<div className="h-12 bg-gray-200 rounded-lg w-96 mb-4"></div>
					<div className="h-6 bg-gray-200 rounded-lg w-64 mb-8"></div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-4">
							<div className="h-32 bg-gray-200 rounded-xl"></div>
							<div className="h-32 bg-gray-200 rounded-xl"></div>
						</div>
						<div>
							<div className="h-96 bg-gray-200 rounded-xl"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
