export interface IDepartment {
	id: string;
	name: string;
	addedAt?: string; // date
	courses: Course[];
}

export interface ICourse {
	id: string;
	courseCode: string;
	title: string;
	department: string;
	description: string;
	credits: number;
	semester: number;
	level: number;
	status: 'registered' | 'active' | 'available' | 'locked';
	prerequisite?: string[];
	courseSchedules?: {
		day: string;
		time: string;
		venue: string;
	}[];
	assignedLecturers?: {
		role: string;
		lecturer: {
			firstName: string;
			lastName: string;
		};
	}[]; // only added when fetched for lecturers
	isAssignedToMe?: boolean; // only added when fetched for lecturers
	progress?: number; // never added
}

export interface ICourseCatalogProps {
	departments: IDepartment[];
	activeSemester?: number;
}

export interface ICoursesCatalogQueryParams {
	searchParams: Promise<ICoursesCatalogQuery>;
}

export interface ICoursesCatalogQuery {
	page?: number;
	limit?: number;
	status?: 'ACTIVE' | 'DROPPED';
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
	search?: string;
	searchCode?: string;
}

export interface Course {
	id: string;
	courseCode: string;
	title: string;
	department: string;
	description: string;
	credits: number;
	semester: number;
	level: number;
	status: 'registered' | 'active' | 'available' | 'locked';
	prerequisite?: string[];
	lecturers?: {
		id: string;
		firstName: string;
		lastName: string;
		role?: string;
	}[];
	courseSchedules?: {
		day: string;
		time: string;
		venue: string;
	}[];
	progress?: number;
}

export interface ICourseCatalogProps {
	departments: IDepartment[];
	activeSemester?: number;
}

export interface ICoursesCatalogQueryParams {
	searchParams: Promise<ICoursesCatalogQuery>;
}

export interface ICoursesCatalogQuery {
	page?: number;
	limit?: number;
	status?: 'ACTIVE' | 'DROPPED';
	sortBy?: string;
	sortOrder?: 'ASC' | 'DESC';
	search?: string;
	searchCode?: string;
}

export type TCourseStatus = 'registered' | 'active' | 'available' | 'locked';
