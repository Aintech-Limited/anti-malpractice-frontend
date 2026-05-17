export interface ICourseStudentsPageProps {
	params: Promise<{
		courseId: string;
	}>;
	searchParams: Promise<{
		page?: string;
		limit?: string;
		search?: string;
		faceAuthEnabled?: string;
		isBlocked?: string;
		emailVerified?: string;
		level?: string;
	}>;
}

export interface IStudentsClientProps {
	courseId: string;
	initialData: IStudentsResponse;
	initialPage: number;
	limit: number;
}

export interface ICourseStudent {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	imageUrl?: string;
	faceAuthEnabled: boolean;
	emailVerified: boolean;
	isBlocked: boolean;
	matricNumber?: string;
	department?: string;
	level?: number;
	enrollmentDate: string;
}

export interface IStudentsResponse {
	success: boolean;
	message: string;
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
	data: ICourseStudent[];
}

export interface ICourseInfo {
	id: string;
	title: string;
	courseCode: string;
	department: {
		id: string;
		name: string;
	};
}

export interface IStudentFilters {
	page?: number;
	limit?: number;
	search?: string;
	faceAuthEnabled?: boolean;
	isBlocked?: boolean;
	emailVerified?: boolean;
	level?: number;
}
