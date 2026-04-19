import { Violation } from '@/src/lib/proctoring/interface';

export interface ExamSummaryProps {
	questions: any[];
	answers: Record<number, string>;
	violations: Violation[];
	timeSpent: string;
	onClose: () => void;
}
