import { IMeta } from '../../Department/interface';

export interface IBook {
	id: string;
	courseId: string;
	title: string;
	description: string;
	MaterialCover: string;
	isFree: boolean;
	price: string;
	fileType: 'PDF' | 'VIDEO' | 'DOCUMENT';
	fileURL: string;
	publicId: string;
	fileSize: number;
	mimeType: string | null;
	averageRating: number;
	ratingCount: number;
	downloadCount: number;
	createdAt: string;
	updatedAt: string;
	uploadedBy: {
		id: string;
		firstName: string;
		lastName: string;
	};
	course?: {
		id: string;
		title: string;
		courseCode: string;
	};
}

export interface IBookClientProps {
	initialBooks: { books: IBook[]; totalRevenue: number };
	initialMeta: IMeta;
	initialFilters: TBookFilters;
}

export type TCreateBook = {
	title: string;
	materialCover: string;
	fileType: 'PDF' | 'VIDEO' | 'DOCUMENT';
	description: string;
	fileURL: string;
	publicId: string;
	price: number;
	isFree: boolean;
	courseId: string;
	fileSize: number;
};
export type TUpdateBook = {
	title?: string;
	materialCover?: string;
	description?: string;
	price?: number;
	isFree?: boolean;
};
export type TBooksApiResponse = {
	message: string;
	success: boolean;
	data: { materials: IBook[]; totalRevenue: number };
	meta: {
		page: number;
		limit: number;
		totalItems: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};
export type TUploadBookResponse = {
	message: string;
	success: boolean;
	data: {
		publicId: string;
		url: string;
		fileSize: number;
		fileInfo?: {
			originalName: string;
			mimeType: string;
			size: number;
			sizeInMB: string;
			extension: string;
		};
	};
};
export type TBookFilters = {
	page: number;
	limit: number;
	sortBy: string;
	sortOrder: string;
	fileType: string;
	isFree: string;
	search: string;
};
