import {
	IDBExamAnswer,
	IDBExamQuestion,
	IDBExamQuestionOption,
} from '@/src/lib/db/interface';

export interface IQuestionCardProps {
	question: IDBExamQuestion;
	onMCQInputChange: (
		questionId: string,
		questionOption: IDBExamQuestionOption,
	) => void;
	onSHORTInputChange: (questionId: string, answerText: string) => void;
	answers: Record<string, IDBExamAnswer>;
}
