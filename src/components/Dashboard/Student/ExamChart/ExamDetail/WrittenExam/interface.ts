export type QuestionType = 'smq' | 'written';

export interface Question {
	id: number;
	type: QuestionType;
	questionText: string;
	options?: string[];
}
