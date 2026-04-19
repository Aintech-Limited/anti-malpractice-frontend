import { EmptyState } from '@/src/components/common/EmptyState/EmptyState';
import { ExamCard } from '../ExamCard/ExamCard';
import { IExamsListProps } from './interface';

export const ExamsList = ({ exams, onContinuePayment }: IExamsListProps) => {
	if (!exams || exams.length === 0) {
		return (
			<EmptyState
				title="No exam registrations found"
				description="You haven't registered for any exams yet. Browse available exams to get started."
				icon="clipboard"
			/>
		);
	}

	return (
		<div className="space-y-4">
			{exams?.map((exam) => (
				<ExamCard
					key={exam.id}
					exam={exam}
					onContinuePayment={onContinuePayment}
				/>
			))}
		</div>
	);
};
