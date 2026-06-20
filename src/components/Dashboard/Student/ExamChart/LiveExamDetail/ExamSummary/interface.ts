import { IDBExamAnswer, IDBExamQuestion } from '@/src/lib/db/interface';
import { TViolation } from '@/src/lib/proctoring/interface';

export interface ExamSummaryProps {
	questions: IDBExamQuestion[];
	answers: Record<string, IDBExamAnswer>;
	violations: TViolation[];
	timeSpent: string;
	onClose: () => void;
}
