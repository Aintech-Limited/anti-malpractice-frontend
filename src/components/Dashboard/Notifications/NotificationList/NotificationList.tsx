'use client';

import { useState } from 'react';
import { CheckCheck, Inbox, Loader2 } from 'lucide-react';
import { INotification } from '../interface';
import NotificationModal from '../modals/NotificationModal';
import { formatDistanceToNow } from 'date-fns';
import { useNotificationContext } from '@/src/providers/notifications/NotificationProvider';

export default function NotificationList({ onClose }: { onClose: () => void }) {
	const { unreadCount, loading, markAllAsRead, notifications } =
		useNotificationContext();
	// console.log('list notifications: ', notifications);
	const [selectedNotification, setSelectedNotification] =
		useState<INotification | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getTypeStyles = (type: INotification['type']) => {
		switch (type) {
			case 'SUCCESS':
				return 'bg-green-50 border-green-200';
			case 'WARNING':
				return 'bg-yellow-50 border-yellow-200';
			case 'ERROR':
				return 'bg-red-50 border-red-200';
			case 'EXAM':
				return 'bg-blue-50 border-blue-200';
			case 'GRADE':
				return 'bg-purple-50 border-purple-200';
			default:
				return 'bg-gray-50 border-gray-200';
		}
	};

	const getTypeIcon = (type: INotification['type']) => {
		switch (type) {
			case 'SUCCESS':
				return '✓';
			case 'WARNING':
				return '⚠';
			case 'ERROR':
				return '✗';
			case 'EXAM':
				return '📝';
			case 'GRADE':
				return '🎓';
			default:
				return 'ℹ';
		}
	};

	const handleNotificationClick = (notification: INotification) => {
		setSelectedNotification(notification);
		setIsModalOpen(true);
		// onClose();
	};

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
				<div className="p-8 text-center">
					<Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
					<p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-h-125 flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
					<div>
						<h3 className="font-semibold text-gray-900">Notifications</h3>
						{unreadCount > 0 && (
							<p className="text-xs text-gray-500">{unreadCount} unread</p>
						)}
					</div>
					{unreadCount > 0 && (
						<button
							onClick={markAllAsRead}
							className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
						>
							<CheckCheck size={14} />
							Mark all as read
						</button>
					)}
				</div>

				{/* List */}
				<div className="overflow-y-auto flex-1">
					{notifications.length === 0 ? (
						<div className="p-8 text-center">
							<Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
							<p className="text-sm text-gray-500">No notifications</p>
						</div>
					) : (
						<div className="divide-y divide-gray-100">
							{notifications?.map((notification) => (
								<button
									key={notification.id}
									onClick={() => handleNotificationClick(notification)}
									className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
										!notification.isRead ? 'bg-blue-50/30' : ''
									}`}
								>
									<div className="flex gap-3">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
												!notification.isRead
													? 'bg-blue-100 text-blue-600'
													: 'bg-gray-100 text-gray-600'
											}`}
										>
											{getTypeIcon(notification.type)}
										</div>
										<div
											className={`flex-1 min-w-0 ${getTypeStyles(notification.type)}`}
										>
											<div className="flex items-start justify-between gap-2">
												<p
													className={`text-sm font-medium truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}
												>
													{notification.title}
												</p>
												<span className="text-xs text-gray-400 whitespace-nowrap">
													{formatDistanceToNow(
														new Date(notification.createdAt),
														{ addSuffix: true },
													)}
												</span>
											</div>
											<p className="text-xs text-gray-500 line-clamp-2 mt-1">
												{notification.message}
											</p>
											{!notification.isRead && (
												<div className="mt-2">
													<span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
												</div>
											)}
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Modal */}
			<NotificationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				notification={selectedNotification}
			/>
		</>
	);
}
