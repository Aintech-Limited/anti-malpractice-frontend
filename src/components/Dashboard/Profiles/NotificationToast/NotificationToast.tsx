import { CheckCircle, AlertCircle } from 'lucide-react';
import { INotificationToastProps } from './interface';

export const NotificationToast = ({
	notification,
}: INotificationToastProps) => {
	if (!notification) return null;

	return (
		<div className="fixed top-4 right-4 z-50 animate-slideDown">
			<div
				className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
					notification.type === 'success'
						? 'bg-green-50 border border-green-200'
						: 'bg-red-50 border border-red-200'
				}`}
			>
				{notification.type === 'success' ? (
					<CheckCircle className="w-5 h-5 text-green-600" />
				) : (
					<AlertCircle className="w-5 h-5 text-red-600" />
				)}
				<p
					className={
						notification.type === 'success' ? 'text-green-800' : 'text-red-800'
					}
				>
					{notification.message}
				</p>
			</div>
		</div>
	);
};
