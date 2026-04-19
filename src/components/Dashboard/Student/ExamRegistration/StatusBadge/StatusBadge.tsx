import { IExam } from '../interface';
import { getExamStatus } from '../utils/examHelpers';

export const StatusBadge = ({ exam }: { exam: IExam }) => {
	const status = getExamStatus(exam.status);

	return (
		<span
			className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
		>
			{status.label}
		</span>
	);
};
