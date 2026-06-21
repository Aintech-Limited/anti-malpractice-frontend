'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Save, Plus, Trash2 } from 'lucide-react';
import { IEditCourseModalProps } from './interface';
import { statusOptions } from '../constants/constat';
import { TCourseStatusEnum } from '@/src/lib/enums';

export default function EditCourseModal({
	isOpen,
	onClose,
	onConfirm,
	course,
}: IEditCourseModalProps) {
	const [formData, setFormData] = useState({
		title: '',
		courseCode: '',
		description: '',
		creditHours: 3,
		semester: 1,
		level: 100,
		status: 'ACTIVE' as TCourseStatusEnum,
		prerequisites: [] as string[],
	});
	const [newPrerequisite, setNewPrerequisite] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!course) return;
		const setData = () => {
			setFormData({
				title: course.title,
				courseCode: course.courseCode,
				description: course.description || '',
				creditHours: course.creditHours,
				semester: course.semester,
				level: course.level,
				status: course.status,
				prerequisites: course.prerequisites || [],
			});
		};
		setData();
	}, [course]);

	if (!isOpen || !course) return null;

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
		const updateData: any = {};
		if (formData.title !== course.title) updateData.title = formData.title;
		if (formData.courseCode !== course.courseCode)
			updateData.courseCode = formData.courseCode;
		if (formData.description !== course.description)
			updateData.description = formData.description;
		if (formData.creditHours !== course.creditHours)
			updateData.creditHours = formData.creditHours;
		if (formData.semester !== course.semester)
			updateData.semester = formData.semester;
		if (formData.level !== course.level) updateData.level = formData.level;
		if (formData.status !== course.status) updateData.status = formData.status;
		if (
			JSON.stringify(formData.prerequisites) !==
			JSON.stringify(course.prerequisites)
		) {
			updateData.prerequisites = formData.prerequisites;
		}

		if (Object.keys(updateData).length === 0) {
			onClose();
			return;
		}

		setIsLoading(true);
		await onConfirm(course.id, updateData);
		setIsLoading(false);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

			<div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<BookOpen className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-xl font-bold text-white">Edit Course</h2>
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
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Course Code *
							</label>
							<input
								type="text"
								value={formData.courseCode}
								placeholder="MATH 202"
								onChange={(e) =>
									setFormData({ ...formData, courseCode: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							>
								{statusOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
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
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
									className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									onKeyPress={(e) =>
										e.key === 'Enter' && handleAddPrerequisite()
									}
								/>
								<button
									onClick={handleAddPrerequisite}
									className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
