export const REGISTRATION_STATUS = {
  IN_PROGRESS: {
    label: "Payment Pending",
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-200",
    icon: "Clock",
  },
  FAILED: {
    label: "Payment Failed",
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-200",
    icon: "XCircle",
  },
  REGISTERED: {
    label: "Registered",
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-200",
    icon: "CheckCircle",
  },
} as const;

export const SORT_OPTIONS = [
  { value: "registeredAt", label: "Registration Date" },
  { value: "exam.title", label: "Exam Title" },
  { value: "level", label: "Level" },
  { value: "semester", label: "Semester" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "ASC", label: "Ascending" },
  { value: "DESC", label: "Descending" },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "IN_PROGRESS", label: "Payment Pending" },
  { value: "REGISTERED", label: "Registered" },
  { value: "FAILED", label: "Payment Failed" },
] as const;
