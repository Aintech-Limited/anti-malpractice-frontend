export interface IAdminDashboardProps {
	initialData: {
		notifications: { title: string; date: string; time: string }[];
		examStats: { label: string; value: number }[];
		lecturerStats: { label: string; value: number }[];
	};
}
