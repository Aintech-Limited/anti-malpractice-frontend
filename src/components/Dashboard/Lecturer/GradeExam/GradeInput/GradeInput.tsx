'use client';

import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { IGradeInputProps } from './interfcace';

export default function GradeInput({
	answerId,
	studentName,
	answerText,
	maxMarks,
	initialMarks,
	onGradeChange,
}: IGradeInputProps) {
	const [marks, setMarks] = useState<string>(initialMarks?.toString() || '');
	const [error, setError] = useState<string | null>(null);

	const handleMarksChange = (value: string) => {
		setMarks(value);
		setError(null);

		const numValue = parseInt(value);
		if (value === '') {
			// Allow empty input
			return;
		}

		if (isNaN(numValue)) {
			setError('Please enter a valid number');
			return;
		}

		if (numValue < 0) {
			setError('Marks cannot be negative');
			return;
		}

		if (numValue > maxMarks) {
			setError(`Marks cannot exceed ${maxMarks}`);
			return;
		}

		onGradeChange(answerId, numValue);
	};

	const isValid =
		marks !== '' &&
		!error &&
		parseInt(marks) >= 0 &&
		parseInt(marks) <= maxMarks;

	return (
		<div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
			<div className="flex flex-col md:flex-row md:items-start gap-4">
				{/* Student Info */}
				<div className="md:w-1/4">
					<h4 className="font-semibold text-gray-900">{studentName}</h4>
					<p className="text-sm text-gray-500">Max marks: {maxMarks}</p>
				</div>

				{/* Answer */}
				<div className="flex-1">
					<p className="text-gray-700 whitespace-pre-wrap">
						{answerText || 'No answer provided'}
					</p>
					{!answerText && (
						<p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
							<AlertCircle size={14} />
							Student did not provide an answer
						</p>
					)}
				</div>

				{/* Grade Input */}
				<div className="md:w-32">
					<div className="flex items-center gap-2">
						<input
							type="number"
							value={marks}
							onChange={(e) => handleMarksChange(e.target.value)}
							placeholder="Marks"
							min={0}
							max={maxMarks}
							className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
								error ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{isValid && <Check size={18} className="text-green-600 shrink-0" />}
					</div>
					{error && <p className="text-xs text-red-600 mt-1">{error}</p>}
					<p className="text-xs text-gray-400 mt-1">/ {maxMarks}</p>
				</div>
			</div>
		</div>
	);
}
