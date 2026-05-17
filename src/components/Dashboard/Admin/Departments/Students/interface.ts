export interface IDepartmentStudentsPageProps {
	params: Promise<{
		departmentId: string;
	}>;
	searchParams: Promise<{
		page?: string;
		limit?: string;
	}>;
}

export interface IStudentsClientProps {
	departmentId: string;
	initialData: IDepartmentStudentsResponse;
	initialPage: number;
	limit: number;
}

export interface IDepartmentStudent {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	emailVerified: boolean;
	faceAuthEnabled: boolean;
	isBlocked: boolean;
	dob: string;
	sex: string;
	phoneContact: string;
	createdAt: string;
	image?: string;
}

export interface IDepartmentStudentsResponse {
	success: boolean;
	message: string;
	meta: {
		page: number;
		limit: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
	data: IDepartmentStudent[];
}

export interface IBlockUnblockResponse {
	success: boolean;
	message: string;
}

export interface ISendEmailResponse {
	success: boolean;
	message: string;
}
