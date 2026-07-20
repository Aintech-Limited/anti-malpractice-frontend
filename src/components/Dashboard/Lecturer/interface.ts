import { TNotificationTypeEnum } from "@/src/lib/enums";

export interface ILecturerExamStats {
  totalExams: number;
  completedExams: number;
  needsApproval: number;
  liveExams: number;
  upcomingExams: number;
}

export interface ILecturerNotification {
  id: string;
  isRead: boolean;
  title: string;
  message: string;
  type: TNotificationTypeEnum;
  createdAt: string; // ISO Date String
}

export interface ILecturerDashboardData {
  stats: ILecturerExamStats;
  recentNotifications: ILecturerNotification[];
}

export interface ILecturerDashboardResponse {
  success: boolean;
  message: string;
  data: ILecturerDashboardData;
}
export interface ILecturerDashboardProps {
  initialData: ILecturerDashboardResponse;
}
