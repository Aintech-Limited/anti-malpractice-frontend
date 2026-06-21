'use client';

import { AdminDashboardStatCard } from './AdminDashboardStatCard/AdminDashboardStatCard';
import { AdminDashboardActionCard } from './AdminDashboardActionCard/AdminDashboardActionCard';
import { ProtectedRouteEnum } from '@/src/lib/enums';
import { useRouter } from 'next/navigation';
import {
	IAdminDashboardProps,
	IAdminNotification,
	IDashboardStatItem,
} from './interface';
import { toast } from 'react-toastify';
import { useState } from 'react';
import NotificationItemCard from '../Lecturer/DashboardCards/NotificationItemCard';
import { formatDate } from '@/src/lib/helper';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = ({ initialData }: IAdminDashboardProps) => {
	const router = useRouter();

	const [notifications, _setNotifications] = useState<IAdminNotification[]>(
		initialData?.data?.notifications ?? [],
	);
	const [examStats, _setExamStats] = useState<IDashboardStatItem[]>(
		initialData?.data?.examStats ?? [],
	);
	const [lecturerStats, _setLectuerStats] = useState<IDashboardStatItem[]>(
		initialData?.data?.lecturerStats ?? [],
	);

	if (!initialData.success) {
		toast.error(initialData.message);
	}

	return (
		<div className="bg-slate-50 min-h-screen p-8 font-sans text-gray-900">
			<section className="mb-10">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-bold">Notification</h2>
					{/* <button className="text-blue-600 text-xs font-semibold hover:underline">
						See All
					</button> */}
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
					{notifications?.map((notification, idx) => {
						return (
							<NotificationItemCard
								key={notification.id}
								title={notification.title}
								time={formatDistanceToNow(notification.createdAt, {
									addSuffix: true,
								})}
								date={formatDate(notification.createdAt)}
								border={idx < 2}
								type={notification.type}
								message={notification.message}
							/>
						);
					})}
				</div>
			</section>

			<section className="mb-10">
				<h2 className="text-lg font-bold mb-6">Exam Overview</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{examStats?.map((stat, i) => (
						<AdminDashboardStatCard
							key={i}
							label={stat.label}
							value={stat.value}
						/>
					))}
				</div>
			</section>

			<section>
				<h2 className="text-lg font-bold mb-6">Lecturers Summary</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{lecturerStats?.map((stat, i) => (
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
