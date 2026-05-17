'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { IAssignLecturerModalProps } from './interface';
import { ILecturer } from '../interface';
import { roleOptions, statusOptions } from '../constants/constat';
import {
	AssignedLecturerStatusEnum,
	LecturerROleEnum,
	TAssignedLecturerStatusEnumValue,
	TLecturerROleEnumValue,
} from '@/src/lib/enums';

export default function AssignLecturerModal({
	isOpen,
	onClose,
	onConfirm,
	courseId,
	departmentId,
	existingMainLecturer,
}: IAssignLecturerModalProps) {
	const [lecturers, setLecturers] = useState<ILecturer[]>([]);
	const [formData, setFormData] = useState({
		lecturerId: '',
		role: LecturerROleEnum.ASSISTING_LECTURER as TLecturerROleEnumValue,
		status:
			AssignedLecturerStatusEnum.PENDING as TAssignedLecturerStatusEnumValue,
		startDate: new Date().toISOString().split('T')[0],
		endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split('T')[0],
		notes: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [loadingLecturers, setLoadingLecturers] = useState(false);

	useEffect(() => {
		if (isOpen && departmentId) {
			fetchLecturers();
		}
	}, [isOpen, departmentId]);

	const fetchLecturers = async () => {
		setLoadingLecturers(true);
		try {
			const response = await fetch(
				`/api/v1/admin/departments/${departmentId}/lecturers`,
			);
			const data = await response.json();
			if (data.success) {
				setLecturers(data.data);
			}
		} catch (error) {
			console.error('Error fetching lecturers:', error);
		} finally {
			setLoadingLecturers(false);
		}
	};

	if (!isOpen) return null;

	const selectedRole = roleOptions.find((r) => r.value === formData.role);
	const isMainLecturer = formData.role === 'MAIN_LECTURER';

	const handleSubmit = async () => {
		if (!formData.lecturerId) {
			alert('Please select a lecturer');
			return;
		}

		if (isMainLecturer && existingMainLecturer) {
			alert(
				'This course already has a Main Lecturer. Please unassign the current Main Lecturer first.',
			);
			return;
		}

		setIsLoading(true);
		await onConfirm({
			courseId,
			...formData,
		});
		setIsLoading(false);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

			<div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="bg-linear-to-r from-purple-600 to-purple-700 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-white/20 rounded-full">
								<UserPlus className="h-6 w-6 text-white" />
							</div>
							<h2 className="text-xl font-bold text-white">Assign Lecturer</h2>
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
						{isMainLecturer && existingMainLecturer && (
							<div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
								<div className="flex items-center gap-2 text-amber-800">
									<AlertCircle size={16} />
									<span className="text-sm">
										Only one Main Lecturer can be assigned at a time
									</span>
								</div>
							</div>
						)}

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Select Lecturer *
							</label>
							<select
								value={formData.lecturerId}
								onChange={(e) =>
									setFormData({ ...formData, lecturerId: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
								disabled={loadingLecturers}
							>
								<option value="">Choose a lecturer...</option>
								{lecturers.map((lecturer) => (
									<option key={lecturer.id} value={lecturer.id}>
										{lecturer.name} - {lecturer.email}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Role *
							</label>
							<select
								value={formData.role}
								onChange={(e) =>
									setFormData({ ...formData, role: e.target.value as any })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								{roleOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label} - {option.description}
									</option>
								))}
							</select>
							{selectedRole && (
								<p className="text-xs text-gray-500 mt-1">
									{selectedRole.description}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Status *
							</label>
							<select
								value={formData.status}
								onChange={(e) =>
									setFormData({ ...formData, status: e.target.value as any })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								{statusOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Start Date *
								</label>
								<input
									type="date"
									value={formData.startDate}
									onChange={(e) =>
										setFormData({ ...formData, startDate: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									End Date *
								</label>
								<input
									type="date"
									value={formData.endDate}
									onChange={(e) =>
										setFormData({ ...formData, endDate: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Notes (Optional)
							</label>
							<textarea
								value={formData.notes}
								onChange={(e) =>
									setFormData({ ...formData, notes: e.target.value })
								}
								rows={3}
								placeholder="Additional notes about this assignment..."
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
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
						disabled={isLoading || (isMainLecturer && existingMainLecturer)}
						className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
					>
						<UserPlus size={18} />
						{isLoading ? 'Assigning...' : 'Assign Lecturer'}
					</button>
				</div>
			</div>
		</div>
	);
}
