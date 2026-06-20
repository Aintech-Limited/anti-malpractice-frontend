export type TMetricSection = {
	title: 'Full Marks' | 'Duration' | 'Total Questions';
	MCQ: string;
	SHORT: string;
	Total: string;
};

export type TDateAndTimeSection = {
	title: 'Date and Time';
	date: string;
	time: string;
	result: string;
};

export interface ILiveExamDetailsProps {
	examDetail: {
		fullMarks: TMetricSection;
		duration: TMetricSection;
		totalQuestions: TMetricSection;
		DateAndTime: TDateAndTimeSection;
		examId: string;
		examTitle: string;
		examAttemptId: string;
		proctoringId: string;
		isFresh: boolean;
		startTime: number; // Date.now()
		startTimeISO: number; // new Date().toISOString()
	};
	success: boolean;
	message: string;
	statusCode: number;
}

export interface ILiveExamDetailResponse {
	success: boolean;
	message: string;
	data: ILiveExamDetailsProps['examDetail'];
	statusCode?: number;
}
