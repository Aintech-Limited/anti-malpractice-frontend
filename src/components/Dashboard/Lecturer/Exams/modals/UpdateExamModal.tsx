'use client';

import { FormEvent, useState } from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { IUpdateExamModalProps } from './interface';
import { EXAM_STATUS, EXAM_TYPES } from '../utils/examConstants';

export const UpdateExamModal = ({
	exam,
	courses,
	onClose,
	onSuccess,
}: IUpdateExamModalProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [formData, setFormData] = useState({
		courseId: exam.courseId,
		title: exam.title,
		year: exam.year,
		startTime: exam.startTime.slice(0, 16),
		endTime: exam.endTime.slice(0, 16),
		type_: exam.type_,
		status: exam.status,
		mcqMarks: exam.mcqMarks,
		shortMarks: exam.shortMarks,
		published: exam.published,
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/v1/exams/${exam.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (data.success) {
				onSuccess({ ...exam, ...formData });
			} else {
				setError(data.message || 'Failed to update exam');
			}
		} catch (err) {
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const calculateTotalMarks = () => {
		return formData.mcqMarks + formData.shortMarks;
	};

	return (
		<div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4">
			<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-100 rounded-full">
							<BookOpen className="w-6 h-6 text-indigo-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800">Update Exam</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
							<AlertCircle className="w-5 h-5" />
							<span className="text-sm">{error}</span>
						</div>
					)}

					{/* Course Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Course *
						</label>
						<select
							value={formData.courseId}
							onChange={(e) =>
								setFormData({ ...formData, courseId: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							required
						>
							<option value="">Select a course</option>
							{courses.map((course) => (
								<option key={course.id} value={course.id}>
									{course.courseCode} - {course.title}
								</option>
							))}
						</select>
					</div>

					{/* Exam Title */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Exam Title *
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Year */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Academic Year
							</label>
							<input
								type="text"
								value={formData.year}
								onChange={(e) =>
									setFormData({ ...formData, year: e.target.value })
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
								required
							/>
						</div>

						{/* Exam Type */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Exam Type
							</label>
							<select
								value={formData.type_}
								onChange={(e) =>
									setFormData({
										...formData,
										type_: e.target.value as 'ONLINE' | 'PHYSICAL',
									})
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							>
								{Object.entries(EXAM_TYPES).map(([key, { label }]) => (
									<option key={key} value={key}>
										{label}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Start Time */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Start Time *
							</label>
							<input
								type="datetime-local"
								value={formData.startTime}
								onChange={(e) =>
									setFormData({ ...formData, startTime: e.target.value })
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
								required
							/>
						</div>

						{/* End Time */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								End Time *
							</label>
							<input
								type="datetime-local"
								value={formData.endTime}
								onChange={(e) =>
									setFormData({ ...formData, endTime: e.target.value })
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
								required
							/>
						</div>
					</div>

					{/* Exam Status */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Exam Status
						</label>
						<select
							value={formData.status}
							onChange={(e) =>
								setFormData({ ...formData, status: e.target.value as any })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
						>
							{Object.entries(EXAM_STATUS).map(([key, { label }]) => (
								<option key={key} value={key}>
									{label}
								</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* MCQ Marks */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								MCQ Marks
							</label>
							<input
								type="number"
								min="0"
								value={formData.mcqMarks}
								onChange={(e) =>
									setFormData({
										...formData,
										mcqMarks: parseInt(e.target.value) || 0,
									})
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						{/* Short Answer Marks */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Short Answer Marks
							</label>
							<input
								type="number"
								min="0"
								value={formData.shortMarks}
								onChange={(e) =>
									setFormData({
										...formData,
										shortMarks: parseInt(e.target.value) || 0,
									})
								}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							/>
						</div>
					</div>

					{/* Total Marks Display */}
					<div className="bg-gray-50 rounded-lg p-3">
						<div className="flex justify-between items-center">
							<span className="text-sm font-medium text-gray-700">
								Total Marks:
							</span>
							<span className="text-lg font-bold text-indigo-600">
								{calculateTotalMarks()}
							</span>
						</div>
					</div>

					{/* Published Status */}
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="published"
							checked={formData.published}
							onChange={(e) =>
								setFormData({ ...formData, published: e.target.checked })
							}
							className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
						/>
						<label
							htmlFor="published"
							className="text-sm font-medium text-gray-700"
						>
							Published (visible to students)
						</label>
					</div>

					<div className="border-t border-gray-200 pt-6 flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : (
								'Update Exam'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
