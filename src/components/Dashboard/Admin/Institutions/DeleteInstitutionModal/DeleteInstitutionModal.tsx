'use client';

import { useState } from 'react';
import { IDeleteInstitutionModalProps } from './interface';

export default function DeleteInstitutionModal({
	isOpen,
	institutionId,
	institutionName,
	onClose,
	onSuccess,
}: IDeleteInstitutionModalProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const handleDelete = async () => {
		setError('');
		setLoading(true);
		try {
			const res = await fetch(`/api/v1/institutions/${institutionId}`, {
				method: 'DELETE',
			});

			if (res.ok) {
				setError('');
				onSuccess();
				return;
			}

			const error = await res.json();
			setError(error?.message ?? 'Delete request failed');
		} catch (err) {
			console.error('Delete request failed:', err);
			setError('Delete request failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6 text-center space-y-4 border border-rose-100">
				{error && (
					<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-red-100 text-red-500 p-6 text-center">
						{error}
					</div>
				)}
				<h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
				<p className="text-sm text-slate-600">
					Are you sure you want to delete{' '}
					<span className="font-semibold text-slate-900">
						{institutionName}
					</span>
					? This action cannot be undone.
				</p>

				<div className="flex justify-center gap-3 pt-2">
					<button
						onClick={onClose}
						className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-50 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handleDelete}
						disabled={loading}
						className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-md transition-colors"
					>
						{loading ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	);
}
