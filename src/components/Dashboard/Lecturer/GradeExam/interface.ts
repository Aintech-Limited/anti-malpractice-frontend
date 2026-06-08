import { ExamQuestionTypeEnumValue } from '@/src/lib/enums';

export interface IGradeExamPageProps {
	params: Promise<{ examId: string }>;
	searchParams: Promise<{
		page?: string;
		limit?: string;
	}>;
}

export interface IGradeExamsClientProps {
	examId: string;
	examTitle: string;
	initialQuestionsData: IGetUngradedQuestionResponse;
}

export interface IUngradedQuestion {
	id: string;
	questionText: string;
	marks: number;
	displayOrder: number;
	totalSubmissions: number;
	gradedCount: number;
	pendingCount: number;
	progressPercentage: number;
}

export interface IGetUngradedQuestionResponse {
	data: { examTitle: string; ungradedQuestions: IUngradedQuestion[] };
	message: string;
	success: boolean;
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}
export interface IGetUngradedAnswersResponse {
	data: {
		question: IQuestionDetails;
		answers: IUngradedAnswer[];
		summary: IGradingSummary;
	};
	message: string;
	success: boolean;
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export interface IUngradedAnswer {
	id: string;
	answerText: string;
	studentName: string;
	studentEmail: string;
	matricNumber?: string;
	submittedAt: string;
	maxMarks: number;
	currentMarksAwarded?: number | null;
}

export interface IQuestionDetails {
	id: string;
	questionText: string;
	marks: number;
	type: ExamQuestionTypeEnumValue;
}

export interface IGradingSummary {
	totalItems: number;
	gradedSoFar: number;
	remainingToGrade: number;
}

export interface IBulkGradeRequest {
	examId: string;
	questionId: string;
	grades: Array<{
		answerId: string;
		marksAwarded: number;
	}>;
}

export interface IGradeItem {
	answerId: string;
	studentName: string;
	answerText: string;
	marksAwarded: number | null;
	maxMarks: number;
}
