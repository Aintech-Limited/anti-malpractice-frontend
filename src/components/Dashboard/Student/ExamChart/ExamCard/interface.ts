export interface IExam {
	title: string;
	startsIn: string;
	details: { date: string; duration: string; time: string; mark: string };
	syllabus: string[];
}

export interface IExamCardProps {
	title: string;
	exams: IExam[];
	type: 'LIVE EXAM' | 'UPCOMING EXAM' | 'OFFLINE EXAM';
	badgeColor: string;
}
