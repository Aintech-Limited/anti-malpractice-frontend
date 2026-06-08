'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import {
	IGetUngradedAnswersResponse,
	IGetUngradedQuestionResponse,
	IGradeExamsClientProps,
	IQuestionDetails,
	IUngradedAnswer,
	IUngradedQuestion,
} from './interface';
import GradingProgress from './GradingProgress/GradingProgress';
import QuestionsList from './QuestionsList/QuestionsList';
import BatchGradingView from './BatchGradingView/BatchGradingView';
import { ProtectedRouteEnum } from '@/src/lib/enums';

export default function GradeExamClient({
	examId,
	examTitle,
	initialQuestionsData,
}: IGradeExamsClientProps) {
	const router = useRouter();
	const [questions, setQuestions] = useState<IUngradedQuestion[]>(
		initialQuestionsData?.data?.ungradedQuestions || [],
	);

	const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
		null,
	);
	const [selectedQuestion, setSelectedQuestion] =
		useState<IQuestionDetails | null>(null);
	const [answers, setAnswers] = useState<IUngradedAnswer[]>([]);
	const [summary, setSummary] = useState({
		totalItems: 0,
		gradedSoFar: 0,
		remainingToGrade: 0,
	});
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Calculate overall progress
	const totalQuestions = questions?.length ?? 0;
	const gradedQuestions = (
		questions?.filter((q) => q.gradedCount === q.totalSubmissions) ?? []
	).length;
	const totalAnswers =
		questions?.reduce((sum, q) => sum + q.totalSubmissions, 0) ?? 0;
	const gradedAnswers =
		questions?.reduce((sum, q) => sum + q.gradedCount, 0) ?? 0;

	const fetchUngradedAnswers = async (questionId: string) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/v1/grade-exam/${examId}/ungraded-answers?questionId=${questionId}&limit=100&page=1`,
			);
			const result = (await response.json()) as IGetUngradedAnswersResponse;

			if (result.success) {
				setSelectedQuestion(result.data.question);
				setAnswers(result.data.answers);
				setSummary(result.data.summary);
			} else {
				setError(result.message || 'Failed to load answers');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load answers');
		} finally {
			setLoading(false);
		}
	};

	const handleSelectQuestion = async (questionId: string) => {
		setSelectedQuestionId(questionId);

		await fetchUngradedAnswers(questionId);
	};

	const refreshQuestions = async () => {
		try {
			const response = await fetch(
				`/api/v1/grade-exam/${examId}/ungraded-questions?limit=100`,
			);
			const result = (await response.json()) as IGetUngradedQuestionResponse;
			if (result.success) {
				setQuestions(result?.data?.ungradedQuestions ?? []);
			}
		} catch (err) {
			console.error('Failed to refresh questions:', err);
		}
	};

	const handleBackToQuestions = () => {
		setSelectedQuestionId(null);
		setSelectedQuestion(null);
		setAnswers([]);
		refreshQuestions();
	};

	const handleSubmitGrades = async (
		grades: Array<{ answerId: string; marksAwarded: number }>,
	) => {
		setSubmitting(true);
		setError(null);

		try {
			const response = await fetch('/api/v1/grade-exam ', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					examId,
					questionId: selectedQuestionId,
					grades,
				}),
			});

			const result = await response.json();

			if (result.success) {
				await refreshQuestions();
			} else {
				setError(result.message || 'Failed to submit grades');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to submit grades');
		} finally {
			setSubmitting(false);
		}
	};

	if (error) {
		return (
			<div className="max-w-6xl mx-auto p-6">
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
					<AlertCircle size={20} />
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<BookOpen className="h-6 w-6 text-indigo-600" />
					<h1 className="text-2xl font-bold text-gray-800">
						Grade Short Answer Questions
					</h1>
				</div>
				<h2 className="text-xl text-gray-600">{examTitle}</h2>
				<p className="text-gray-500 mt-1">
					Grade all answers for one question at a time
				</p>
			</div>

			{/* Progress Overview */}
			{!selectedQuestionId && (
				<GradingProgress
					totalQuestions={totalQuestions}
					gradedQuestions={gradedQuestions}
					totalAnswers={totalAnswers}
					gradedAnswers={gradedAnswers}
				/>
			)}

			{loading && (
				<div className="text-center py-12">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
					<p className="mt-2 text-gray-500">Loading answers...</p>
				</div>
			)}
			{/* (initialQuestionsData?.meta?.totalItems ?? 0) < 1 */}
			{!loading && !selectedQuestionId && (
				<div className="mt-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Questions to Grade
					</h3>
					{questions.length === 0 ? (
						<div className="text-center py-12 bg-white rounded-lg border border-gray-200">
							<CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
							<p className="text-gray-500">
								All questions have been fully graded!
							</p>
							<button
								onClick={() =>
									router.push(`${ProtectedRouteEnum.LECTURERS}/exams/${examId}`)
								}
								className="mt-4 text-indigo-600 hover:text-indigo-700"
							>
								Return to Exam Dashboard
							</button>
						</div>
					) : (
						<QuestionsList
							questions={questions}
							onSelectQuestion={handleSelectQuestion}
							selectedQuestionId={selectedQuestionId || undefined}
						/>
					)}
				</div>
			)}

			{!loading && selectedQuestionId && selectedQuestion && (
				<BatchGradingView
					question={selectedQuestion}
					answers={answers}
					summary={summary}
					onBack={handleBackToQuestions}
					onSubmit={handleSubmitGrades}
					isSubmitting={submitting}
				/>
			)}
		</div>
	);
}
