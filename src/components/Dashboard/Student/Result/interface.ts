import { TResultStatusEnum, UserRoleTypeEnumValue } from "@/src/lib/enums";

export interface IMetaData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IExamResult {
  grade: string;
  score: number;
  submittedAt: string;
  examAttempt: {
    passed: boolean;
    exam: {
      title: string;
      course: {
        title: string;
        courseCode: string;
      };
    };
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface ExamResultsResponse {
  message: string;
  success: boolean;
  meta: IMetaData;
  data: IExamResult[];
}

export interface IStaffFilters {
  courseCode?: string;
  studentId?: string;
  departmentId?: string;
  examId?: string;
  status?: TResultStatusEnum;
  sortBy?: "submittedAt" | "createdAt";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export interface IStudentFilters {
  courseCode: string;
  page?: number;
  limit?: number;
}

export interface DownloadOptions {
  format: "PDF" | "CSV";
  filters?: IStaffFilters | IStudentFilters;
  role: UserRoleTypeEnumValue;
}

export interface IUseExamResultsProps {
  role: UserRoleTypeEnumValue;
  initialFilters?: IStaffFilters | IStudentFilters;
  initialPage?: number;
  initialLimit?: number;
}

export interface IStudentExamResultsProps {
  initialPage?: number;
  initialLimit?: number;
}

export interface IStaffExamResultsProps {
  role: UserRoleTypeEnumValue;
  departments?: { id: string; name: string }[];
  exams?: { id: string; title: string }[];
  initialPage?: number;
  initialLimit?: number;
}

export interface IExamResultsProps {
  departments?: { id: string; name: string }[];
  exams?: { id: string; title: string }[];
  initialPage?: number;
  initialLimit?: number;
}
