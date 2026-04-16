'use client';

import Image from 'next/image';
import { Users, BookOpen } from 'lucide-react';
import {
	formatStudentCount,
	getRandomPlaceholderStats,
} from '../utils/departmentHelpers';
import { IDepartmentListItemProps } from './interface';

export const DepartmentListItem = ({
	department,
	onViewDetails,
}: IDepartmentListItemProps) => {
	const placeholderStats = getRandomPlaceholderStats();

	return (
		<div
			className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer group"
			onClick={() => onViewDetails(department)}
		>
			<div className="flex flex-col sm:flex-row gap-6">
				<div className="shrink-0 w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden">
					<Image
						src={
							department.imageURL ||
							'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3'
						}
						alt={department.name}
						width={200}
						height={150}
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					/>
				</div>
				<div className="flex-1">
					<h3 className="text-xl font-semibold text-gray-800 mb-2">
						{department.name}
					</h3>
					<p className="text-gray-600 text-sm line-clamp-2 mb-3">
						{department.description}
					</p>
					<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
						<span className="flex items-center gap-1">
							<Users className="w-4 h-4" />
							{formatStudentCount(placeholderStats.students || 200)} Students
						</span>
						<span className="flex items-center gap-1">
							<BookOpen className="w-4 h-4" />
							{placeholderStats.courses || 30} Courses
						</span>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onViewDetails(department);
							}}
							className="text-indigo-600 hover:text-indigo-700 font-medium"
						>
							Learn More →
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
