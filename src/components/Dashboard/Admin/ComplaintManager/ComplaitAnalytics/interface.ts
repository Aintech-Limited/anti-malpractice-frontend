export interface IComplaintAnalyticsProps {
	metrics: {
		total: number;
		pending: number;
		inProgress: number;
		resolved: number;
	};
}
