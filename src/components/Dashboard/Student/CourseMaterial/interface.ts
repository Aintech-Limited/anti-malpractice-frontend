export interface ICourseMaterialsProps {
  searchParams: Promise<ICourseMaterialsQuery>;
}
export interface ICourseMaterialsQuery {
  page?: number;
  limit?: number;
  stats?: boolean;
  sort?: string;
}

export interface IPurchasedCourseMaterialsResponse {
  message: string;
  success: boolean;
  meta: Meta;
  data: CourseMaterialsData;
}

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CourseMaterialsData {
  stats: Stats;
  materials: Material[];
}

export interface Stats {
  total: number;
  inProgress: number;
  completed: number;
  wishlist: number;
}

export interface Material {
  id: string;
  courseCode: string;
  title: string;
  MaterialCover: string;
  price: string;
  fileType: string;
  fileURL: string;
  purchasedAt: string; // ISO date string
  lecturer: Lecturer;
  progress: number;
  rating: number;
}

export interface Lecturer {
  id: string;
  firstName: string;
  lastName: string;
}
