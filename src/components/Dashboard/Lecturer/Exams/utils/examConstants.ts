export const EXAM_STATUS = {
  UPCOMING: {
    label: "Upcoming",
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-200",
  },
  ONGOING: {
    label: "Ongoing",
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
    borderColor: "border-gray-200",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-200",
  },
} as const;

export const EXAM_TYPES = {
  ONLINE: { label: "Online", color: "bg-purple-100 text-purple-800" },
  PHYSICAL: { label: "Physical", color: "bg-orange-100 text-orange-800" },
} as const;

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "startTime", label: "Start Time" },
  { value: "title", label: "Title" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "ASC", label: "Ascending" },
  { value: "DESC", label: "Descending" },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const PUBLISHED_OPTIONS = ["True", "False", "All"] as const;

export const QUESTION_TYPES = [
  { value: "MCQ", label: "Multiple Choice" },
  { value: "SHORT", label: "Short Answer" },
  { value: "ESSAY", label: "Essay" },
] as const;
