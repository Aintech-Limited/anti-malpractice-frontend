export interface IDepartmentsPageProps {
	searchParams: Promise<{
		page?: string;
		limit?: string;
	}>;
}

export interface IDepartmentsClientProps {
	initialData: IDepartmentsResponse;
	initialPage: number;
	limit: number;
}

export interface IAdmin {
	id: string;
	name: string;
	email: string;
}

export interface IDepartment {
	id: string;
	name: string;
	description: string;
	activeSemester: number | string;
	imageUrl?: string;
	createdAt: string;
	admin: IAdmin;
}

export interface IDepartmentsResponse {
	success: boolean;
	message: string;
	meta: {
		page: number;
		limit: number;
		totalPages: number;
		totalItems: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
	data: IDepartment[];
}

export interface ICreateDepartmentData {
	name: string;
	description: string;
	activeSemester: number | string;
	imageUrl?: string;
}

export interface IUpdateDepartmentData {
	id: string;
	name?: string;
	description?: string;
	activeSemester?: number | string;
	imageUrl?: string;
	adminId?: string;
}

export interface IDepartmentActionResponse {
	success: boolean;
	message: string;
	data?: IDepartment;
}
