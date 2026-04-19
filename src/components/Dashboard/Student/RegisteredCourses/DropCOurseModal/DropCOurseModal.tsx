'use client';

import { useState } from 'react';
import { IDropCOurseModalProps } from './interface';
import { toast } from 'react-toastify';

const DropCOurseModal = ({
	registeredCourseId,
	close,
	onSuccess,
}: IDropCOurseModalProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	const handleDropCOurse = async () => {
		setLoading(true);

		try {
			const response = await fetch('/api/v1/drop-course', {
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({ registeredCourseId }),
			});
			if (!response.ok) throw new Error('Failed');

			onSuccess();
		} catch (err) {
			console.error(err);
			toast.error('Failed to drop course');
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-100">
				<h3 className="text-lg font-semibold mb-2">Drop Course</h3>
				<p className="text-sm text-gray-600 mb-4">
					Are you sure you want to drop this course? This action cannot be
					undone.
				</p>

				<div className="flex justify-end gap-3">
					<button
						disabled={loading}
						onClick={close}
						className={`${loading && 'cursor-not-allowed'} px-4 py-2 border rounded-lg`}
					>
						Cancel
					</button>

					<button
						onClick={handleDropCOurse}
						disabled={loading}
						className={`${loading && 'cursor-not-allowed'} px-4 py-2 bg-red-600 text-white rounded-lg`}
					>
						{loading ? 'Dropping...' : 'Confirm'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DropCOurseModal;
