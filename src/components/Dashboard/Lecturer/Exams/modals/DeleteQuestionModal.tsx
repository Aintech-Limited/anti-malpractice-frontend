'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { IDeleteQuestionModalProps } from './interface';

export const DeleteQuestionModal = ({
	question,
	onClose,
	onSuccess,
}: IDeleteQuestionModalProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleDelete = async () => {
		setLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/v1/exams/questions/${question.id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.json();

			if (data.success) {
				onSuccess();
			} else {
				setError(data.message || 'Failed to delete question');
			}
		} catch (err) {
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4">
			<div className="bg-white rounded-2xl max-w-md w-full">
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-red-100 rounded-full">
							<AlertTriangle className="w-6 h-6 text-red-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800">
							Delete Question
						</h2>
					</div>
				</div>

				<div className="p-6 space-y-4">
					<p className="text-gray-700">
						Are you sure you want to delete this question?
					</p>

					<div className="bg-gray-50 rounded-lg p-4">
						<p className="text-sm text-gray-600 font-medium">Question:</p>
						<p className="text-gray-800 mt-1">{question.questionText}</p>
						<div className="flex gap-4 mt-2 text-sm text-gray-500">
							<span>Type: {question.type}</span>
							<span>Marks: {question.marks}</span>
						</div>
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
							{error}
						</div>
					)}

					<p className="text-sm text-gray-500">
						This action cannot be undone. All student answers for this question
						will also be deleted.
					</p>
				</div>

				<div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleDelete}
						disabled={loading}
						className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							'Delete Question'
						)}
					</button>
				</div>
			</div>
		</div>
	);
};
