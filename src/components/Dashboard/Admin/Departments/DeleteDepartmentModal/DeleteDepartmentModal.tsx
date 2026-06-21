'use client';

import { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { IDeleteDepartmentModalProps } from './interface';

export default function DeleteDepartmentModal({
	isOpen,
	onClose,
	onConfirm,
	department,
}: IDeleteDepartmentModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen || !department) return null;

	const handleConfirm = async () => {
		setIsLoading(true);
		await onConfirm(department.id);
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
							<h2 className="text-xl font-bold text-white">
								Delete Department
							</h2>
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
						Are you sure you want to delete <strong>{department.name}</strong>?
					</p>

					<div className="bg-red-50 rounded-lg p-4 border border-red-200">
						<p className="text-sm text-red-800 font-semibold mb-2">
							⚠️ Warning:
						</p>
						<p className="text-sm text-red-700">
							This department <strong>cannot be deleted</strong> if:
						</p>
						<ul className="text-xs text-red-600 mt-2 list-disc list-inside space-y-1">
							<li>Courses are already registered under this department</li>
							<li>Exams are registered under any course in this department</li>
							<li>Students are enrolled in courses of this department</li>
						</ul>
					</div>

					<div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
						<p className="text-sm text-amber-800">
							ℹ️ If there are existing associations, you&apos;ll need to remove
							them first or archive the department instead of deleting.
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
						className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<Trash2 size={18} />
						{isLoading ? 'Deleting...' : 'Delete Department'}
					</button>
				</div>
			</div>
		</div>
	);
}
