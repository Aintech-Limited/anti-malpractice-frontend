import { TNotificationTypeEnum } from "@/src/lib/enums";

export interface IAdminDashboardProps {
  initialData: IAdminDashboardResponse;
}

export interface IDashboardStatItem {
  label: string;
  value: number;
}

export interface IAdminNotification {
  id: string;
  isRead: boolean;
  title: string;
  message: string;
  type: TNotificationTypeEnum;
  createdAt: string; // ISO Date String
}

export interface IAdminDashboardResponse {
  data: {
    notifications: IAdminNotification[];
    examStats: IDashboardStatItem[];
    lecturerStats: IDashboardStatItem[];
  };
  message: string;
  success: boolean;
}
