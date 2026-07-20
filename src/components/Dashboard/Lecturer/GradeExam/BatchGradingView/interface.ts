import { IQuestionDetails, IUngradedAnswer } from "../interface";

export interface IBatchGradingViewProps {
  question: IQuestionDetails;
  answers: IUngradedAnswer[];
  summary: {
    totalItems: number;
    gradedSoFar: number;
    remainingToGrade: number;
  };
  onBack: () => void;
  onSubmit: (
    grades: Array<{ answerId: string; marksAwarded: number }>,
  ) => Promise<void>;
  isSubmitting?: boolean;
}
