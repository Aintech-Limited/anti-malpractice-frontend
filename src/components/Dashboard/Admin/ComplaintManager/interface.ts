export interface IComplaintRecord {
	id: string;
	category: string;
	location: string;
	dateSubmitted: string;
	status: 'Pending' | 'In Progress' | 'Resolved';
	priority: 'Low' | 'Medium' | 'High';
	assignedTo: string;
	description: string;
}

export interface IAdminComplaintsManagerProps {
	initialComplaints: IComplaintRecord[];
}
