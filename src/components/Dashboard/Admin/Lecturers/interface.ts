export interface ILecturersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    departmentId?: string;
    isActive?: string;
    idVerified?: string;
    selfieVerified?: string;
  }>;
}
export interface ILecturersClientProps {
  initialData: ILecturersResponse;
  initialPage: number;
  limit: number;
  departments: { id: string; name: string }[];
}

import {
  TAssignedLecturerStatusEnumValue,
  TLecturerROleEnumValue,
} from "@/src/lib/enums";

export interface ILecturerProps {
  initialLecturersData: ILecturer[];
  success: boolean;
}
export interface IfetchLecturerResponse {
  data: ILecturer[];
  message: string;
  success: boolean;
}

export interface ILecturer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: {
    role: TLecturerROleEnumValue;
    courseCode: string;
    departmentName: string;
    departmentId: string;
  }[];
  phoneNumber?: string;
  idDocumentUrl?: string;
  selfieUrl?: string;
  idVerified: boolean;
  // selfieVerified?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  bio?: string;
  university?: string;
  location?: string;
  imageUrl?: string;
}

export interface ILecturersResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  data: ILecturer[];
}

export interface ILecturerCourse {
  id: string;
  courseCode: string;
  title: string;
  department: { id: string; name: string };
  creditHours: number;
  semester: number;
  level: number;
}

export interface ILecturerAssignment {
  id: string;
  course: {
    id: string;
    courseCode: string;
    title: string;
  };
  lecturerId: string;
  role: TLecturerROleEnumValue;
  status: TAssignedLecturerStatusEnumValue;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt?: string;
}

export interface IAssignCourseData {
  lecturerId: string;
  courseId: string;
  role: TLecturerROleEnumValue;
  status: TAssignedLecturerStatusEnumValue;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface ILecturerFilters {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  isActive?: boolean;
  idVerified?: boolean;
  selfieVerified?: boolean;
}
