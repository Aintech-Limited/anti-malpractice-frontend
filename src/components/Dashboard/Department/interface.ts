export interface IDepartment {
  id: string;
  name: string;
  description: string;
  imageURL: string;
}

export interface IApiResponse {
  message: string;
  success: boolean;
  data: IDepartment[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IDepartmentsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    name?: string;
  }>;
}
export interface IDepartment {
  id: string;
  name: string;
  description: string;
  imageURL: string;
}

export interface IMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IDepartmentsClientProps {
  initialDepartments: IDepartment[];
  initialMeta: IMeta;
  initialSearchTerm: string;
}
export interface IDepartmentStats {
  students: number;
  faculty: number;
  courses: number;
  researchGroups: number;
  established: string;
  location: string;
  email: string;
  phone: string;
  vision: string;
  mission: string;
  achievements: string[];
}
export interface INotification {
  type: "success" | "error";
  message: string;
}
