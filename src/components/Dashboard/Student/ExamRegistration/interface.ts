export interface IExamRegistrationProps {
	initialExams: IExam[];
	initialMeta: any;
}

export interface IExamRegistrationPageProps {
	searchParams: Promise<{
		page?: string;
		limit?: string;
		status?: string;
	}>;
}

export interface IExamRegistrationForm {
	semester: string;
	level: string;
	matricNo?: string;
}

export interface IExam {
	id: string;
	title: string;
	courseCode: string;
	date: string;
	registrationDeadline: string;
	fee: string;
	status: TExamStatus;
	isRegistered?: boolean;
	examRegistrationId?: string;
}

export type TExamStatus = 'UPCOMING' | 'STARTED' | 'ENDED';

export interface IExamRegistrationPayload {
	examId: string;
	level: number;
	semester: number;
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
	data: IExam[];
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface IRegistrationModalProps {
	exam: IExam;
	isOpen: boolean;
	onClose: () => void;
	onRegisterLater: (
		examId: string,
		level: number,
		semester: number,
	) => Promise<IExamRegistrationResponse | void>;
	onRegisterAndPay: (
		examId: string,
		level: number,
		semester: number,
	) => Promise<IExamRegistrationResponse | void>;
	isLoading: boolean;
}

export interface IExamRegistrationResponse {
	message: string; // "Exam registration created successfully",
	success: boolean; // true,
	data?: {
		id: string; // "019c3ce1-77d9-730f-bdad-bfb549dc9a64",
		paymentId: string; //  "019c3ce1-77d9-730f-bdad-bfb549dc9a64"
	};
}
