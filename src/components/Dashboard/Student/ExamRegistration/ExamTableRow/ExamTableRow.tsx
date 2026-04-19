'use client';

import { ActionButton } from '../ActionButton/ActionButton';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { formatDate, formatFee } from '../utils/examHelpers';
import { IExamTableRowProps } from './interface';

export const ExamTableRow = ({
	exam,
	onRegister,
	onPay,
	onPayLoading,
	onRegisterLoading,
}: IExamTableRowProps) => {
	return (
		<tr className="group transition-colors hover:bg-blue-50/50">
			<td className="px-6 py-5 text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
				{exam.title}
			</td>
			<td className="px-6 py-5 text-sm text-gray-600 font-medium">
				{exam.courseCode}
			</td>
			<td className="px-6 py-5 text-sm text-gray-600 font-medium">
				{formatDate(exam.date)}
			</td>
			<td className="px-6 py-5 text-sm text-gray-600 font-medium">
				{formatDate(exam.registrationDeadline)}
			</td>
			<td className="px-6 py-5 text-sm font-semibold text-gray-800">
				{formatFee(Number(exam.fee))}
			</td>
			<td className="px-6 py-5">
				<StatusBadge exam={exam} />
			</td>
			<td className="px-6 py-5 text-center">
				<ActionButton
					exam={exam}
					onRegister={onRegister}
					onRegisterLoading={onRegisterLoading}
					onPay={onPay}
					onPayLoading={onPayLoading}
				/>
			</td>
		</tr>
	);
};
