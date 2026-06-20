'use client';

import { useState } from 'react';
import { X, Edit, AlertTriangle } from 'lucide-react';
import { IAdminRequestChangesModalProps } from './interface';
import { toast } from 'react-toastify';

export default function AdminRequestChangesModal({
	isOpen,
	onClose,
	onConfirm,
	exam,
}: IAdminRequestChangesModalProps) {
	const [changes, setChanges] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen || !exam) return null;

	const handleConfirm = async () => {
		if (!changes.trim()) {
			toast.error('Please provide details about the changes requested');
			return;
		}

		setIsLoading(true);
		await onConfirm(exam.id, changes);
		setIsLoading(false);
		onClose();
		setChanges('');
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

			<div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="bg-linear-to-r from-yellow-600 to-yellow-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<Edit className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-xl font-bold text-white">Request Changes</h2>
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
						Request changes for <strong>{exam.title}</strong>
					</p>
					<p className="text-sm text-gray-500 mb-4">
						Course: {exam.course.courseCode} - {exam.course.title}
					</p>

					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Changes Required *
						</label>
						<textarea
							value={changes}
							onChange={(e) => setChanges(e.target.value)}
							rows={5}
							placeholder="Please describe the changes needed for this exam..."
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Be specific about what needs to be changed or corrected.
						</p>
					</div>

					<div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 mt-4">
						<div className="flex items-start gap-2">
							<AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
							<p className="text-sm text-yellow-800">
								The lecturer will be notified and will need to resubmit the exam
								after making the requested changes.
							</p>
						</div>
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
						disabled={isLoading || !changes.trim()}
						className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<Edit size={18} />
						{isLoading ? 'Submitting...' : 'Request Changes'}
					</button>
				</div>
			</div>
		</div>
	);
}
