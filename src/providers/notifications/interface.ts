import { useNotifications } from '@/src/components/Dashboard/Notifications/hooks/useNotifications';

export interface INotificationContextType {
	unreadCount: number;
	isConnected: boolean;
	markAsRead: (id: string) => Promise<void>;
	markAsUnread: (id: string) => Promise<void>;
}

export type NotificationContextProps = ReturnType<typeof useNotifications>;
