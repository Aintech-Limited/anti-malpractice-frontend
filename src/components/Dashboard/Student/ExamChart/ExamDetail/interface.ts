export const ExamStage = Object.freeze({
	SMQ: 'SMQ',
	WRITTEN: 'WRITTEN',
	SUBMITTED: 'SUBMITTED',
});

export type ExamStageKey = keyof typeof ExamStage;
export type ExamStageValue = (typeof ExamStage)[keyof typeof ExamStage];
