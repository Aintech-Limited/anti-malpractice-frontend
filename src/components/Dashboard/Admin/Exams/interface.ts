import {
	TAdminExamStatusValue,
	TAdminExamTypeEnumValue,
} from '@/src/lib/enums';

export interface IAdminExamsPageProps {
	searchParams: Promise<{
		page?: string;
		limit?: string;
		search?: string;
		adminStatus?: string;
		type_?: string;
		departmentId?: string;
		courseId?: string;
		published?: string;
		startDate?: string;
		endDate?: string;
	}>;
}

export interface IAdminExamsClientProps {
	initialData: IAdminExamsResponse;
	initialPage: number;
	limit: number;
	departments: IAdminExamDepartment[];
	courses: IAdminExamCourse[];
}

export interface IAdminExamCourse {
	id: string;
	title: string;
	courseCode: string;
	department: IAdminExamDepartment;
}

export interface IAdminExamDepartment {
	id: string;
	name: string;
}

export interface IAdminExamLecturer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface IAdminExam {
	id: string;
	course: IAdminExamCourse;
	lecturer: IAdminExamLecturer;
	title: string;
	startTime: string;
	endTime: string;
	registrationDeadline: string;
	durationMinutes: number;
	questionCount: number;
	usedMarks: number;
	adminStatus: TAdminExamStatusValue;
	requestedChanges?: string;
	type_: TAdminExamTypeEnumValue;
	totalMarks: number;
	fee: number;
	mcqMarks: number;
	mcqDurationMinutes?: number;
	shortMarks?: number;
	shortDurationMinutes?: number;
	published: boolean;
	resultDate?: string;
	createdAt: string;
}

export interface IAdminExamFullDetails extends IAdminExam {
	questions?: any[];
	instructions?: string;
	passingScore?: number;
	allowRetake?: boolean;
	retakeFee?: number;
}

export interface IAdminExamsResponse {
	success: boolean;
	message: string;
	page: number;
	limit: number;
	total: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	data: IAdminExam[];
}

export interface IAdminExamFilters {
	page?: number;
	limit?: number;
	search?: string;
	adminStatus?: TAdminExamStatusValue;
	type_?: TAdminExamTypeEnumValue;
	departmentId?: string;
	courseId?: string;
	published?: boolean;
	startDate?: string;
	endDate?: string;
}

export interface IAdminApproveExamData {
	examId: string;
	notes?: string;
}

export interface IAdminRequestChangesData {
	examId: string;
	changes: string;
}
