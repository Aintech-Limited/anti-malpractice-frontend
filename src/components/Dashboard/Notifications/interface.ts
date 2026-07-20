import { TNotificationTypeEnum } from "@/src/lib/enums";

export interface INotification {
  id: string;
  title: string;
  type: TNotificationTypeEnum;
  createdAt: string;
  updatedAt: string;

  message: string;
  userId: string;
  isRead: boolean;

  metadata?: {
    examId?: string;
    courseId?: string;
    resultId?: string;
    actionUrl?: string;
    paymentId?: string;
    reference?: string;
    [key: string]: any;
  };
}

export interface INotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: INotification[];
    extra: {
      unreadCount?: number | null;
    };
  };
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IWSNotificationData {
  id: string;
  title: string;
  message: string;
  type: TNotificationTypeEnum;
  metadata?: INotification["metadata"];
  createdAt: string;
}
