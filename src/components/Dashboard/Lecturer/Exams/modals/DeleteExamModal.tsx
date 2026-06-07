'use client';

import { useState } from 'react';
import { X, AlertTriangle, Calendar } from 'lucide-react';
import { IDeleteExamModalProps } from './interface';
import { canDeleteExam, getDaysUntilStart } from '../utils/examHelpers';
import { formatDate } from '@/src/lib/helper';
import { toast } from 'react-toastify';

export const DeleteExamModal = ({
	exam,
	onClose,
	onSuccess,
}: IDeleteExamModalProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const canDelete = canDeleteExam(exam);
	const daysUntilStart = getDaysUntilStart(exam);

	const handleDelete = async () => {
		if (!canDelete) {
			setError('This exam cannot be deleted as it starts within 7 days.');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/v1/exams/${exam.id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await response.json();

			if (data.success) {
				onSuccess();
			} else {
				toast.error(data.message || 'Failed to delete exam');
				setError(data.message || 'Failed to delete exam');
			}
		} catch (err) {
			toast.error('An error occurred. Please try again.');
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4">
			<div className="bg-white rounded-2xl max-w-md w-full">
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-red-100 rounded-full">
							<AlertTriangle className="w-6 h-6 text-red-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800">Delete Exam</h2>
					</div>
				</div>

				<div className="p-6 space-y-4">
					<p className="text-gray-700">
						Are you sure you want to delete <strong>{exam.title}</strong>?
					</p>

					<div className="bg-gray-50 rounded-lg p-3 space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="w-4 h-4 text-gray-500" />
							<span className="text-gray-600">
								Start: {formatDate(exam.startTime)}
							</span>
						</div>
						{!canDelete && (
							<div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
								<AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
								<span>
									This exam starts in {daysUntilStart} days. Exams can only be
									deleted if they are more than 7 days away.
								</span>
							</div>
						)}
					</div>

					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
							{error}
						</div>
					)}

					<p className="text-sm text-gray-500">
						This action cannot be undone. All questions and student
						registrations will also be deleted.
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
						disabled={loading || !canDelete}
						className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							'Delete Exam'
						)}
					</button>
				</div>
			</div>
		</div>
	);
};
