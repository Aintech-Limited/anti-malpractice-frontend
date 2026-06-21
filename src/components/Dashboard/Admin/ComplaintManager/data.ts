import { IComplaintRecord } from './interface';

// Mock administrative database records
export const initialComplaints: IComplaintRecord[] = [
	{
		id: 'CMP-2042',
		category: 'Infrastructure Breakdown',
		location: 'GRA, Phase 2, Port Harcourt',
		dateSubmitted: '2026-06-21',
		status: 'Pending',
		priority: 'High',
		assignedTo: 'Unassigned',
		description:
			'Main arterial drainage collapsed causing extensive flash flooding over the residential sector link paths.',
	},
	{
		id: 'CMP-2041',
		category: 'Utility Failure (Power)',
		location: 'Diobu, Ibadan',
		dateSubmitted: '2026-06-20',
		status: 'In Progress',
		priority: 'Medium',
		assignedTo: 'Engr. David K.',
		description:
			'Transformer emitting high-pitched arcing sounds. Total grid blackout across three major streets.',
	},
	{
		id: 'CMP-2040',
		category: 'Sanitation & Waste',
		location: 'Lekki Phase 1, Lagos',
		dateSubmitted: '2026-06-20',
		status: 'Resolved',
		priority: 'Low',
		assignedTo: 'Sanitation Team B',
		description:
			'Commercial waste disposal blocked access way near primary transit junctions.',
	},
	{
		id: 'CMP-2039',
		category: 'Safety & Security Concern',
		location: 'Yenagoa, Bayelsa',
		dateSubmitted: '2026-06-19',
		status: 'Pending',
		priority: 'High',
		assignedTo: 'Unassigned',
		description:
			'Streetlights malfunctioning systematically over a 2km strip, creating dark zones.',
	},
	{
		id: 'CMP-2038',
		category: 'Infrastructure Breakdown',
		location: 'Wuse II, Abuja',
		dateSubmitted: '2026-06-18',
		status: 'In Progress',
		priority: 'High',
		assignedTo: 'Admin Officer Main',
		description:
			'Severe pothole cluster damaging commuter vehicles at the primary intersection split.',
	},
	{
		id: 'CMP-2037',
		category: 'Utility Failure (Water)',
		location: 'Asaba, Delta',
		dateSubmitted: '2026-06-17',
		status: 'Resolved',
		priority: 'Medium',
		assignedTo: 'Water Works Dept',
		description:
			'Main pressure distribution pipe burst causing severe clean water runoff and zero residential delivery.',
	},
];
