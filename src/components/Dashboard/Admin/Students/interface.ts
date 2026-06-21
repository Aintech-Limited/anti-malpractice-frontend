export interface IStudent {
	id: string;
	name: string;
	level: string;
	studentId: string;
	year: string;
	avatarUrl: string;
}

export type TActionType = 'view' | 'suspend' | 'block' | null;
