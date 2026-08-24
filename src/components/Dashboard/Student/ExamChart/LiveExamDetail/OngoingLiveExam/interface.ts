import { ExamQuestionTypeEnumValue } from "@/src/lib/enums";

export interface Question {
  id: number;
  type: ExamQuestionTypeEnumValue;
  questionText: string;
  options?: string[];
}

export interface IOngoingLiveExamProps {
  initialExamId: string;
  initialProctoringId: string;
  initialExamAttemptId: string;
  initialDurationTime: string;
}
