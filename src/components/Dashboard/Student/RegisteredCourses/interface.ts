export interface RegisteredCourse {
  id: string;
  courseCode: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  status: string;
  department: string;
  departmentId: string;
  courseCredits?: number;
  semester?: number;
  level?: number;
  registeredAt: string;

  progress?: number;
  lastAccessed?: string;
  MaterialCover?: string;
  lecturer?: {
    id?: string;
    firstName: string;
    lastName: string;
  };
  rating?: number;
  fileURL?: string;
  nextClass?: {
    day: string;
    time: string;
    venue: string;
  };
  assignments?: {
    id: string;
    title: string;
    dueDate: string;
    status: "pending" | "submitted" | "graded";
  }[];
}

export interface RegisteredCoursesResponse {
  success: boolean;
  message: string;
  meta: RegisteredCoursesResponseMeta;
  data: RegisteredCourse[];
}

export interface RegisteredCoursesResponseMeta {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RegisteredCoursesClientProps {
  meta: RegisteredCoursesResponseMeta;
  courses: RegisteredCourse[];
  error: string | null;
}
