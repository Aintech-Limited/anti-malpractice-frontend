'use client';

import { IGradingProgressProps } from './interface';

export default function GradingProgress({
	totalQuestions,
	gradedQuestions,
	totalAnswers,
	gradedAnswers,
}: IGradingProgressProps) {
	const questionsPercentage =
		totalQuestions > 0 ? (gradedQuestions / totalQuestions) * 100 : 0;
	const answersPercentage =
		totalAnswers > 0 ? (gradedAnswers / totalAnswers) * 100 : 0;

	return (
		<div className="bg-white rounded-lg p-4 border border-gray-200">
			<h3 className="font-semibold text-gray-900 mb-3">
				Overall Grading Progress
			</h3>

			<div className="space-y-4">
				<div>
					<div className="flex justify-between text-sm text-gray-600 mb-1">
						<span>Questions Progress</span>
						<span>
							{gradedQuestions} / {totalQuestions} completed
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-indigo-600 h-2 rounded-full transition-all"
							style={{ width: `${questionsPercentage}%` }}
						/>
					</div>
				</div>

				<div>
					<div className="flex justify-between text-sm text-gray-600 mb-1">
						<span>Answers Progress</span>
						<span>
							{gradedAnswers} / {totalAnswers} graded
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-green-600 h-2 rounded-full transition-all"
							style={{ width: `${answersPercentage}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
