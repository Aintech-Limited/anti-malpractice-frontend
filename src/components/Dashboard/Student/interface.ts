export interface IStudentDashboardProps {
  initialData: IStudentDashboardData;
}

export interface StatsItem {
  label: string;
  value: number;
  id: string;
}

export interface ExamLikeItem {
  title: string;
  time: string;
  id: string;
}

export interface IStudentDashboardData {
  stats: StatsItem[];
  liveExams: ExamLikeItem[];
  upcomingExamsThisWeek: ExamLikeItem[];
  upcomingExamsToday: ExamLikeItem[];
  results: ExamLikeItem[];
}

export interface IStudentDashboardResponse {
  message: string;
  success: boolean;
  data: IStudentDashboardData;
}
