export interface IExamsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    type_?: string;
    sortBy?: string;
    sortOrder?: string;
    published?: "true" | "false";
  }>;
}

export interface IExam {
  id: string;
  courseId: string;
  title: string;
  year: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  type_: "ONLINE" | "PHYSICAL";
  totalMarks: number;
  fee: number;
  mcqMarks: number;
  shortMarks: number;
  published: boolean;
  course?: {
    id: string;
    title: string;
    courseCode: string;
  };
}

export interface ICourseAssignment {
  id: string;
  courseCode: string;
  title: string;
}

export type TExamQuestionType =
  "MCQ" | "TRUE_FALSE" | "FILL_BLANK" | "SHORT" | "ESSAY";
export interface IExamQuestion {
  exam: {
    title: string;
    published: boolean;
  };
  id: string;
  examId: string;
  questionText: string;
  type: TExamQuestionType;
  marks: number;
  displayOrder: number;
  options: {
    id: string;
    displayOrder: number;
    examQuestionId: string;
    optionText: string;
    isCorrect: boolean;
  }[];
}

export interface IExamOption {
  id: string;
  examQuestionId: string;
  optionText: string;
  isCorrect?: boolean;
  displayOrder?: number;
}

export interface ICreateExamPayload {
  courseId: string;
  title: string;
  year: string;
  startTime: string;
  endTime: string;
  type_: "ONLINE" | "PHYSICAL";
  mcqMarks: number;
  shortMarks: number;
  published: boolean;
  registrationDeadline: string;
  mcqDurationMinutes?: number;
  shortDurationMinutes?: number;
  fee: number;
  instructions: string[];
}

export interface IAddQuestionsPayload {
  examId: string;
  questions: IQuestionInput[];
}

export interface IQuestionInput {
  questionText: string;
  type: "MCQ" | "SHORT" | "ESSAY";
  marks: number;
  mcqOptions?: IMCQOptionInput[];
  shortOptions?: IShortOptionInput;
}

export interface IMCQOptionInput {
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
}
export interface IShortOptionInput {
  maxLength?: number;
  keywords?: string[];
}

export interface IExamsApiResponse {
  message: string;
  success: boolean;
  data: IExam[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IExamFilters {
  page: number;
  limit: number;
  status: string;
  type_: string;
  sortBy: string;
  sortOrder: string;
  published?: boolean;
}

export interface IExamsProps {
  initialExams: IExam[];
  initialMeta: any;
  availableCourses: ICourseAssignment[];
  initialFilters: any;
}

export interface IUpdateQuestionPayload {
  questionText?: string;
  type?: TExamQuestionType;
  marks?: number;
  options?: {
    id?: string;
    optionText: string;
    isCorrect: boolean;
    displayOrder: number;
  }[];
}
