import { IUngradedQuestion } from "../interface";

export interface IQuestionsListProps {
  questions: IUngradedQuestion[];
  onSelectQuestion: (questionId: string) => void;
  selectedQuestionId?: string;
}
