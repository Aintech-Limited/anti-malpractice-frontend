'use client';

import { useState, useMemo } from 'react';
import {
	MoreVertical,
	Eye,
	UserCheck,
	CheckSquare,
	TrendingUp,
} from 'lucide-react';
import { IAdminComplaintsManagerProps, IComplaintRecord } from './interface';
import { ComplaintAnalytics } from './ComplaitAnalytics/ComplaintAnalytics';
import { SearchFilter } from './SearchFilter/SearchFilter';
import { PaginationAction } from './PaginationAction/PaginationAction';
import { SidedrawerModal } from './SidedrawerModal/SidedrawerModal';

export default function AdminComplaintsManager({
	initialComplaints,
}: IAdminComplaintsManagerProps) {
	const [complaints, setComplaints] = useState<IComplaintRecord[]>(
		initialComplaints ?? [],
	);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('All');
	const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedComplaint, setSelectedComplaint] =
		useState<IComplaintRecord | null>(null);

	const itemsPerPage = 5;

	const filteredRecords = useMemo(() => {
		return complaints.filter((item) => {
			const matchesSearch =
				item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.category.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus =
				statusFilter === 'All' || item.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [complaints, searchQuery, statusFilter]);

	const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
	const paginatedRecords = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredRecords, currentPage]);

	const metrics = useMemo(() => {
		return {
			total: complaints.length,
			pending: complaints.filter((c) => c.status === 'Pending').length,
			inProgress: complaints.filter((c) => c.status === 'In Progress').length,
			resolved: complaints.filter((c) => c.status === 'Resolved').length,
		};
	}, [complaints]);

	return (
		<div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-800">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div>
					<h1 className="text-2xl font-black tracking-tight text-slate-900">
						Complaints Resolution Control
					</h1>
					<p className="text-xs text-slate-500 font-medium mt-0.5">
						Review, dispatch, and track regional public complaint tickers.
					</p>
				</div>
				<div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs font-bold text-emerald-600">
					<TrendingUp className="w-4 h-4" /> System Live Account
				</div>
			</div>

			<ComplaintAnalytics metrics={metrics} />

			<div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs overflow-visible">
				<div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
					<SearchFilter
						searchQuery={searchQuery}
						setCurrentPage={setCurrentPage}
						setSearchQuery={setSearchQuery}
						setStatusFilter={setStatusFilter}
						statusFilter={statusFilter}
					/>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider bg-slate-50/50">
								<th className="py-4 px-6">Complaint ID</th>
								<th className="py-4 px-4">Category</th>
								<th className="py-4 px-4">Location Reference</th>
								<th className="py-4 px-4">Status</th>
								<th className="py-4 px-4">Priority</th>
								<th className="py-4 px-4">Assignee</th>
								<th className="py-4 px-6 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-xs font-medium">
							{paginatedRecords.length > 0 ? (
								paginatedRecords.map((record) => (
									<tr
										key={record.id}
										className="hover:bg-slate-50/60 transition-colors group"
									>
										{/* ID */}
										<td className="py-4 px-6 font-mono font-bold text-slate-900">
											{record.id}
										</td>

										<td className="py-4 px-4 text-slate-900 font-semibold">
											{record.category}
										</td>

										<td className="py-4 px-4 text-slate-500 max-w-45 truncate">
											{record.location}
										</td>

										<td className="py-4 px-4">
											<span
												className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] ${
													record.status === 'Pending'
														? 'bg-rose-50 text-rose-600 border border-rose-100'
														: record.status === 'In Progress'
															? 'bg-amber-50 text-amber-600 border border-amber-100'
															: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
												}`}
											>
												{record.status}
											</span>
										</td>

										<td className="py-4 px-4">
											<span
												className={`font-bold ${
													record.priority === 'High'
														? 'text-rose-500'
														: record.priority === 'Medium'
															? 'text-amber-500'
															: 'text-slate-400'
												}`}
											>
												{record.priority}
											</span>
										</td>

										<td className="py-4 px-4 text-slate-600 font-semibold">
											{record.assignedTo}
										</td>

										<td className="py-4 px-6 text-right relative">
											<button
												onClick={() =>
													setActiveMenuId(
														activeMenuId === record.id ? null : record.id,
													)
												}
												className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-black rounded-lg transition"
											>
												<MoreVertical className="w-4 h-4" />
											</button>

											{activeMenuId === record.id && (
												<>
													<div
														className="fixed inset-0 z-10"
														onClick={() => setActiveMenuId(null)}
													/>
													<div className="absolute right-6 top-10 w-44 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-20 text-left">
														<button
															onClick={() => {
																setSelectedComplaint(record);
																setActiveMenuId(null);
															}}
															className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
														>
															<Eye className="w-3.5 h-3.5 text-blue-500" /> View
															Details
														</button>
														<button
															onClick={() => {
																alert(
																	`Assigning case ${record.id} to current user.`,
																);
																setActiveMenuId(null);
															}}
															className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
														>
															<UserCheck className="w-3.5 h-3.5 text-indigo-500" />{' '}
															Assign to Me
														</button>
														<button
															onClick={() => {
																alert(`Marking case ${record.id} as resolved.`);
																setActiveMenuId(null);
															}}
															className="w-full px-4 py-2 hover:bg-slate-50 text-emerald-600 font-bold flex items-center gap-2 border-t border-slate-100"
														>
															<CheckSquare className="w-3.5 h-3.5 text-emerald-500" />{' '}
															Mark Resolved
														</button>
													</div>
												</>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="text-center py-12 text-slate-400 font-medium"
									>
										No complaints matching your filtering options found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{totalPages > 1 && (
					<PaginationAction
						currentPage={currentPage}
						filteredRecords={filteredRecords}
						itemsPerPage={itemsPerPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
					/>
				)}
			</div>

			{selectedComplaint && (
				<SidedrawerModal
					selectedComplaint={selectedComplaint}
					setSelectedComplaint={setSelectedComplaint}
				/>
			)}
		</div>
	);
}
