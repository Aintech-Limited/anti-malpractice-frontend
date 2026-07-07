'use client';

import { useState } from 'react';
import { IComplaint, IComplaintsClientProps, IMeta } from './interface';
import { ComplaintDetails } from './ComplaintDetails/ComplaintDetails';

export default function ComplaintsClient({
	initialData,
	meta: initialMeta,
	currentFilters,
}: IComplaintsClientProps) {
	const [selectedComplaint, setSelectedComplaint] = useState<IComplaint | null>(
		null,
	);
	const [complaints, setComplaints] = useState<IComplaint[]>(initialData);
	const [loading, setLoading] = useState<boolean>(false);
	const [meta, setMeta] = useState<IMeta>(initialMeta);
	const [searchVal, setSearchVal] = useState<string>(
		currentFilters?.search ?? '',
	);

	const updateFilters = async (newFilters: Record<string, string>) => {
		setLoading(true);
		const filters = Object.fromEntries(
			Object.entries(newFilters).filter(([_key, value]) => !!value),
		);
		const params = new URLSearchParams({ ...currentFilters, ...filters });
		const response = await fetch(`/api/v1/complaints?${params.toString()}`);
		const data = await response.json();
		if (data.success) {
			setComplaints(data.data);
			setMeta(data.meta);
		}
		setLoading(false);
	};

	const handleSearchSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateFilters({
			...(searchVal.length > 2 && { search: searchVal }),
			page: '1',
		});
	};

	return (
		<div className="space-y-6">
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
				<form onSubmit={handleSearchSubmit} className="flex-1 min-w-60">
					<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
						Search Keywords
					</label>
					<div className="flex gap-2">
						<input
							type="text"
							value={searchVal}
							onChange={(e) => setSearchVal(e.target.value)}
							placeholder="Search complaints..."
							className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-blue-500"
						/>
						<button
							type="submit"
							disabled={loading || searchVal?.length < 2}
							className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
						>
							Find
						</button>
					</div>
				</form>

				<div>
					<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
						Status
					</label>
					<select
						value={currentFilters.status}
						onChange={(e) =>
							updateFilters({ status: e.target.value, page: '1' })
						}
						disabled={loading}
						className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-blue-500"
					>
						<option value="">All</option>
						<option value="PENDING">Pending</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="RESOLVED">Resolved</option>
					</select>
				</div>

				<div>
					<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
						Category
					</label>
					<select
						value={currentFilters.category}
						onChange={(e) =>
							updateFilters({ category: e.target.value, page: '1' })
						}
						className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-blue-500"
						disabled={loading}
					>
						<option value="">All</option>
						<option value="SANITATION">Sanitation</option>
						<option value="SECURITY">Security</option>
						<option value="ACADEMICS">Academics</option>
						<option value="MAINTENANCE">Maintenance</option>
					</select>
				</div>

				<div>
					<label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
						Per Page
					</label>
					<select
						disabled={loading}
						value={currentFilters.limit}
						onChange={(e) =>
							updateFilters({ limit: e.target.value, page: '1' })
						}
						className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-blue-500"
					>
						<option value="10">10</option>
						<option value="25">25</option>
						<option value="50">50 (Max)</option>
					</select>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
							<th className="p-4">Category</th>
							<th className="p-4">Location</th>
							<th className="p-4">Priority</th>
							<th className="p-4">Status</th>
							<th className="p-4">Created At</th>
							<th className="p-4">Actions</th>
						</tr>
					</thead>
					<tbody className="text-sm divide-y divide-gray-100 text-gray-700">
						{complaints.length === 0 ? (
							<tr>
								<td colSpan={6} className="p-8 text-center text-gray-400">
									No complaints match your selection criteria.
								</td>
							</tr>
						) : (
							complaints.map((complaint) => (
								<tr
									key={complaint.id}
									className="hover:bg-gray-50/70 transition"
								>
									<td className="p-4 font-medium text-gray-900">
										{complaint.category.replaceAll('_', ' ')}
									</td>
									<td className="p-4">{complaint.location}</td>
									<td className="p-4">
										<span
											className={`px-2 py-0.5 rounded-full text-xs font-medium ${complaint.priority === 'HIGH' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}
										>
											{complaint.priority}
										</span>
									</td>
									<td className="p-4">
										<span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
											{complaint.status}
										</span>
									</td>
									<td className="p-4 text-gray-500">
										{new Date(complaint.createdAt).toLocaleDateString()}
									</td>
									<td className="p-4">
										<button
											onClick={() => setSelectedComplaint(complaint)}
											className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
										>
											View Details
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{meta.totalPages && meta.totalPages > 1 && (
				<div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
					<div className="text-xs text-gray-500">
						Showing Page{' '}
						<span className="font-semibold text-gray-700">{meta.page}</span> of{' '}
						<span className="font-semibold text-gray-700">
							{meta.totalPages}
						</span>
					</div>
					<div className="flex gap-2">
						<button
							disabled={!meta.hasPreviousPage || loading}
							onClick={() =>
								updateFilters({ page: String((meta.page || 1) - 1) })
							}
							className="px-3 py-1 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
						>
							Previous
						</button>
						<button
							disabled={!meta.hasNextPage || loading}
							onClick={() =>
								updateFilters({ page: String((meta.page || 1) + 1) })
							}
							className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition"
						>
							Next
						</button>
					</div>
				</div>
			)}

			{selectedComplaint && (
				<ComplaintDetails
					selectedComplaint={selectedComplaint}
					setSelectedComplaint={setSelectedComplaint}
				/>
			)}
		</div>
	);
}
