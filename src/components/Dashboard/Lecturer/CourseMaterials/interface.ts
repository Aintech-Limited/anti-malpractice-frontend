export interface ICourseMaterialsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    fileType?: string;
    isFree?: string;
    search?: string;
  }>;
}

export interface ICourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description: string;
  MaterialCover: string;
  isFree: boolean;
  price: string;
  fileType: "PDF" | "VIDEO" | "DOCUMENT";
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

export interface IAssignedCourse {
  id: string;
  title: string;
  courseCode: string;
}

export interface ICreateMaterialPayload {
  title: string;
  materialCover: string;
  fileType: "PDF" | "VIDEO" | "DOCUMENT";
  description: string;
  fileURL: string;
  publicId: string;
  price: number;
  isFree: boolean;
  courseId: string;
  fileSize: number;
}

export interface IUpdateMaterialPayload {
  title?: string;
  materialCover?: string;
  description?: string;
  price?: number;
  isFree?: boolean;
}

export interface IMaterialsApiResponse {
  message: string;
  success: boolean;
  data: { materials: ICourseMaterial[]; totalRevenue: number };
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IUploadResponse {
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
}

export interface ICourseMaterialsProps {
  initialMaterials: IMaterialsApiResponse["data"];
  initialMeta: IMaterialsApiResponse["meta"];
  assignedCourses: IAssignedCourse[];
  initialFilters: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    fileType: string;
    isFree: string;
    search: string;
  };
}
export interface IMaterialFilters {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  fileType: string;
  isFree: string;
  search: string;
}

export interface IRawMaterialFilters {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  fileType?: string;
  isFree?: string;
  search?: string;
}
