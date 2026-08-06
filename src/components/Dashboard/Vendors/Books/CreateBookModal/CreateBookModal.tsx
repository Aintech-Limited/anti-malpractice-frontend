/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import {
	X,
	Image as ImageIcon,
	FileText,
	AlertCircle,
	Loader,
} from 'lucide-react';
import { ICreateBookModalProps, TCreateBookPayload } from './interface';
import { IUploadResponse } from '../../../Lecturer/CourseMaterials/interface';

export const CreateBookModal = ({
	onClose,
	onSuccess,
}: ICreateBookModalProps) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [uploadingCover, setUploadingCover] = useState(false);
	const [uploadingFile, setUploadingFile] = useState(false);
	const [coverPreview, setCoverPreview] = useState<string>('');
	const [coverData, setCoverData] = useState<{
		publicId: string;
		url: string;
		fileSize: number;
	} | null>(null);
	const [fileData, setFileData] = useState<{
		publicId: string;
		url: string;
		fileSize: number;
		fileInfo?: any;
	} | null>(null);

	const [formData, setFormData] = useState<Partial<TCreateBookPayload>>({
		title: '',
		description: '',
		fileType: 'PDF',
		isFree: false,
		price: 0,
	});

	useEffect(() => {
		return () => {
			if (coverPreview) {
				URL.revokeObjectURL(coverPreview);
			}
		};
	}, [coverPreview]);

	const uploadCoverImage = async (file: File): Promise<IUploadResponse> => {
		try {
			const formData = new FormData();
			formData.append('cover', file);

			const response = await fetch('/api/v1/uploads/materials/cover', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			console.log('data: ', data);

			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const uploadMaterialFile = async (file: File): Promise<IUploadResponse> => {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/v1/uploads/materials/file', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			console.log('data: ', data);

			return data;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			setError('Please upload an image file for the cover');
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			setError('Cover image must be less than 5MB');
			return;
		}

		// Create preview
		const previewUrl = URL.createObjectURL(file);
		setCoverPreview(previewUrl);

		setUploadingCover(true);
		setError('');

		try {
			// Upload to server
			const response = await uploadCoverImage(file);
			if (response.success) {
				setCoverData({
					publicId: response.data.publicId,
					url: response.data.url,
					fileSize: response.data.fileSize,
				});
				setFormData((prev) => ({ ...prev, materialCover: response.data.url }));
			} else {
				setError(response.message || 'Failed to upload cover image');
				setCoverPreview('');
			}
		} catch (err) {
			setError('Failed to upload cover image');
			setCoverPreview('');
		} finally {
			setUploadingCover(false);
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type (only PDF for now)
		if (file.type !== 'application/pdf') {
			setError('Only PDF files are allowed');
			return;
		}

		// Validate file size (max 50MB)
		if (file.size > 50 * 1024 * 1024) {
			setError('File must be less than 50MB');
			return;
		}

		setUploadingFile(true);
		setError('');

		try {
			const response = await uploadMaterialFile(file);
			if (response.success) {
				setFileData({
					publicId: response.data.publicId,
					url: response.data.url,
					fileSize: response.data.fileSize, // in bytes
					fileInfo: response.data.fileInfo,
				});
				setFormData((prev) => ({
					...prev,
					fileURL: response.data.url,
					publicId: response.data.publicId,
					fileSize: response.data.fileSize, // in bytes
				}));
			} else {
				setError(response.message || 'Failed to upload file');
			}
		} catch (err) {
			setError('Failed to upload file');
		} finally {
			setUploadingFile(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate required fields
		if (!formData.title?.trim()) {
			setError('Please enter a title');
			return;
		}
		if (!coverData) {
			setError('Please upload a cover image');
			return;
		}
		if (!fileData) {
			setError('Please upload the material file');
			return;
		}
		if (!formData.isFree && (!formData.price || formData.price <= 0)) {
			setError('Please set a price for paid materials');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const payload: TCreateBookPayload = {
				title: formData.title!,
				materialCover: coverData.url,
				fileType: formData.fileType as 'PDF' | 'VIDEO' | 'DOCUMENT',
				description: formData.description || '',
				fileURL: fileData.url,
				publicId: fileData.publicId,
				price: formData.isFree ? 0 : formData.price!,
				isFree: formData.isFree || false,
				fileSize: fileData.fileSize,
			};

			const response = await fetch('/api/v1/course-materials/vendors', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (data.success) {
				onSuccess(data.data);
			} else {
				setError(data?.message || 'Failed to create material');
			}
		} catch (err) {
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4">
			<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-100 rounded-full">
							<FileText className="w-6 h-6 text-indigo-600" />
						</div>
						<h2 className="text-2xl font-bold text-gray-800">Upload Books</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
							<AlertCircle className="w-5 h-5" />
							<span className="text-sm">{error}</span>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Book Title *
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							placeholder="e.g., Introduction to Quantum Physics"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							rows={3}
							placeholder="Describe what students will learn from this Books..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							File Type *
						</label>
						<select
							value={formData.fileType}
							onChange={(e) =>
								setFormData({ ...formData, fileType: e.target.value as any })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
						>
							<option value="" disabled>
								Select a Book type
							</option>
							<option value="PDF">PDF</option>
						</select>
					</div>

					{/* Cover Image Upload */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Cover Image *
						</label>
						<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
							<div className="space-y-1 text-center">
								{coverPreview ? (
									<div className="relative">
										{/* <Image
                      src={coverPreview}
                      alt="Cover preview"
                      width={200}
                      height={150}
                      className="mx-auto rounded-lg object-cover"
                    /> */}
										<img
											src={coverData?.url || coverPreview}
											alt="Cover preview"
											className="mx-auto rounded-lg object-cover w-50 h-37.5"
										/>
										<button
											type="button"
											onClick={() => {
												setCoverPreview('');
												setCoverData(null);
											}}
											className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								) : (
									<>
										<ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
										<div className="flex text-sm text-gray-600">
											<label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
												<span>Upload a cover image</span>
												<input
													type="file"
													className="sr-only"
													accept="image/*"
													onChange={handleCoverUpload}
													disabled={uploadingCover}
												/>
											</label>
											<p className="pl-1">or drag and drop</p>
										</div>
										<p className="text-xs text-gray-500">
											PNG, JPG, GIF up to 5MB
										</p>
									</>
								)}
								{uploadingCover && (
									<div className="flex items-center justify-center gap-2 text-indigo-600">
										<Loader className="w-4 h-4 animate-spin" />
										<span className="text-sm">Uploading...</span>
									</div>
								)}
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Books File (PDF) *
						</label>
						<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
							<div className="space-y-1 text-center">
								{fileData ? (
									<div className="text-center">
										<FileText className="mx-auto h-12 w-12 text-green-500" />
										<p className="text-sm text-gray-600 mt-2">
											{fileData.fileInfo?.originalName || 'File uploaded'}
										</p>
										<button
											type="button"
											onClick={() => setFileData(null)}
											className="mt-2 text-sm text-red-600 hover:text-red-700"
										>
											Remove
										</button>
									</div>
								) : (
									<>
										<FileText className="mx-auto h-12 w-12 text-gray-400" />
										<div className="flex text-sm text-gray-600">
											<label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
												<span>Upload a PDF file</span>
												<input
													type="file"
													className="sr-only"
													accept=".pdf"
													onChange={handleFileUpload}
													disabled={uploadingFile}
												/>
											</label>
											<p className="pl-1">or drag and drop</p>
										</div>
										<p className="text-xs text-gray-500">PDF up to 50MB</p>
									</>
								)}
								{uploadingFile && (
									<div className="flex items-center justify-center gap-2 text-indigo-600">
										<Loader className="w-4 h-4 animate-spin" />
										<span className="text-sm">Uploading...</span>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								id="isFree"
								checked={formData.isFree}
								onChange={(e) =>
									setFormData({
										...formData,
										isFree: e.target.checked,
										price: e.target.checked ? 0 : formData.price,
									})
								}
								className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
							/>
							<label
								htmlFor="isFree"
								className="text-sm font-medium text-gray-700"
							>
								Make this material free
							</label>
						</div>

						{!formData.isFree && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Price (₦) *
								</label>
								<input
									type="number"
									min="0"
									step="100"
									value={formData.price}
									onChange={(e) =>
										setFormData({
											...formData,
											price: parseFloat(e.target.value) || 0,
										})
									}
									placeholder="Enter price in Naira"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
									required={!formData.isFree}
								/>
							</div>
						)}
					</div>

					<div className="border-t border-gray-200 pt-6 flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading || uploadingCover || uploadingFile}
							className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : (
								'Upload Material'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
