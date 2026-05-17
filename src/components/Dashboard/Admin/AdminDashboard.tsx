'use client';

import { AdminDashboardStatCard } from './AdminDashboardStatCard/AdminDashboardStatCard';
import { AdminDashboardActionCard } from './AdminDashboardActionCard/AdminDashboardActionCard';
import { ProtectedRouteEnum } from '@/src/lib/enums';
import { useRouter } from 'next/navigation';
import { IAdminDashboardProps } from './interface';

const AdminDashboard = ({ initialData }: IAdminDashboardProps) => {
	const router = useRouter();

	return (
		<div className="bg-slate-50 min-h-screen p-8 font-sans text-gray-900">
			<section className="mb-10">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-bold">Notification</h2>
					<button className="text-blue-600 text-xs font-semibold hover:underline">
						See All
					</button>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					{initialData.notifications.map((notif, index) => (
						<div key={index} className="group">
							<div className="p-5">
								<div className="flex justify-between items-start mb-1">
									<h3 className="font-bold text-sm">Upcoming Exam</h3>
									<span className="text-[10px] text-gray-500 font-medium">
										{notif.time}
									</span>
								</div>
								<p className="text-[11px] text-gray-700 font-semibold mb-1">
									Title: {notif.title}, Date: {notif.date}
								</p>
								<p className="text-[11px] text-gray-500 leading-relaxed">
									Description: Reminder for the upcoming {notif.title} scheduled
									on {notif.date}. Make sure all preparations are in place.
								</p>
							</div>
							{index !== initialData.notifications.length - 1 && (
								<div className="mx-5 border-b border-gray-100" />
							)}
						</div>
					))}
				</div>
			</section>

			<section className="mb-10">
				<h2 className="text-lg font-bold mb-6">Exam Overview</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{initialData.examStats.map((stat, i) => (
						<AdminDashboardStatCard
							key={i}
							label={stat.label}
							value={stat.value}
						/>
					))}
					{/* <AdminDashboardActionCard label="Create a new exam" /> */}
				</div>
			</section>

			<section>
				<h2 className="text-lg font-bold mb-6">Lecturers Summary</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{initialData.lecturerStats.map((stat, i) => (
						<AdminDashboardStatCard
							key={i}
							label={stat.label}
							value={stat.value}
						/>
					))}
					<AdminDashboardActionCard
						label="Add new lecturer"
						onAction={() =>
							router.push(ProtectedRouteEnum.ADMINS + '/lecturers')
						}
					/>
				</div>
			</section>
		</div>
	);
};

export default AdminDashboard;
