import { IAdminExam, IAdminExamFullDetails } from "../interface";

export interface IAdminExamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: IAdminExam | null;
  onFetchDetails: (examId: string) => Promise<{
    data?: IAdminExamFullDetails;
    message: string;
    success: boolean;
  }>;
}
