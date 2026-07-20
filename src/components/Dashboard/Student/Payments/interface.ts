export interface IPaymentsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    type?: "EXAM_REGISTRATION" | "COURSE_MATERIAL";
    sortBy?: string;
  }>;
}

export interface IPayment {
  id?: string;
  paymentProvider?: string;
  transactionId?: string;
  student?: { firstName: string; lastName: string; id?: string };
  amount: string;
  currency: string;
  courseMaterialId?: string;
  examRegistrationId?: string;
  merchandiseName: "EXAM_REGISTRATION" | "COURSE_MATERIAL";
  paymentStatus?: string;
  createdAt?: string;
  updatedAt: string;
  courseMaterial?: {
    id: string;
    title: string;
    MaterialCover: string;
    course: {
      courseCode: string;
      id: string;
      title: string;
    };
  };
  examRegistration?: {
    id?: string;
    level: number;
    paymentId?: string;
    registeredAt: string; // date
    registrationStatus?: TExamRegistrationStatus;
    semester: string;
    updatedAt: string; // date
    course: {
      id: string;
      title: string;
      courseCode: string;
    };
    exam: {
      id: string;
      title: string;
      startTime: string; // date
      endTime: string; // date
    };
  };
}

export interface IPaymentApiResponse {
  message: string;
  success: boolean;
  data: IPayment[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IPaymentsClientProps {
  initialData: IPaymentApiResponse;
  initialFilters: {
    type: string;
    sortBy: string;
    page: number;
    limit: number;
  };
}

type TExamRegistrationStatus =
  "REGISTERED" | "IN_PROGRESS" | "CANCELLED" | "FAILED";

export interface ICourseModalProps {
  payment: IPayment;
  onClose: () => void;
}

export interface IStatsCardProps {
  totalTransactions: number;
  totalAmount: number;
  currentPage: number;
  totalPages: number;
}

export interface IFilters {
  type: string;
  sortBy: string;
  page: number;
  limit: number;
}
