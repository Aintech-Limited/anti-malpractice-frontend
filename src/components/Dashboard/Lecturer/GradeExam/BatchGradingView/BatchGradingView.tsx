'use client';

import { useState } from 'react';
import { ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { IBatchGradingViewProps } from './interface';
import GradeInput from '../GradeInput/GradeInput';

export default function BatchGradingView({
	question,
	answers,
	summary,
	onBack,
	onSubmit,
	isSubmitting = false,
}: IBatchGradingViewProps) {
	const [grades, setGrades] = useState<Map<string, number>>(new Map());
	const [submitted, setSubmitted] = useState(false);

	const handleGradeChange = (answerId: string, marks: number) => {
		const newGrades = new Map(grades);
		newGrades.set(answerId, marks);
		setGrades(newGrades);
	};

	const getGradedCount = () => {
		return grades.size;
	};

	const getTotalMarksAwarded = () => {
		let total = 0;
		grades.forEach((marks) => {
			total += marks;
		});
		return total;
	};

	const handleSubmit = async () => {
		if (grades.size === 0) {
			alert('Please grade at least one answer before submitting');
			return;
		}

		const gradeItems = Array.from(grades.entries()).map(
			([answerId, marks]) => ({
				answerId,
				marksAwarded: marks,
			}),
		);

		await onSubmit(gradeItems);
		setSubmitted(true);
		setTimeout(() => {
			onBack();
		}, 2000);
	};

	const allGraded = grades.size === answers.length;

	if (submitted) {
		return (
			<div className="bg-white rounded-lg p-12 text-center">
				<CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
				<h3 className="text-xl font-semibold text-gray-900 mb-2">
					Grades Submitted Successfully!
				</h3>
				<p className="text-gray-600">
					{grades.size} answers have been graded. Returning to questions list...
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
				>
					<ArrowLeft size={20} />
					Back to Questions
				</button>
				<div className="text-sm text-gray-500">
					Grading: {getGradedCount()} / {answers.length} answers
				</div>
			</div>

			{/* Question Info */}
			<div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
				<h2 className="text-xl font-semibold text-gray-900 mb-2">
					{question.questionText}
				</h2>
				<div className="flex gap-4 text-sm">
					<span className="text-gray-600">Max Marks: {question.marks}</span>
					<span className="text-gray-600">Type: {question.type}</span>
				</div>
			</div>

			{/* Grading Summary */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-blue-50 rounded-lg p-3">
					<p className="text-sm text-blue-600">Total Submissions</p>
					<p className="text-2xl font-bold text-blue-900">
						{summary.totalItems}
					</p>
				</div>
				<div className="bg-yellow-50 rounded-lg p-3">
					<p className="text-sm text-yellow-600">Remaining to Grade</p>
					<p className="text-2xl font-bold text-yellow-900">
						{summary.remainingToGrade}
					</p>
				</div>
				<div className="bg-green-50 rounded-lg p-3">
					<p className="text-sm text-green-600">Graded in This Session</p>
					<p className="text-2xl font-bold text-green-900">
						{getGradedCount()}
					</p>
				</div>
			</div>

			{/* Answers List */}
			<div className="space-y-3 max-h-[60vh] overflow-y-auto p-2">
				{answers.map((answer) => (
					<GradeInput
						key={answer.id}
						answerId={answer.id}
						studentName={answer.studentName}
						answerText={answer.answerText}
						maxMarks={answer.maxMarks}
						initialMarks={grades.get(answer.id) || answer.currentMarksAwarded}
						onGradeChange={handleGradeChange}
					/>
				))}
			</div>

			{/* Submit Button */}
			<div className="flex justify-end pt-4 border-t">
				<button
					onClick={handleSubmit}
					disabled={grades.size === 0 || isSubmitting}
					className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Save size={18} />
					{isSubmitting ? 'Submitting...' : `Submit ${getGradedCount()} Grades`}
				</button>
			</div>

			{!allGraded && grades.size > 0 && (
				<p className="text-sm text-yellow-600 text-center">
					{answers.length - grades.size} answers still pending grading. You can
					submit now and grade the rest later.
				</p>
			)}
		</div>
	);
}
