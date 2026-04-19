'use client';

import { ExamTableRow } from '../ExamTableRow/ExamTableRow';
import { IExamsTableProps } from './interface';

export const ExamsTable = ({
	exams,
	onRegister,
	onPay,
	onPayLoading,
	onRegisterLoading,
}: IExamsTableProps) => {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="text-sm font-bold text-gray-900 border-b border-gray-100">
						<th className="px-6 py-5">Exam Title</th>
						<th className="px-6 py-5">Course Code</th>
						<th className="px-6 py-5">Date</th>
						<th className="px-6 py-5">Registration Deadline</th>
						<th className="px-6 py-5">Fee</th>
						<th className="px-6 py-5">Status</th>
						<th className="px-6 py-5 text-center">Action</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-50">
					{exams.map((exam) => (
						<ExamTableRow
							key={exam.id}
							exam={exam}
							onRegister={onRegister}
							onRegisterLoading={onRegisterLoading}
							onPay={onPay}
							onPayLoading={onPayLoading}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};
