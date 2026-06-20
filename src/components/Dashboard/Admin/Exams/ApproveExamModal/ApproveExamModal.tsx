'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { IAdminApproveExamModalProps } from './interface';

export default function AdminApproveExamModal({
	isOpen,
	onClose,
	onConfirm,
	exam,
}: IAdminApproveExamModalProps) {
	const [notes, setNotes] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen || !exam) return null;

	const handleConfirm = async () => {
		setIsLoading(true);
		await onConfirm(exam.id, notes || undefined);
		setIsLoading(false);
		onClose();
		setNotes('');
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

			<div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<CheckCircle className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-xl font-bold text-white">Approve Exam</h2>
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
					<p className="text-gray-700 mb-2">
						Are you sure you want to approve <strong>{exam.title}</strong>?
					</p>
					<p className="text-sm text-gray-500 mb-4">
						Course: {exam.course.courseCode} - {exam.course.title}
					</p>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Approval Notes (Optional)
						</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							rows={3}
							placeholder="Add any notes or comments about this approval..."
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
						/>
					</div>

					<div className="bg-green-50 rounded-lg p-3 border border-green-200 mt-4">
						<p className="text-sm text-green-800">
							✅ Upon approval, the exam will be scheduled and students can
							register.
						</p>
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
						className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<CheckCircle size={18} />
						{isLoading ? 'Approving...' : 'Approve Exam'}
					</button>
				</div>
			</div>
		</div>
	);
}
