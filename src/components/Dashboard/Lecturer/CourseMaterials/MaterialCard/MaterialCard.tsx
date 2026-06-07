'use client';

import {
	Eye,
	Edit,
	Trash2,
	Download,
	Star,
	FileText,
	Video,
	File,
	MoreVertical,
} from 'lucide-react';
import Image from 'next/image';
import {
	getFileTypeConfig,
	formatFileSize,
	formatPrice,
} from '../utils/materialHelpers';
import { IMaterialCardProps } from './interface';
import { useState } from 'react';
import { formatDate } from '@/src/lib/helper';

export const MaterialCard = ({
	material,
	onView,
	onEdit,
	onDelete,
}: IMaterialCardProps) => {
	const fileTypeConfig = getFileTypeConfig(material.fileType);
	const [showMenu, setShowMenu] = useState<boolean>(false);
	// console.log('material price: ', material.price);

	const getFileIcon = () => {
		switch (material.fileType) {
			case 'PDF':
				return <FileText className="w-5 h-5" />;
			case 'VIDEO':
				return <Video className="w-5 h-5" />;
			default:
				return <File className="w-5 h-5" />;
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
			<div className="flex flex-col md:flex-row">
				{/* Cover Image */}
				<div className="md:w-48 h-48 md:h-auto relative bg-gray-100">
					{material.MaterialCover ? (
						<Image
							src={material.MaterialCover}
							alt={material.title}
							fill
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							{getFileIcon()}
						</div>
					)}
					{/* File Type Badge */}
					<div
						className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-medium ${fileTypeConfig.color}`}
					>
						{fileTypeConfig.label}
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 p-5">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							{/* Title and Course */}
							<h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
								{material.title}
							</h3>
							{material.course && (
								<p className="text-sm text-gray-500 mb-2">
									{material.course.courseCode} - {material.course.title}
								</p>
							)}

							{/* Description */}
							<p className="text-sm text-gray-600 mb-3 line-clamp-2">
								{material?.description ?? ''}
							</p>

							{/* Stats Row */}
							<div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
								<span className="flex items-center gap-1">
									<Download className="w-4 h-4" />
									{material?.downloadCount?.toLocaleString() ?? 0} downloads
								</span>
								<span className="flex items-center gap-1">
									<Star className="w-4 h-4 text-yellow-400" />
									{material?.averageRating?.toFixed(1) ?? 0} (
									{material?.ratingCount ?? 0})
								</span>
								<span>
									{material.fileSize ? formatFileSize(material.fileSize) : ''}
								</span>
								<span>{formatDate(material.createdAt)}</span>
							</div>
						</div>

						{/* Price and Actions */}
						<div className="text-right">
							<div className="text-xl font-bold text-indigo-600 mb-2">
								{formatPrice(material.price, material.isFree)}
							</div>

							<div className="relative">
								<button
									onClick={() => setShowMenu(!showMenu)}
									className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
								>
									<MoreVertical className="w-5 h-5" />
								</button>
								{showMenu && (
									<div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10 animate-slideDown">
										<button
											onClick={() => {
												onView(material);
												setShowMenu(false);
											}}
											className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
										>
											<Eye className="w-4 h-4" />
											View Details
										</button>
										<button
											onClick={() => {
												onEdit(material);
												setShowMenu(false);
											}}
											className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
										>
											<Edit className="w-4 h-4" />
											Edit
										</button>
										<button
											onClick={() => {
												onDelete(material);
												setShowMenu(false);
											}}
											className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
										>
											<Trash2 className="w-4 h-4" />
											Delete
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
