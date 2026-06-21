'use client';

import { useState } from 'react';
import {
	X,
	Plus,
	Trash2,
	AlertCircle,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { IAddQuestionsModalProps } from './interface';
import {
	IMCQOptionInput,
	IShortOptionInput,
	IQuestionInput,
} from '../interface';
import { QUESTION_TYPES } from '../utils/examConstants';
import { toast } from 'react-toastify';

export const AddQuestionsModal = ({
	exam,
	onClose,
	onSuccess,
}: IAddQuestionsModalProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [questions, setQuestions] = useState<IQuestionInput[]>([
		{
			questionText: '',
			type: 'MCQ',
			marks: 0,
			mcqOptions: [
				{ optionText: '', isCorrect: false, displayOrder: 1 },
				{ optionText: '', isCorrect: false, displayOrder: 2 },
				{ optionText: '', isCorrect: false, displayOrder: 3 },
				{ optionText: '', isCorrect: false, displayOrder: 4 },
			],
			shortOptions: { maxLength: 500, keywords: [] },
		},
	]);
	const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
		new Set([0]),
	);

	const [keywordInputs, setKeywordInputs] = useState<Record<number, string>>(
		{},
	);

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				questionText: '',
				type: 'MCQ',
				marks: 0,
				mcqOptions: [
					{ optionText: '', isCorrect: false, displayOrder: 1 },
					{ optionText: '', isCorrect: false, displayOrder: 2 },
					{ optionText: '', isCorrect: false, displayOrder: 3 },
					{ optionText: '', isCorrect: false, displayOrder: 4 },
				],
				shortOptions: { maxLength: 500, keywords: [] },
			},
		]);
		setExpandedQuestions(new Set([questions.length]));
	};

	const removeQuestion = (index: number) => {
		setQuestions(questions.filter((_, i) => i !== index));
		// Clean up temporary keyword input state
		const newInputs = { ...keywordInputs };
		delete newInputs[index];
		setKeywordInputs(newInputs);
	};

	const updateQuestion = (
		index: number,
		field: keyof IQuestionInput,
		value: any,
	) => {
		const updated = [...questions];

		// Default structure normalization when toggling types
		if (field === 'type') {
			if (
				(value === 'SHORT' || value === 'ESSAY') &&
				!updated[index].shortOptions
			) {
				updated[index].shortOptions = {
					maxLength: value === 'SHORT' ? 255 : 500,
					keywords: [],
				};
			}
		}

		updated[index] = { ...updated[index], [field]: value };
		setQuestions(updated);
	};

	const updateOption = (
		qIndex: number,
		oIndex: number,
		field: keyof IMCQOptionInput,
		value: any,
	) => {
		const updated = [...questions];
		if (updated[qIndex].mcqOptions) {
			updated[qIndex].mcqOptions![oIndex] = {
				...updated[qIndex].mcqOptions![oIndex],
				[field]: value,
			};
			setQuestions(updated);
		}
	};

	const addOption = (qIndex: number) => {
		const updated = [...questions];
		if (updated[qIndex].mcqOptions) {
			const newOrder = updated[qIndex].mcqOptions!.length + 1;
			updated[qIndex].mcqOptions!.push({
				optionText: '',
				isCorrect: false,
				displayOrder: newOrder,
			});
			setQuestions(updated);
		}
	};

	const removeOption = (qIndex: number, oIndex: number) => {
		const updated = [...questions];
		if (updated[qIndex].mcqOptions && updated[qIndex].mcqOptions!.length > 2) {
			updated[qIndex].mcqOptions = updated[qIndex].mcqOptions!.filter(
				(_, i) => i !== oIndex,
			);
			// Reorder remaining mcqOptions
			updated[qIndex].mcqOptions = updated[qIndex].mcqOptions!.map(
				(opt, idx) => ({
					...opt,
					displayOrder: idx + 1,
				}),
			);
			setQuestions(updated);
		}
	};

	const updateShortOptionField = (
		qIndex: number,
		field: keyof IShortOptionInput,
		value: any,
	) => {
		const updated = [...questions];
		updated[qIndex] = {
			...updated[qIndex],
			shortOptions: {
				...(updated[qIndex].shortOptions || { maxLength: 255, keywords: [] }),
				[field]: value,
			},
		};
		setQuestions(updated);
	};

	const addKeywordTag = (qIndex: number, text: string) => {
		const cleanWord = text.trim();
		if (!cleanWord) return;

		const currentKeywords = questions[qIndex].shortOptions?.keywords || [];

		if (currentKeywords.includes(cleanWord)) {
			setError('Duplicate keywords are not allowed');
			return;
		}
		if (currentKeywords.length >= 10) {
			setError('Maximum of 10 grading keywords allowed');
			return;
		}

		setError('');
		const updatedKeywords = [...currentKeywords, cleanWord];
		updateShortOptionField(qIndex, 'keywords', updatedKeywords);
		setKeywordInputs((prev) => ({ ...prev, [qIndex]: '' }));
	};

	const removeKeywordTag = (qIndex: number, tagIndex: number) => {
		const currentKeywords = questions[qIndex].shortOptions?.keywords || [];
		const updatedKeywords = currentKeywords.filter((_, i) => i !== tagIndex);
		updateShortOptionField(qIndex, 'keywords', updatedKeywords);
	};

	const toggleExpand = (index: number) => {
		const newExpanded = new Set(expandedQuestions);
		if (newExpanded.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedQuestions(newExpanded);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// Validate questions
		for (let i = 0; i < questions.length; i++) {
			const q = questions[i];
			if (!q.questionText.trim()) {
				setError(`Question ${i + 1} has no text`);
				setLoading(false);
				return;
			}
			if (q.marks <= 0) {
				setError(`Question ${i + 1} has invalid marks`);
				setLoading(false);
				return;
			}
			if (q.type === 'MCQ' && q.mcqOptions) {
				const hasCorrect = q.mcqOptions.some((opt) => opt.isCorrect);
				if (!hasCorrect) {
					setError(`Question ${i + 1} has no correct answer selected`);
					setLoading(false);
					return;
				}
				const hasEmpty = q.mcqOptions.some((opt) => !opt.optionText.trim());
				if (hasEmpty) {
					setError(`Question ${i + 1} has empty options`);
					setLoading(false);
					return;
				}
			}

			// Short & Essay Options Validation Rule
			if ((q.type === 'SHORT' || q.type === 'ESSAY') && q.shortOptions) {
				const maxLen = q.shortOptions.maxLength ?? 0;
				if (maxLen < 10 || maxLen > 500) {
					setError(
						`Question ${i + 1} (${q.type}) must have character limits between 10 and 500.`,
					);
					setLoading(false);
					return;
				}
			}

			if (q.type === 'SHORT' || q.type === 'ESSAY') {
				if ((q?.shortOptions?.keywords?.length ?? 0) < 1) {
					setQuestions((prev) => [
						...prev,
						{
							...q,
							shortOptions: {
								maxLength: q.shortOptions?.maxLength ?? 500,
								keywords: undefined,
							},
						},
					]);
				}
			}
		}

		// Standard Clean Data Payload Mapping prior to API post
		const cleanPayload = questions.map((q) => {
			if (q.type === 'MCQ') {
				return {
					questionText: q.questionText,
					type: q.type,
					marks: q.marks,
					mcqOptions: q.mcqOptions,
				};
			} else {
				return {
					questionText: q.questionText,
					type: q.type,
					marks: q.marks,
					shortOptions: q.shortOptions
						? {
								...q.shortOptions,
								keywords: q.shortOptions?.keywords?.length
									? q.shortOptions.keywords
									: undefined,
							}
						: undefined,
				};
			}
		});

		// console.log('cleanPayload: ', cleanPayload);

		try {
			const response = await fetch('/api/v1/exams/questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					examId: exam.id,
					questions: cleanPayload,
				}),
			});

			const data = await response.json();

			if (data.success) {
				toast.success(data.message || 'Question(s) added successfully');
			} else {
				setError(data.message || 'Failed to add questions');
			}
		} catch (err) {
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

	return (
		<div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4">
			<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-gray-800">Add Questions</h2>
						<p className="text-sm text-gray-500 mt-1">
							{exam.title} - Total Marks: {totalMarks}
						</p>
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

					{/* Questions List */}
					<div className="space-y-4">
						{questions.map((question, qIndex) => (
							<div
								key={qIndex}
								className="border border-gray-200 rounded-lg overflow-hidden"
							>
								{/* Question Header */}
								<div className="bg-gray-50 p-4 flex justify-between items-center">
									<div className="flex items-center gap-3">
										<button
											type="button"
											onClick={() => toggleExpand(qIndex)}
											className="text-gray-500 hover:text-gray-700"
										>
											{expandedQuestions.has(qIndex) ? (
												<ChevronUp className="w-5 h-5" />
											) : (
												<ChevronDown className="w-5 h-5" />
											)}
										</button>
										<span className="font-medium text-gray-700">
											Question {qIndex + 1}
										</span>
										{question.questionText && (
											<span className="text-sm text-gray-500 truncate max-w-md">
												{question.questionText.substring(0, 50)}...
											</span>
										)}
									</div>
									<button
										type="button"
										onClick={() => removeQuestion(qIndex)}
										className="p-1 text-red-500 hover:bg-red-50 rounded"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>

								{/* Question Content */}
								{expandedQuestions.has(qIndex) && (
									<div className="p-4 space-y-4">
										{/* Question Text */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Question Text *
											</label>
											<textarea
												value={question.questionText}
												onChange={(e) =>
													updateQuestion(qIndex, 'questionText', e.target.value)
												}
												rows={3}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
												placeholder="Enter your question here..."
												required
											/>
										</div>

										<div className="grid grid-cols-2 gap-4">
											{/* Question Type */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Question Type
												</label>
												<select
													value={question.type}
													onChange={(e) =>
														updateQuestion(qIndex, 'type', e.target.value)
													}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
												>
													{QUESTION_TYPES.filter(
														(type) => type.value !== 'ESSAY',
													).map((type) => (
														<option key={type.value} value={type.value}>
															{type.label}
														</option>
													))}
												</select>
											</div>

											{/* Marks */}
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Marks *
												</label>
												<input
													type="number"
													min="1"
													value={question.marks}
													onChange={(e) =>
														updateQuestion(
															qIndex,
															'marks',
															parseInt(e.target.value) || 0,
														)
													}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
													required
												/>
											</div>
										</div>

										{/* SHORT and ESSAY Question Types */}
										{(question.type === 'SHORT' ||
											question.type === 'ESSAY') && (
											<div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-4">
												<h4 className="text-sm font-semibold text-gray-800">
													{question.type === 'SHORT' ? 'Short Answer' : 'Essay'}{' '}
													Layout Parameters
												</h4>

												<div>
													<label className="block text-xs font-medium text-gray-600 mb-1">
														Maximum Input Character Constraints (10 - 500)
													</label>
													<input
														type="number"
														min="10"
														max="500"
														value={question.shortOptions?.maxLength ?? 255}
														onChange={(e) =>
															updateShortOptionField(
																qIndex,
																'maxLength',
																parseInt(e.target.value) || 0,
															)
														}
														className="w-full max-w-xs px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
														required
													/>
												</div>

												<div>
													<label className="block text-xs font-medium text-gray-600 mb-1">
														Target Criteria Keywords (Optional, max 10)
													</label>
													<p className="text-[11px] text-gray-400 mb-2">
														Type keyword string then split cleanly by hitting
														Enter or Comma keys
													</p>
													<input
														type="text"
														value={keywordInputs[qIndex] || ''}
														onChange={(e) =>
															setKeywordInputs((prev) => ({
																...prev,
																[qIndex]: e.target.value,
															}))
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter' || e.key === ',') {
																e.preventDefault();
																addKeywordTag(
																	qIndex,
																	keywordInputs[qIndex] || '',
																);
															}
														}}
														placeholder={
															(question.shortOptions?.keywords?.length ?? 0) >=
															10
																? 'Limit reached'
																: 'Add keyword...'
														}
														disabled={
															(question.shortOptions?.keywords?.length ?? 0) >=
															10
														}
														className="w-full max-w-sm px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
													/>

													<div className="flex flex-wrap gap-1.5 mt-2.5">
														{question.shortOptions?.keywords?.map(
															(tag, tagIdx) => (
																<span
																	key={tagIdx}
																	className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md border border-indigo-100 font-medium"
																>
																	{tag}
																	<button
																		type="button"
																		onClick={() =>
																			removeKeywordTag(qIndex, tagIdx)
																		}
																		className="hover:bg-indigo-200 text-indigo-500 hover:text-indigo-800 rounded p-0.5 transition-colors"
																	>
																		<X className="w-3 h-3" />
																	</button>
																</span>
															),
														)}
													</div>
												</div>
											</div>
										)}

										{/* Options for MCQ */}
										{question.type === 'MCQ' && question.mcqOptions && (
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Options *
												</label>
												<div className="space-y-2">
													{question.mcqOptions.map((option, oIndex) => (
														<div
															key={oIndex}
															className="flex items-center gap-2"
														>
															<input
																type="radio"
																name={`correct-${qIndex}`}
																checked={option.isCorrect}
																onChange={() => {
																	const updated = [...questions];
																	updated[qIndex].mcqOptions = updated[
																		qIndex
																	].mcqOptions!.map((opt, idx) => ({
																		...opt,
																		isCorrect: idx === oIndex,
																	}));
																	setQuestions(updated);
																}}
																className="w-4 h-4 text-green-600"
															/>
															<input
																type="text"
																value={option.optionText}
																onChange={(e) =>
																	updateOption(
																		qIndex,
																		oIndex,
																		'optionText',
																		e.target.value,
																	)
																}
																placeholder={`Option ${oIndex + 1}`}
																className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
															/>
															{question.mcqOptions!.length > 2 && (
																<button
																	type="button"
																	onClick={() => removeOption(qIndex, oIndex)}
																	className="p-1 text-red-500 hover:bg-red-50 rounded"
																>
																	<Trash2 className="w-4 h-4" />
																</button>
															)}
														</div>
													))}
												</div>
												<button
													type="button"
													onClick={() => addOption(qIndex)}
													className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
												>
													<Plus className="w-4 h-4" />
													Add Option
												</button>
												<p className="text-xs text-gray-500 mt-1">
													Select the radio button next to the correct answer
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>

					{/* Add Question Button */}
					<button
						type="button"
						onClick={addQuestion}
						className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
					>
						<Plus className="w-5 h-5" />
						Add Another Question
					</button>

					{/* Total Marks Summary */}
					<div className="bg-indigo-50 rounded-lg p-4">
						<div className="flex justify-between items-center">
							<span className="font-medium text-gray-700">
								Total Questions: {questions.length}
							</span>
							<span className="font-bold text-indigo-600">
								Total Marks: {totalMarks}
							</span>
						</div>
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
							disabled={loading || questions.length === 0}
							className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : (
								'Save Questions'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
