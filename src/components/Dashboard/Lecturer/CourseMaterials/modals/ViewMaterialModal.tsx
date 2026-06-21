'use client';

import {
	X,
	Download,
	Eye,
	Star,
	FileText,
	Users,
	DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import { IViewMaterialModalProps } from './interface';
import { formatFileSize, formatPrice } from '../utils/materialHelpers';
import { formatDate } from '@/src/lib/helper';

export const ViewMaterialModal = ({
	material,
	onClose,
	onPreviewPDF,
}: IViewMaterialModalProps) => {
	const handlePreview = () => {
		// window.open(material.fileURL, '_blank');
		console.log('viewing PDF');
		onPreviewPDF(material.fileURL);
	};

	const handleDownload = () => {
		window.open(material.fileURL, '_blank');
	};

	return (
		<div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
			<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-100 rounded-full">
							<FileText className="w-6 h-6 text-indigo-600" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-800">
								{material.title}
							</h2>
							<p className="text-sm text-gray-500 mt-1">
								{material.course?.courseCode} - {material.course?.title}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<div className="p-6 space-y-6">
					{/* Cover Image and Basic Info */}
					<div className="flex flex-col md:flex-row gap-6">
						{material.MaterialCover && (
							<div className="md:w-64 h-64 relative bg-gray-100 rounded-lg overflow-hidden">
								<Image
									src={material.MaterialCover}
									alt={material.title}
									fill
									className="object-cover"
								/>
							</div>
						)}

						<div className="flex-1 space-y-3">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-500">Price</p>
									<p className="text-xl font-bold text-indigo-600">
										{formatPrice(material.price, material.isFree)}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">File Type</p>
									<p className="text-gray-800">{material.fileType}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">File Size</p>
									<p className="text-gray-800">
										{formatFileSize(material.fileSize)}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Uploaded By</p>
									<p className="text-gray-800">
										{material.uploadedBy.firstName}{' '}
										{material.uploadedBy.lastName}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Created</p>
									<p className="text-gray-800">
										{formatDate(material.createdAt)}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Last Updated</p>
									<p className="text-gray-800">
										{formatDate(material.updatedAt)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Description */}
					{material.description && (
						<div>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								Description
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{material.description}
							</p>
						</div>
					)}

					{/* Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="bg-gray-50 rounded-lg p-4 text-center">
							<Download className="w-6 h-6 text-blue-500 mx-auto mb-2" />
							<p className="text-2xl font-bold text-gray-800">
								{material.downloadCount.toLocaleString()}
							</p>
							<p className="text-sm text-gray-500">Total Downloads</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4 text-center">
							<Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
							<p className="text-2xl font-bold text-gray-800">
								{material.averageRating.toFixed(1)}
							</p>
							<p className="text-sm text-gray-500">Average Rating</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4 text-center">
							<Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
							<p className="text-2xl font-bold text-gray-800">
								{material.ratingCount}
							</p>
							<p className="text-sm text-gray-500">Total Ratings</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4 text-center">
							<DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
							<p className="text-2xl font-bold text-gray-800">
								₦
								{(
									parseFloat(material.price) * material.downloadCount
								).toLocaleString()}
							</p>
							<p className="text-sm text-gray-500">Estimated Revenue</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="border-t border-gray-200 pt-6 flex gap-3">
						<button
							onClick={handlePreview}
							className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
						>
							<Eye className="w-4 h-4" />
							Preview Material
						</button>
						<button
							onClick={handleDownload}
							className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
						>
							<Download className="w-4 h-4" />
							Download
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
