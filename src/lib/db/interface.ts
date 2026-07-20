import { ILiveExamDetailsProps } from "@/src/components/Dashboard/Student/ExamChart/LiveExamDetail/interface";
import { ExamQuestionTypeEnumValue, TDBExamAnswerSyncType } from "../enums";
import { IWSViolationData } from "../hooks/interface";
import { IWSProctoringEvidenceData } from "@/src/components/Dashboard/Student/ExamChart/LiveExamDetail/OngoingLiveExam/hook/interface";

export interface IDBExam {
  id: string;
  title: string;
  startTime: Date;
  duration: number;
  submitted: boolean;
  userId: string;
  current?: boolean; // for detecting current exam saved. incase of tampering
}

export interface IDBExamMeta extends Omit<
  ILiveExamDetailsProps["examDetail"],
  "examToken" | "examAttemptId" | "proctoringId"
> {
  createdAt: Date;
  updatedAt?: Date;
}

export interface IDBExamQuestion {
  id: string;
  examId: string;
  attemptId: string;
  type: ExamQuestionTypeEnumValue;
  questionText: string;
  options?: IDBExamQuestionOption[];
  marks?: number;
  displayOrder: number;
}

export interface IDBExamQuestionOption {
  id: string;
  optionText: string;
  displayOrder: number;
}

export interface IDBExamAnswer {
  examId: string;
  attemptId: string;
  questionId: string;
  optionId?: string; // only available mcq
  answerText?: string; // only available for short answer
  updatedAt: number;
  synced: TDBExamAnswerSyncType; // marks answers periodically synced with backend. changes back to synced false on student answer chnage
}

export interface IDBExamToken {
  examId: string;
  examAttemptId: string;
  userId: string;
  proctoringId: string;
}

export interface IDBExamViolations extends IWSViolationData {
  examId: string;
  attemptId: string;
}
export interface IDBExamViolationEvidence extends IWSProctoringEvidenceData {
  examId: string;
  attemptId: string;
  userId: string;
}
