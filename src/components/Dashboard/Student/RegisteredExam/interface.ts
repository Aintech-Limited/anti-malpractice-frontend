export interface IRegisteredExamsPageProps {
	searchParams: Promise<{
		page?: string;
		limit?: string;
		sortBy?: string;
		sortOrder?: string;
		status?: string;
	}>;
}

export interface IExamRegistration {
	id: string;
	level: number;
	paymentId: string | null;
	semester: string;
	registeredAt: string;
	registrationStatus: 'IN_PROGRESS' | 'FAILED' | 'REGISTERED';
	exam: {
		id: string;
		title: string;
		startTime?: string;
		endTime?: string;
		fee?: number;
	};
	course: {
		id: string;
		courseCode: string;
		department?: {
			name: string;
		};
	};
}

export interface IPaymentInitiatePayload {
	materialId: string;
	materialType: 'EXAM_REGISTRATION';
	provider: 'FLUTTERWAVE';
}

export interface IPaymentInitiateResponse {
	message: string;
	success: boolean;
	data: {
		link: string;
		transactionRef: string;
		provider: string;
		merchandiseType: string;
	};
}

export interface IExamsApiResponse {
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

export interface IRegisteredExamsProps {
	initialExams: IExamRegistration[];
	initialMeta: IExamsApiResponse['meta'];
	initialFilters: {
		page: number;
		limit: number;
		sortBy: string;
		sortOrder: string;
		status: string;
	};
}

export interface IRegisteredExamsFilters {
	page: number;
	limit: number;
	sortBy: string;
	sortOrder: string;
	status: string;
}
