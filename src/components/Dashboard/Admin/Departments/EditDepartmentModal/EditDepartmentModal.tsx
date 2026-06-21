'use client';

import { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { EditDepartmentModalProps } from './interface';
import { IDepartment } from '../interface';

export default function EditDepartmentModal({
	isOpen,
	onClose,
	onConfirm,
	department,
}: EditDepartmentModalProps) {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		activeSemester: '',
		imageUrl: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!department) return;
		const handleData = () => {
			setFormData({
				name: department.name,
				description: department.description,
				activeSemester: String(department.activeSemester),
				imageUrl: department.imageUrl || '',
			});
		};
		handleData();
	}, [department]);

	if (!isOpen || !department) return null;

	const handleSubmit = async () => {
		setIsLoading(true);
		const updateData: Partial<IDepartment> = {};

		if (formData.name !== department.name) updateData.name = formData.name;
		if (formData.description !== department.description)
			updateData.description = formData.description;
		if (formData.activeSemester !== String(department.activeSemester))
			updateData.activeSemester = formData.activeSemester;
		if (formData.imageUrl !== (department.imageUrl || ''))
			updateData.imageUrl = formData.imageUrl;

		await onConfirm(department.id, updateData);
		setIsLoading(false);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

			<div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<Building2 className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-xl font-bold text-white">Edit Department</h2>
						</div>
						<button
							onClick={onClose}
							className="text-white/80 hover:text-white transition-colors"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
				</div>

				<div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Department Name
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Active Semester
							</label>
							<input
								type="text"
								value={formData.activeSemester}
								onChange={(e) =>
									setFormData({ ...formData, activeSemester: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Image URL
							</label>
							<input
								type="url"
								value={formData.imageUrl}
								onChange={(e) =>
									setFormData({ ...formData, imageUrl: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
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
						onClick={handleSubmit}
						disabled={isLoading}
						className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<Save size={18} />
						{isLoading ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>
		</div>
	);
}
