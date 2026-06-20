import { TViolationType } from '@/src/lib/proctoring/interface';

export interface IWSViolationData {
	type: TViolationType;
	severity: number;
	timestamp: number;
	metadata: Record<string, any>;
	proctoringSessionId: string;
	examAttemptId: string;
}

export interface IWSProctoringEvidenceData {
	camera: string | null;
	screen: string | null;
	timestamp: number;
	examAttemptId: string;
}
