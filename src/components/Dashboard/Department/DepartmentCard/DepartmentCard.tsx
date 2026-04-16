'use client';

import Image from 'next/image';
import { Users, ZoomIn } from 'lucide-react';
import {
	formatStudentCount,
	getRandomPlaceholderStats,
} from '../utils/departmentHelpers';
import { IDepartmentCardProps } from './interface';

export const DepartmentCard = ({
	department,
	onViewDetails,
}: IDepartmentCardProps) => {
	const placeholderStats = getRandomPlaceholderStats();

	return (
		<div
			className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
			onClick={() => onViewDetails(department)}
		>
			<div className="relative h-48 overflow-hidden">
				<Image
					src={
						department.imageURL ||
						'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3'
					}
					alt={department.name}
					width={400}
					height={300}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
				<div className="absolute bottom-4 left-4 right-4">
					<h3 className="text-xl font-bold text-white mb-1">
						{department.name}
					</h3>
				</div>
			</div>
			<div className="p-6">
				<p className="text-gray-600 text-sm line-clamp-3 mb-4">
					{department.description}
				</p>
				<div className="flex items-center justify-between text-sm text-gray-500">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onViewDetails(department);
						}}
						className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
					>
						<ZoomIn className="w-4 h-4" />
						View Details
					</button>
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4" />
						<span>
							{formatStudentCount(placeholderStats.students || 200)} Students
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
