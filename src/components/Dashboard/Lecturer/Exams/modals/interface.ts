import { ICourseAssignment, IExam } from '../interface';

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
}
