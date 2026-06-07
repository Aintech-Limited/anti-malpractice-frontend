'use client';

import { Plus } from 'lucide-react';
import {
	ILecturerDashboardProps,
	ILecturerExamStats,
	ILecturerNotification,
} from './interface';
import { formatDate } from '@/src/lib/helper';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { ProtectedRouteEnum } from '@/src/lib/enums';
import { useRouter } from 'next/navigation';
import ActionCard from './DashboardCards/ActionCard';
import StatCard from './DashboardCards/StatCard';
import NotificationItemCard from './DashboardCards/NotificationItemCard';
import { toast } from 'react-toastify';

const LecturerDashboard = ({ initialData }: ILecturerDashboardProps) => {
	const router = useRouter();
	// console.log(initialData);
	const [notifications, _setNotifications] = useState<ILecturerNotification[]>(
		initialData?.data?.recentNotifications ?? [],
	);
	// console.log('notifications: ', notifications);
	const [stats, _setStats] = useState<ILecturerExamStats>(
		initialData?.data?.stats ?? {},
	);
	// console.log('stats: ', stats);

	if (!initialData.success) {
		// console.log('sucess: ', initialData.success);
		toast.error(initialData.message);
	}

	return (
		<div className="flex min-h-screen bg-[#F1F5F9] font-sans">
			<main className="flex-1 ml-64 p-8">
				<div className="mb-10">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold text-gray-800">Notification</h2>
						{/* <button className="text-blue-600 text-sm font-bold hover:underline">
							See All
						</button> */}
					</div>
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
						{notifications.map((notification, idx) => {
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
				</div>

				<h2 className="text-xl font-bold text-gray-800 mb-6">Exam Overview</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
					<StatCard label="Total Exams" value={stats.totalExams} />

					<StatCard
						label="Completed Exams"
						value={stats.completedExams}
						color="text-green-500"
					/>
					<StatCard label="Needs Approval" value={stats.needsApproval} />
					{/* <StatCard label="Draft Exams" value="12" /> */}
					<StatCard
						label="Live Exam"
						value={stats.liveExams}
						color="text-red-500"
					/>
					<StatCard label="Upcoming Exams" value={stats.upcomingExams} />
					{/* <StatCard label="Practice Exams" value="13" /> */}
					<ActionCard
						label="Create a new exam"
						icon={
							<Plus
								onClick={() =>
									router.push(ProtectedRouteEnum.LECTURERS + '/exams')
								}
							/>
						}
					/>
				</div>
			</main>
		</div>
	);
};

export default LecturerDashboard;
