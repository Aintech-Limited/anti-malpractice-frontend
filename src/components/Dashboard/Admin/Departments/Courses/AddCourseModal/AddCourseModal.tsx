'use client';

import { useState } from 'react';
import { X, BookOpen, Plus, Trash2 } from 'lucide-react';
import { IAddCourseModalProps } from './interface';
import { statusOptions } from '../constants/constat';
import { CourseStatusEnum, TCourseStatusEnum } from '@/src/lib/enums';

export default function AddCourseModal({
	isOpen,
	onClose,
	onConfirm,
	departmentId,
}: IAddCourseModalProps) {
	const [formData, setFormData] = useState({
		title: '',
		courseCode: '',
		description: '',
		creditHours: 3,
		semester: 1,
		level: 100,
		status: CourseStatusEnum.ACTIVE as TCourseStatusEnum,
		prerequisites: [] as string[],
		departmentId,
		isArchived: false,
	});
	const [newPrerequisite, setNewPrerequisite] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen) return null;

	const handleAddPrerequisite = () => {
		if (newPrerequisite && !formData.prerequisites.includes(newPrerequisite)) {
			setFormData({
				...formData,
				prerequisites: [...formData.prerequisites, newPrerequisite],
			});
			setNewPrerequisite('');
		}
	};

	const handleRemovePrerequisite = (prereq: string) => {
		setFormData({
			...formData,
			prerequisites: formData.prerequisites.filter((p) => p !== prereq),
		});
	};

	const handleSubmit = async () => {
		if (!formData.title || !formData.courseCode) {
			alert('Please fill in all required fields');
			return;
		}

		setIsLoading(true);
		await onConfirm({
			...formData,
			departmentId,
		});
		setIsLoading(false);
		onClose();
		setFormData({
			title: '',
			courseCode: '',
			description: '',
			creditHours: 3,
			semester: 1,
			level: 100,
			status: 'ACTIVE',
			prerequisites: [],
			departmentId,
			isArchived: false,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

			<div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<BookOpen className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-xl font-bold text-white">Add New Course</h2>
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
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Course Title *
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="e.g., Introduction to Programming"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Course Code *
							</label>
							<input
								type="text"
								value={formData.courseCode}
								onChange={(e) =>
									setFormData({ ...formData, courseCode: e.target.value })
								}
								placeholder="e.g., CSC 101"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Credit Hours
							</label>
							<input
								type="number"
								value={formData.creditHours}
								onChange={(e) =>
									setFormData({
										...formData,
										creditHours: parseInt(e.target.value),
									})
								}
								min={1}
								max={6}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Semester
							</label>
							<input
								type="number"
								value={formData.semester}
								onChange={(e) =>
									setFormData({
										...formData,
										semester: parseInt(e.target.value),
									})
								}
								min={1}
								max={2}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Level
							</label>
							<input
								type="number"
								value={formData.level}
								onChange={(e) =>
									setFormData({ ...formData, level: parseInt(e.target.value) })
								}
								step={100}
								min={100}
								max={500}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Status
							</label>
							<select
								value={formData.status}
								onChange={(e) =>
									setFormData({ ...formData, status: e.target.value as any })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{statusOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Archive?
							</label>
							<select
								value={formData.isArchived ? 'YES' : 'NO'}
								onChange={(e) =>
									setFormData({
										...formData,
										isArchived: e.target.value === 'YES' ? true : false,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value={'YES'}>YES</option>
								<option value={'NO'}>NO</option>
							</select>
						</div>

						<div className="col-span-2">
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={3}
								placeholder="Course description..."
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
							/>
						</div>

						<div className="col-span-2">
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Prerequisites
							</label>
							<div className="flex gap-2 mb-2">
								<input
									type="text"
									value={newPrerequisite}
									onChange={(e) => setNewPrerequisite(e.target.value)}
									placeholder="e.g., CSC 101"
									className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									onKeyPress={(e) =>
										e.key === 'Enter' && handleAddPrerequisite()
									}
								/>
								<button
									onClick={handleAddPrerequisite}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
								>
									<Plus size={18} />
								</button>
							</div>
							<div className="flex flex-wrap gap-2">
								{formData.prerequisites.map((prereq) => (
									<span
										key={prereq}
										className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-1"
									>
										{prereq}
										<button
											onClick={() => handleRemovePrerequisite(prereq)}
											className="hover:text-red-600"
										>
											<Trash2 size={14} />
										</button>
									</span>
								))}
							</div>
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
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
					>
						{isLoading ? 'Creating...' : 'Create Course'}
					</button>
				</div>
			</div>
		</div>
	);
}
