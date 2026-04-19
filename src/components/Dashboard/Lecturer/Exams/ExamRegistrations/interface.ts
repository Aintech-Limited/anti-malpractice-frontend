export interface IIExamRegistrationsPageProps {
	params: Promise<{
		examId: string;
	}>;
	searchParams: Promise<{
		page?: string;
		limit?: string;
		sortBy?: string;
		sortOrder?: string;
		status?: string;
		level?: string;
		semester?: string;
	}>;
}

export interface IExamRegistration {
	level: number;
	semester: string;
	registeredAt: string;
	registrationStatus: TRegistrationStatus;
	exam: {
		id: string;
		title: string;
	};
	course: {
		id: string;
		courseCode: string;
		department?: {
			name: string;
		};
	};
	student: {
		firstName: string;
		lastName: string;
		email?: string;
		profileType?: string;
	};
}

export interface IExamDetails {
	id: string;
	title: string;
	startTime: string;
	endTime: string;
	type_: string;
	totalMarks: number;
	fee: number;
	status: string;
}

export interface IRegistrationsApiResponse {
	message: string;
	success: boolean;
	data: IExamRegistration[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface IExamRegistrationsProps {
	initialRegistrations: IExamRegistration[];
	initialMeta: any;
	exam: IExamDetails | null;
	examId: string;
	initialFilters: {
		page: number;
		limit: number;
		sortBy: string;
		sortOrder: string;
		status: string;
		level: string;
		semester: string;
	};
}

export type TRegistrationStatus =
	| 'REGISTERED'
	| 'IN_PROGRESS'
	| 'CANCELLED'
	| 'FAILED';

export interface IExamRegisteredFilters {
	page: number;
	limit: number;
	sortBy: string;
	sortOrder: string;
	status: string;
	level: string;
	semester: string;
}
