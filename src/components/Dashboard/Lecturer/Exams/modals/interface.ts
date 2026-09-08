import { ICourseAssignment, IExam, IExamQuestion } from "../interface";

export interface ICreateExamModalProps {
  courses: ICourseAssignment[];
  onClose: () => void;
  onSuccess: (exam: any) => void;
}

export interface IDeleteExamModalProps {
  exam: IExam;
  onClose: () => void;
  onSuccess: () => void;
}

export interface IUpdateExamModalProps {
  exam: IExam;
  courses: ICourseAssignment[];
  onClose: () => void;
  onSuccess: (updatedExam: IExam) => void;
}

export interface IAddQuestionsModalProps {
  exam: IExam;
  onClose: () => void;
  onSuccess: () => void;
}

export interface IViewQuestionsModalProps {
  exam: IExam;
  onClose: () => void;
  onQuestionUpdated?: () => void;
  onAddQuestion: (exam: IExam) => void;
}

export interface IEditQuestionModalProps {
  question: IExamQuestion;
  examId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export interface IDeleteQuestionModalProps {
  question: IExamQuestion;
  onClose: () => void;
  onSuccess: () => void;
}
