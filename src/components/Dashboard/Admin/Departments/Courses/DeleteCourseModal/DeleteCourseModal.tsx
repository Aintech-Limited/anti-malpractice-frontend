'use client';

import { useState } from 'react';
import { X, AlertTriangle, Archive, Trash2 } from 'lucide-react';
import { IDeleteCourseModalProps } from './interface';

export default function DeleteCourseModal({
	isOpen,
	onClose,
	onConfirm,
	course,
}: IDeleteCourseModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [action, setAction] = useState<'delete' | 'archive'>('delete');

	if (!isOpen || !course) return null;

	const handleConfirm = async () => {
		setIsLoading(true);
		await onConfirm(course.id, action === 'archive');
		setIsLoading(false);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

			<div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<AlertTriangle className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-xl font-bold text-white">Delete Course</h2>
						</div>
						<button
							onClick={onClose}
							className="text-white/80 hover:text-white transition-colors"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
				</div>

				<div className="px-6 py-5">
					<p className="text-gray-700 mb-4">
						Are you sure you want to{' '}
						{action === 'delete' ? 'delete' : 'archive'}{' '}
						<strong>
							{course.title} ({course.courseCode})
						</strong>
						?
					</p>

					<div className="mb-4">
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Choose Action
						</label>
						<div className="space-y-2">
							<label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
								<input
									type="radio"
									value="delete"
									checked={action === 'delete'}
									onChange={() => setAction('delete')}
									className="w-4 h-4 text-red-600"
								/>
								<div className="flex-1">
									<div className="font-semibold text-gray-800">
										Delete Permanently
									</div>
									<div className="text-xs text-gray-500">
										Only available if no students or exams are registered
									</div>
								</div>
								<Trash2 size={18} className="text-red-500" />
							</label>

							<label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
								<input
									type="radio"
									value="archive"
									checked={action === 'archive'}
									onChange={() => setAction('archive')}
									className="w-4 h-4 text-amber-600"
								/>
								<div className="flex-1">
									<div className="font-semibold text-gray-800">
										Archive Course
									</div>
									<div className="text-xs text-gray-500">
										Prevent new registrations but keep existing data
									</div>
								</div>
								<Archive size={18} className="text-amber-500" />
							</label>
						</div>
					</div>

					<div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
						<p className="text-sm text-amber-800 font-semibold mb-2">
							⚠️ Warning:
						</p>
						<ul className="text-xs text-amber-700 list-disc list-inside space-y-1">
							<li>Deletion is only possible if no students are registered</li>
							<li>Deletion is only possible if no exams are registered</li>
							<li>Archiving will hide the course from active lists</li>
							<li>Archived courses can be restored later</li>
						</ul>
					</div>
				</div>

				<div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-xl transition"
					>
						Cancel
					</button>
					<button
						onClick={handleConfirm}
						disabled={isLoading}
						className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{action === 'delete' ? <Trash2 size={18} /> : <Archive size={18} />}
						{isLoading
							? 'Processing...'
							: action === 'delete'
								? 'Delete Course'
								: 'Archive Course'}
					</button>
				</div>
			</div>
		</div>
	);
}
