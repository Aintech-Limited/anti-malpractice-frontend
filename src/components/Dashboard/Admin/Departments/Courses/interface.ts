import {
  TAssignedLecturerStatusEnumValue,
  TCourseStatusEnum,
  TLecturerROleEnumValue,
} from "@/src/lib/enums";

export interface IDepartmetCoursesPageProps {
  params: Promise<{
    departmentId: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    creditHours?: string;
    semester?: string;
    level?: string;
    status?: TCourseStatusEnum;
  }>;
}

export interface IAdminDepartmentCoursesClientProps {
  departmentId: string;
  initialData: ICoursesResponse;
  initialPage: number;
  limit: number;
}
export interface ICreator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ICourse {
  id: string;
  creator: ICreator;
  title: string;
  courseCode: string;
  description?: string;
  creditHours: number;
  semester: number;
  level: number;
  status: TCourseStatusEnum;
  createdAt: string;
  prerequisites: string[];
}

export interface ILecturerAssignment {
  id: string;
  courseId: string;
  lecturerId: string;
  lecturer: {
    id: string;
    name: string;
    email: string;
  };
  role: TLecturerROleEnumValue;
  status: TAssignedLecturerStatusEnumValue;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: string;
}

export interface ICoursesResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  data: ICourse[];
}

export interface ICreateCourseData {
  title: string;
  courseCode: string;
  description?: string;
  creditHours: number;
  semester: number;
  level: number;
  status: TCourseStatusEnum;
  prerequisites: string[];
  departmentId: string;
}

export interface IUpdateCourseData {
  title?: string;
  courseCode?: string;
  description?: string;
  creditHours?: number;
  semester?: number;
  level?: number;
  status?: TCourseStatusEnum;
  prerequisites?: string[];
}

export interface IAssignLecturerData {
  courseId: string;
  lecturerId: string;
  role: TLecturerROleEnumValue;
  status: TAssignedLecturerStatusEnumValue;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface ILecturer {
  id: string;
  name: string;
  email: string;
  departmentId: string;
}

export interface ICourseFilters {
  page?: number;
  limit?: number;
  creditHours?: number;
  semester?: number;
  level?: number;
  status?: TCourseStatusEnum;
}
